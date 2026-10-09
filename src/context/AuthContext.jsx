import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getSavedSession,
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
} from '../lib/supabaseApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getSavedSession()
      .then((savedSession) => {
        if (isMounted) setSession(savedSession);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const nextSession = await signInWithEmail(email, password);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const result = await signUpWithEmail(email, password);
    if (result.session) setSession(result.session);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutFromSupabase();
    } finally {
      setSession(null);
    }
  }, []);

  const value = useMemo(() => ({
    user: session?.user ?? null,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }), [session, isLoading, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
