import React, { createContext, useContext, useState, useEffect } from 'react';

import { sanitizeText, sanitizeUrl, isValidEmail } from '../utils/security';

const AuthContext = createContext(null);

const STORAGE_KEY = 'project_match_user_v1';

export const DEMO_USER = {
  id: "user-demo-1",
  name: "Anwesha K.",
  email: "anwesha.k@berkeley.edu",
  role: "Frontend Lead & CR",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  university: "UC Berkeley",
  department: "Computer Science & Engineering (CSE)",
  yearOfStudy: "3rd Year B.Tech",
  bio: "Passionate frontend engineer, UI/UX craftsman, and Class Representative. Specialized in React, Tailwind CSS, Next.js, and leading agile hackathon sprint squads to victory.",
  experience: "Advanced",
  availability: "Weekends",
  skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "Redux", "UI/UX Design", "GraphQL"],
  languages: ["English", "Hindi", "Bengali", "Spanish"],
  socials: {
    github: "https://github.com/anweshak",
    linkedin: "https://linkedin.com/in/anweshak",
    portfolio: "https://anweshak.dev"
  },
  rating: 5.0,
  ratingCount: 18,
  verifiedCertificates: [
    { id: "cert-1", title: "CalHacks 11.0 — 1st Place Track Winner", issuer: "CalHacks Foundation", date: "Nov 2025", verified: true },
    { id: "cert-2", title: "HackMIT 2025 Finalist — Best UX Award", issuer: "MIT Tech Club", date: "Sep 2025", verified: true },
    { id: "cert-3", title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "Jan 2026", verified: true }
  ],
  peerEndorsements: [
    { id: "e1", tag: "⚡ Fast Shipper", count: 14 },
    { id: "e2", tag: "🎨 Pixel Perfect UI", count: 18 },
    { id: "e3", tag: "🤖 AI Prompt Master", count: 9 },
    { id: "e4", tag: "🏆 Hackathon Veteran", count: 12 },
    { id: "e5", tag: "🤝 Inspiring Team Lead", count: 11 }
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default to demo user for instant smooth experience
    return DEMO_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // storage unavailable
    }
  }, [user]);

  // Login handler
  const login = (email, password) => {
    const cleanEmail = sanitizeText(email);
    const loggedInUser = {
      ...DEMO_USER,
      email: isValidEmail(cleanEmail) ? cleanEmail : DEMO_USER.email,
      name: cleanEmail ? sanitizeText(cleanEmail.split('@')[0]) : DEMO_USER.name
    };
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
    return loggedInUser;
  };

  // Sign up handler
  const signup = (userData = {}) => {
    const cleanName = sanitizeText(userData.name || 'New Member');
    const cleanEmail = sanitizeText(userData.email);
    const newUser = {
      ...DEMO_USER,
      id: `user-${Date.now()}`,
      name: cleanName,
      email: isValidEmail(cleanEmail) ? cleanEmail : 'user@hackathon.edu',
      role: sanitizeText(userData.role || 'Full-Stack Developer'),
      department: sanitizeText(userData.department || 'Computer Science & Engineering'),
      skills: Array.isArray(userData.skills) ? userData.skills.map(sanitizeText) : ['React', 'JavaScript'],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=6366f1&color=fff&bold=true`
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return newUser;
  };

  // 1-Click Quick Demo Login
  const quickDemoLogin = () => {
    setUser(DEMO_USER);
    setIsAuthModalOpen(false);
    return DEMO_USER;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  // Update profile and optionally sync to backend
  const updateProfile = async (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUser(data.profile);
        }
      }
    } catch (err) {
      console.warn('Backend profile sync failed, saved locally:', err.message);
    }

    return merged;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        signup,
        quickDemoLogin,
        logout,
        updateProfile
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
