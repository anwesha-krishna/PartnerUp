import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_EMAIL = 'demo@partnerup.app';
const DEMO_PASSWORD = 'PartnerUpDemo2026!';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadUserProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          name: authUser.email.split('@')[0],
          role: 'Member',
          skills: ['React', 'JavaScript'],
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.email.split('@')[0])}&background=6366f1&color=fff&bold=true`,
        })
        .select()
        .single();

      if (insertError) {
        console.warn('Could not create profile:', insertError.message);
      } else {
        profile = newProfile;
      }
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || authUser.email.split('@')[0],
      role: profile?.role || 'Member',
      university: profile?.university || '',
      department: profile?.department || '',
      yearOfStudy: profile?.year_of_study || '3rd Year B.Tech',
      bio: profile?.bio || '',
      skills: profile?.skills || [],
      languages: profile?.languages || ['English'],
      availability: profile?.availability || 'Weekends',
      experience: profile?.experience || 'Advanced',
      avatarUrl: profile?.avatar_url || '',
      socials: profile?.socials || {},
      verifiedCertificates: profile?.verified_certificates || [],
      peerEndorsements: profile?.peer_endorsements || [],
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserProfile(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const signup = async ({ name, email, password, department, role }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        department,
        role,
        skills: ['React', 'JavaScript'],
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`,
      });
      if (profileError) console.warn('Profile creation failed:', profileError.message);
    }

    setIsAuthModalOpen(false);
    return data.user;
  };

  const quickDemoLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) throw new Error(error.message);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    if (!user) return;

    const payload = {
      name: updatedData.name,
      role: updatedData.role,
      university: updatedData.university,
      department: updatedData.department,
      year_of_study: updatedData.yearOfStudy,
      bio: updatedData.bio,
      skills: updatedData.skills,
      languages: updatedData.languages,
      availability: updatedData.availability,
      experience: updatedData.experience,
      socials: updatedData.socials,
      verified_certificates: updatedData.verifiedCertificates,
      peer_endorsements: updatedData.peerEndorsements,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        signup,
        quickDemoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
