'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Profile {
  id:    string;
  name:  string;
  email: string;
  role:  'student' | 'teacher';
}

interface UseAuthReturn {
  profile:  Profile | null;
  loading:  boolean;
  signOut:  () => Promise<void>;
}

export function useAuth(redirectIfUnauthenticated = true): UseAuthReturn {
  const router  = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (redirectIfUnauthenticated) router.push('/login');
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        router.push('/');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router, redirectIfUnauthenticated]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return { profile, loading, signOut };
}