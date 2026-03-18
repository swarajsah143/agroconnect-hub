import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for OTP (in production, use bcrypt)
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
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check rate limiting (max 3 OTPs per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentOtps, error: countError } = await supabaseAdmin
      .from("otp_verifications")
      .select("id")
      .eq("email", email.toLowerCase())
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
    }

    if (recentOtps && recentOtps.length >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many OTP requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Delete any existing unverified OTPs for this email
    await supabaseAdmin
      .from("otp_verifications")
      .delete()
      .eq("email", email.toLowerCase())
      .eq("verified", false);

    // Store hashed OTP
    const { error: insertError } = await supabaseAdmin
      .from("otp_verifications")
      .insert({
        email: email.toLowerCase(),
        otp_hash: otpHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "AgroConnect <onboarding@resend.dev>",
      to: [email],
      subject: "Your AgroConnect Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a; text-align: center;">AgroConnect</h1>
          <h2 style="text-align: center;">Email Verification</h2>
          <p style="text-align: center; font-size: 16px;">Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16a34a;">${otp}</span>
          </div>
          <p style="text-align: center; color: #666; font-size: 14px;">This code expires in 5 minutes.</p>
          <p style="text-align: center; color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`OTP sent successfully to ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
