import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Sprout, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RESEND_COOLDOWN_SECONDS = 30;

type AuthStep = 'email' | 'otp' | 'profile';

const dashboardMap: Record<UserRole, string> = {
  farmer: '/farmer-dashboard',
  buyer: '/buyer-dashboard',
  expert: '/expert-dashboard',
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, sendOtp, verifyOtp, completeProfile, logout } = useAuth();

  const defaultRole = (searchParams.get('role') as UserRole) || 'farmer';
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (profile) {
      navigate(dashboardMap[profile.role], { replace: true });
      return;
    }

    if (!loading && user && !profile) {
      setStep('profile');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      if (resendTimerRef.current) {
        window.clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
      return;
    }

    resendTimerRef.current = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) {
            window.clearInterval(resendTimerRef.current);
            resendTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (resendTimerRef.current) {
        window.clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
    };
  }, [resendCooldown]);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      toast({
        variant: 'destructive',
        title: 'Invalid email',
        description: 'Enter a valid email address.',
      });
      return;
    }

    setSendingOtp(true);
    const result = await sendOtp(normalizedEmail);
    setSendingOtp(false);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'OTP send failed',
        description: result.error || 'Failed to send OTP. Try again.',
      });
      return;
    }

    setEmail(normalizedEmail);
    setOtp('');
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    setStep('otp');
    toast({
      title: 'OTP sent',
      description: 'Check your inbox and spam folder for the 6-digit code.',
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Enter the 6-digit code sent to your email.',
      });
      return;
    }

    setVerifyingOtp(true);
    const result = await verifyOtp(email, otp);
    setVerifyingOtp(false);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: result.error || 'Invalid or expired OTP. Try again.',
      });
      return;
    }

    if (result.needsProfile) {
      setStep('profile');
      toast({
        title: 'Email verified',
        description: 'Complete your account to continue.',
      });
      return;
    }

    const nextRole = result.profile?.role ?? profile?.role;
    if (nextRole) {
      toast({
        title: 'Login successful',
        description: 'You are now signed in.',
      });
      navigate(dashboardMap[nextRole], { replace: true });
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setSendingOtp(true);
    const result = await sendOtp(email);
    setSendingOtp(false);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'OTP send failed',
        description: result.error || 'Failed to send OTP. Try again.',
      });
      return;
    }

    setOtp('');
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    toast({
      title: 'OTP resent',
      description: 'A new code has been sent to your email.',
    });
  };

  const handleCompleteProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing name',
        description: 'Enter your full name to finish setup.',
      });
      return;
    }

    setSavingProfile(true);
    const result = await completeProfile(name.trim(), role);
    setSavingProfile(false);

    if (!result.success || !result.profile) {
      toast({
        variant: 'destructive',
        title: 'Setup failed',
        description: result.error || 'Could not complete your account. Try again.',
      });
      return;
    }

    toast({
      title: 'Account ready',
      description: 'Your account has been created successfully.',
    });
    navigate(dashboardMap[result.profile.role], { replace: true });
  };

  const handleBackToEmail = async () => {
    setOtp('');
    setStep('email');
    setResendCooldown(0);
    if (user && !profile) {
      await logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Enter your OTP</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={verifyingOtp || sendingOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button className="w-full" onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length !== 6}>
              {verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendingOtp || resendCooldown > 0}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {sendingOtp
                  ? 'Sending...'
                  : resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Didn\'t receive the code? Resend'}
              </button>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Use a different email
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Complete your account</CardTitle>
            <CardDescription>
              Your email is verified. Add your details to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="expert">Agricultural Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif">Welcome to AgroConnect</CardTitle>
          <CardDescription>
            Sign in with a one-time code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={sendingOtp}>
              {sendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            New users will create their account automatically after email verification.
          </p>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-primary hover:underline"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
