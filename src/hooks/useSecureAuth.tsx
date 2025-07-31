import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ErrorHandler } from '@/utils/errorHandling';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  lastActivity: Date | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  lastActivity: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  // Session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    // Activity tracking for security
    const updateActivity = () => {
      setLastActivity(new Date());
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log security events
        if (event === 'SIGNED_IN') {
          ErrorHandler.logSecurityEvent('user_signed_in', { 
            userId: session?.user?.id,
            email: session?.user?.email 
          });
          updateActivity();
        } else if (event === 'SIGNED_OUT') {
          ErrorHandler.logSecurityEvent('user_signed_out', { 
            userId: session?.user?.id 
          });
          setLastActivity(null);
        } else if (event === 'TOKEN_REFRESHED') {
          ErrorHandler.logSecurityEvent('token_refreshed', { 
            userId: session?.user?.id 
          });
          updateActivity();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) {
        updateActivity();
      }
    });

    return () => {
      subscription.unsubscribe();
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    if (!session || !lastActivity) return;

    const checkTimeout = () => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivity.getTime();
      
      if (timeSinceActivity > SESSION_TIMEOUT) {
        ErrorHandler.logSecurityEvent('session_timeout', { 
          userId: user?.id,
          timeSinceActivity 
        }, 'medium');
        signOut();
      }
    };

    const interval = setInterval(checkTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session, lastActivity, user?.id]);

  const signOut = async () => {
    try {
      ErrorHandler.logSecurityEvent('user_signout_initiated', { 
        userId: user?.id 
      });
      
      await supabase.auth.signOut();
      setLastActivity(null);
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('signout_error', { 
        error: secureError.logMessage 
      }, 'high');
      throw new Error(secureError.userMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, lastActivity }}>
      {children}
    </AuthContext.Provider>
  );
};