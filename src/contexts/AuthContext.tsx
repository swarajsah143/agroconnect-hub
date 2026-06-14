import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'farmer' | 'buyer' | 'expert';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
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

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to fetch profile:', error.message);
      return null;
    }

    return data as UserProfile | null;
  };

  const loadProfile = async (userId: string) => {
    const profileData = await fetchProfile(userId);
    setProfile(profileData);
    return profileData;
  };

  useEffect(() => {
    let mounted = true;
    let requestId = 0;

    const applySession = async (nextSession: Session | null) => {
      const currentRequest = ++requestId;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        if (mounted && currentRequest === requestId) setLoading(false);
        return;
      }

      setLoading(true);
      const profileData = await fetchProfile(nextSession.user.id);

      if (!mounted || currentRequest !== requestId) return;
      setProfile(profileData);
      setLoading(false);
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'INITIAL_SESSION') return;

        // Defer async profile loading so Supabase auth event handling never blocks.
        setTimeout(() => {
          void applySession(session);
        }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      void applySession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          name,
          role
        });

      if (profileError) {
        return { success: false, error: profileError.message };
      }
      
      await loadProfile(data.user.id);
    }

    return { success: true };
  };

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      let profileData = await loadProfile(data.user.id);

      if (!profileData) {
        const fallbackName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: fallbackName,
            role
          });

        if (profileError) {
          await supabase.auth.signOut();
          return { success: false, error: 'Your account exists, but its profile could not be restored. Please register again.' };
        }

        profileData = await loadProfile(data.user.id);
      }
      
      // Verify role matches
      if (profileData && profileData.role !== role) {
        await supabase.auth.signOut();
        return { success: false, error: `This account is registered as a ${profileData.role}, not a ${role}.` };
      }
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      profile,
      refreshProfile,
      login, 
      register, 
      logout, 
      isAuthenticated: !!user && !!profile,
      loading
    }}>
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
