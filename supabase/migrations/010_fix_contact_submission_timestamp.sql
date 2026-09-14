-- Avoid colliding with PostgreSQL's CURRENT_TIME built-in inside the contact RPC.
-- The original local variable name could resolve to a time with time zone instead
-- of the intended timestamp with time zone during the stale-limit cleanup.
create or replace function public.submit_contact_message(
  contact_name text,
  contact_email text,
  contact_subject text,
  contact_message text,
  email_fingerprint text,
  network_fingerprint text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  request_timestamp timestamptz := clock_timestamp();
  email_count integer;
  network_count integer;
begin
  if email_fingerprint !~ '^[a-f0-9]{64}$'
    or network_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception 'INVALID_CONTACT_FINGERPRINT' using errcode = '22023';
  end if;

  delete from public.contact_submission_limits
  where last_seen_at < request_timestamp - interval '24 hours';

  insert into public.contact_submission_limits as limits (
    fingerprint_type,
    fingerprint,
    window_started_at,
    submission_count,
    last_seen_at
  ) values (
    'email',
    email_fingerprint,
    request_timestamp,
    1,
    request_timestamp
  )
  on conflict (fingerprint_type, fingerprint) do update set
    window_started_at = case
      when limits.window_started_at <= request_timestamp - interval '15 minutes' then request_timestamp
      else limits.window_started_at
    end,
    submission_count = case
      when limits.window_started_at <= request_timestamp - interval '15 minutes' then 1
      else limits.submission_count + 1
    end,
    last_seen_at = request_timestamp
  returning submission_count into email_count;

  insert into public.contact_submission_limits as limits (
    fingerprint_type,
    fingerprint,
    window_started_at,
    submission_count,
    last_seen_at
  ) values (
    'network',
    network_fingerprint,
    request_timestamp,
    1,
    request_timestamp
  )
  on conflict (fingerprint_type, fingerprint) do update set
    window_started_at = case
      when limits.window_started_at <= request_timestamp - interval '15 minutes' then request_timestamp
      else limits.window_started_at
    end,
    submission_count = case
      when limits.window_started_at <= request_timestamp - interval '15 minutes' then 1
      else limits.submission_count + 1
    end,
    last_seen_at = request_timestamp
  returning submission_count into network_count;

  if email_count > 3 or network_count > 5 then
    raise exception 'CONTACT_RATE_LIMITED' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (name, email, subject, message, status)
  values (contact_name, contact_email, contact_subject, contact_message, 'new');
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from anon;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from authenticated;
grant execute on function public.submit_contact_message(text, text, text, text, text, text) to service_role;
