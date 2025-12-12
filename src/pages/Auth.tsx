import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Sprout, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type RegistrationStep = 'form' | 'otp';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const defaultRole = (searchParams.get('role') as UserRole) || 'farmer';
  
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP states
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('form');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sendOTP = async () => {
    setSendingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error,
        });
        return false;
      }

      toast({
        title: 'OTP Sent!',
        description: 'Check your email for the verification code.',
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async (): Promise<boolean> => {
    setVerifyingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: data.error,
        });
        return false;
      }

      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleRegistrationFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const success = await sendOTP();
    if (success) {
      setRegistrationStep('otp');
    }
  };

  const handleOtpVerifyAndRegister = async () => {
    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code.',
      });
      return;
    }

    const verified = await verifyOTP();
    if (!verified) return;

    setLoading(true);
    try {
      const result = await register(email, password, name, role);
      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'Your account has been successfully created.',
        });
        const dashboardMap = {
          farmer: '/farmer-dashboard',
          buyer: '/buyer-dashboard',
          expert: '/expert-dashboard'
        };
        navigate(dashboardMap[role]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: result.error || 'Could not create account. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password, role);
      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        const dashboardMap = {
          farmer: '/farmer-dashboard',
          buyer: '/buyer-dashboard',
          expert: '/expert-dashboard'
        };
        navigate(dashboardMap[role]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: result.error || 'Invalid credentials. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await sendOTP();
  };

  const handleBackToForm = () => {
    setRegistrationStep('form');
    setOtp('');
  };

  // OTP Verification Screen
  if (mode === 'register' && registrationStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
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

            <p className="text-center text-sm text-muted-foreground">
              Code expires in 5 minutes
            </p>

            <Button 
              className="w-full" 
              onClick={handleOtpVerifyAndRegister}
              disabled={verifyingOtp || loading || otp.length !== 6}
            >
              {(verifyingOtp || loading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {verifyingOtp ? 'Verifying...' : 'Creating Account...'}
                </>
              ) : (
                'Verify & Create Account'
              )}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendingOtp}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {sendingOtp ? 'Sending...' : "Didn't receive code? Resend"}
              </button>
              <button
                type="button"
                onClick={handleBackToForm}
                className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to registration
              </button>
            </div>
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
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <form onSubmit={mode === 'login' ? handleLogin : handleRegistrationFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="expert">Agricultural Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || sendingOtp}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : sendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </Tabs>

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
