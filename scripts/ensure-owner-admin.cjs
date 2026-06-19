const { createClient } = require("@supabase/supabase-js");

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ownerEmail = (process.env.ADMIN_OWNER_EMAIL || "admin@resumi.live").trim().toLowerCase();
const ownerPassword = process.env.ADMIN_OWNER_PASSWORD;
const ownerName = process.env.ADMIN_OWNER_NAME || "Resumi Owner";

if (!supabaseUrl || !serviceRoleKey) {
  fail("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

if (!ownerPassword) {
  fail("ADMIN_OWNER_PASSWORD is required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

main().catch((error) => fail(error.message || String(error)));

async function main() {
  const user = await findOrCreateOwnerUser();

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      email: ownerEmail,
      full_name: ownerName,
      plan: "admin",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (profileError) {
    fail(`Admin auth user was updated, but profile promotion failed: ${profileError.message}`);
  }

  console.log(`Owner admin is ready: ${ownerEmail}`);
  console.log("Password was set from ADMIN_OWNER_PASSWORD.");
}

async function findOrCreateOwnerUser() {
  const existingUser = await findUserByEmail(ownerEmail);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: ownerPassword,
      email_confirm: true,
      user_metadata: {
        ...existingUser.user_metadata,
        full_name: ownerName,
      },
    });

    if (error) {
      fail(`Could not update owner auth user: ${error.message}`);
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
    user_metadata: {
      full_name: ownerName,
    },
  });

  if (error) {
    fail(`Could not create owner auth user: ${error.message}`);
  }

  return data.user;
}

async function findUserByEmail(email) {
  let page = 1;

  while (page < 100) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    });

    if (error) {
      fail(`Could not list auth users: ${error.message}`);
    }

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) {
      return user;
    }

    if (data.users.length < 100) {
      return null;
    }

    page += 1;
  }

  fail("Could not find owner user within the first 9,900 Supabase auth users.");
}

function loadLocalEnv() {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
