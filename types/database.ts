import type { ResumeData } from "./resume";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          plan: "free" | "premium" | "lifetime" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string;
          email?: string;
          plan?: "free" | "premium" | "lifetime" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          plan?: "free" | "premium" | "lifetime" | "admin";
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          template_id: string;
          resume_data: ResumeData;
          section_order: string[];
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          slug: string;
          template_id: string;
          resume_data: ResumeData;
          section_order: string[];
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          template_id?: string;
          resume_data?: ResumeData;
          section_order?: string[];
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      anonymous_resumes: {
        Row: {
          id: string;
          session_id: string;
          resume_data: ResumeData;
          template_id: string | null;
          progress: number;
          ats_score: number;
          source: string;
          status: string;
          user_email: string | null;
          user_phone: string | null;
          user_name: string | null;
          downloaded_at: string | null;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
          user_agent: string | null;
          device_type: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          ip_country: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          resume_data?: ResumeData;
          template_id?: string | null;
          progress?: number;
          ats_score?: number;
          source?: string;
          status?: string;
          user_email?: string | null;
          user_phone?: string | null;
          user_name?: string | null;
          downloaded_at?: string | null;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
          user_agent?: string | null;
          device_type?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ip_country?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["anonymous_resumes"]["Insert"], "session_id">>;
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          preview_image_url: string | null;
          is_premium: boolean;
          is_active: boolean;
          layout_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          description?: string;
          preview_image_url?: string | null;
          is_premium?: boolean;
          is_active?: boolean;
          layout_type?: string;
        };
        Update: Partial<Database["public"]["Tables"]["templates"]["Insert"]>;
        Relationships: [];
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          template_id: string;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          template_id: string;
          downloaded_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_payment_id: string;
          amount: number;
          currency: string;
          status: string;
          plan: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          provider_payment_id: string;
          amount: number;
          currency: string;
          status: string;
          plan: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          is_active: boolean;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type?: string;
          discount_value?: number;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
        Relationships: [];
      };
      coupon_redemptions: {
        Row: {
          id: string;
          user_id: string;
          coupon_code: string;
          discount_amount: number;
          original_amount: number;
          final_amount: number;
          redeemed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coupon_code: string;
          discount_amount?: number;
          original_amount?: number;
          final_amount?: number;
          redeemed_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: "new" | "in_progress" | "resolved" | "spam";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: "new" | "in_progress" | "resolved" | "spam";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "new" | "in_progress" | "resolved" | "spam";
          updated_at?: string;
        };
        Relationships: [];
      };
      cover_letters: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          title: string;
          company_name: string | null;
          target_job_title: string | null;
          hiring_manager_name: string | null;
          tone: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          title?: string;
          company_name?: string | null;
          target_job_title?: string | null;
          hiring_manager_name?: string | null;
          tone?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["cover_letters"]["Insert"], "user_id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      increment_coupon_usage: {
        Args: { coupon_code_input: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
