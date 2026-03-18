import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'farmer' | 'buyer' | 'expert';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface VerifyOtpResult extends AuthResult {
  needsProfile?: boolean;
  profile?: UserProfile | null;
}

interface ProfileResult extends AuthResult {
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  sendOtp: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, token: string) => Promise<VerifyOtpResult>;
  completeProfile: (name: string, role: UserRole) => Promise<ProfileResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return null;
    }

    const nextProfile = (data as UserProfile | null) ?? null;
    setProfile(nextProfile);
    return nextProfile;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        setTimeout(() => {
          fetchProfile(nextSession.user.id).finally(() => setLoading(false));
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        fetchProfile(nextSession.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOtp = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      return { success: false, error: 'Failed to send OTP. Try again.' };
    }

    return { success: true };
  };

  const verifyOtp = async (email: string, token: string): Promise<VerifyOtpResult> => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { success: false, error: 'Invalid or expired OTP. Try again.' };
    }

    const verifiedUser = data.user ?? data.session?.user;
    if (!verifiedUser) {
      return { success: false, error: 'Could not verify OTP. Try again.' };
    }

    const nextProfile = await fetchProfile(verifiedUser.id);
    return {
      success: true,
      needsProfile: !nextProfile,
      profile: nextProfile,
    };
  };

  const completeProfile = async (name: string, role: UserRole): Promise<ProfileResult> => {
    if (!user) {
      return { success: false, error: 'Please verify your email first.' };
    }

    const existingProfile = await fetchProfile(user.id);
    if (existingProfile) {
      return { success: true, profile: existingProfile };
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name,
        role,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const nextProfile = data as UserProfile;
    setProfile(nextProfile);
    return { success: true, profile: nextProfile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        sendOtp,
        verifyOtp,
        completeProfile,
        logout,
        isAuthenticated: !!user && !!profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
