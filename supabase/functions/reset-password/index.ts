import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email, OTP, and new password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the most recent OTP record for this email
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("email", email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "No verification found. Please request a new code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Code expired. Please request a new one." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otpHash = await hashOTP(otp);
    if (otpHash !== otpRecord.otp_hash) {
      await supabaseAdmin
        .from("otp_verifications")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id);
      return new Response(
        JSON.stringify({ error: "Invalid code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the auth user by email
    let foundUser: { id: string } | null = null;
    let page = 1;
    const perPage = 1000;
    while (!foundUser) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to look up account." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (match) {
        foundUser = { id: match.id };
        break;
      }
      if (data.users.length < perPage) break;
      page++;
    }

    if (!foundUser) {
      return new Response(
        JSON.stringify({ error: "No account found with that email." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      foundUser.id,
      { password: newPassword }
    );

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Invalidate the OTP record
    await supabaseAdmin
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in reset-password:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});