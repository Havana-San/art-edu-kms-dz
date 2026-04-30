'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import UnifiedNav from './UnifiedNav';

export default function NavWrapper() {
  const [role,     setRole]     = useState<'student' | 'teacher' | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', user.id)
        .single();

      if (data) {
        setRole(data.role as 'student' | 'teacher');
        setUserName(data.name || user.email?.split('@')[0] || '');
      }
    };

    getUser();

    // تحديث عند تغيّر حالة الدخول
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <UnifiedNav role={role} userName={userName} />;
}