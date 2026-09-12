import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Star, 
  UploadCloud, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Plus, 
  X, 
  Save, 
  Globe, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Languages, 
  HeartHandshake, 
  Check, 
  FileText,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS } from '../data/mockProfiles';
import { sanitizeText, sanitizeUrl, sanitizeArray } from '../utils/security';

// GitHub SVG Component
function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// LinkedIn SVG Component
function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z" />
    </svg>
  );
}

const COMMON_LANGUAGES = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Bengali", "Tamil"];

export default function UserProfile({ onShowToast }) {
  const { user, updateProfile } = useAuth();

  // Local form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    role: user?.role || '',
    university: user?.university || '',
    department: user?.department || '',
    yearOfStudy: user?.yearOfStudy || '3rd Year B.Tech',
    bio: user?.bio || '',
    skills: user?.skills || [],
    languages: user?.languages || ['English'],
    availability: user?.availability || 'Weekends',
    experience: user?.experience || 'Advanced',
    github: user?.socials?.github || 'https://github.com/anweshak',
    linkedin: user?.socials?.linkedin || 'https://linkedin.com/in/anweshak',
    portfolio: user?.socials?.portfolio || 'https://anweshak.dev'
  });

  // New Skill Input state
  const [skillInput, setSkillInput] = useState('');

  // Certificate Uploader state
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFile, setCertFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [certificates, setCertificates] = useState(user?.verifiedCertificates || []);

  // Peer Endorsements state
  const [endorsements, setEndorsements] = useState(user?.peerEndorsements || [
    { id: "e1", tag: "⚡ Fast Shipper", count: 14 },
    { id: "e2", tag: "🎨 Pixel Perfect UI", count: 18 },
    { id: "e3", tag: "🤖 AI Prompt Master", count: 9 },
    { id: "e4", tag: "🏆 Hackathon Veteran", count: 12 },
    { id: "e5", tag: "🤝 Inspiring Team Lead", count: 11 }
  ]);
  const [hasEndorsed, setHasEndorsed] = useState({});

  // Skill Add / Remove
  const handleAddSkill = (e) => {
    e?.preventDefault();
    const cleanSkill = sanitizeText(skillInput);
    if (!cleanSkill) return;
    if (!profileForm.skills.some((s) => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setProfileForm({
        ...profileForm,
        skills: [...profileForm.skills, cleanSkill]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Toggle Language Pill
  const handleToggleLanguage = (lang) => {
    const cleanLang = sanitizeText(lang);
    const current = profileForm.languages || [];
    const updated = current.includes(cleanLang)
      ? current.filter((l) => l !== cleanLang)
      : [...current, cleanLang];
    setProfileForm({ ...profileForm, languages: updated });
  };

  // Endorse Skill Tag
  const handleEndorseTag = (id) => {
    if (hasEndorsed[id]) {
      setEndorsements(endorsements.map((e) => e.id === id ? { ...e, count: e.count - 1 } : e));
      setHasEndorsed({ ...hasEndorsed, [id]: false });
    } else {
      setEndorsements(endorsements.map((e) => e.id === id ? { ...e, count: e.count + 1 } : e));
      setHasEndorsed({ ...hasEndorsed, [id]: true });
      if (onShowToast) onShowToast('Endorsement recorded! 🎉', 'sparkle');
    }
  };

  // Handle Certificate Upload
  const handleUploadCertificate = (e) => {
    e.preventDefault();
    const cleanTitle = sanitizeText(certTitle);
    const cleanIssuer = sanitizeText(certIssuer);
    if (!cleanTitle) {
      if (onShowToast) onShowToast('Please enter a valid certificate title', 'warning');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newCert = {
        id: `cert-${Date.now()}`,
        title: cleanTitle,
        issuer: cleanIssuer || 'Hackathon Committee',
        date: 'Verified ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        verified: true
      };
      const updated = [newCert, ...certificates];
      setCertificates(updated);
      setCertTitle('');
      setCertIssuer('');
      setCertFile(null);
      setIsUploading(false);
      if (onShowToast) onShowToast(`Verified credential "${newCert.title}" added to profile!`, 'sparkle');
    }, 600);
  };

  // Save Profile Form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...profileForm,
      name: sanitizeText(profileForm.name),
      role: sanitizeText(profileForm.role),
      university: sanitizeText(profileForm.university),
      department: sanitizeText(profileForm.department),
      yearOfStudy: sanitizeText(profileForm.yearOfStudy),
      bio: sanitizeText(profileForm.bio),
      skills: sanitizeArray(profileForm.skills),
      languages: sanitizeArray(profileForm.languages),
      socials: {
        github: sanitizeUrl(profileForm.github, 'https://github.com/anweshak'),
        linkedin: sanitizeUrl(profileForm.linkedin, 'https://linkedin.com/in/anweshak'),
        portfolio: sanitizeUrl(profileForm.portfolio, 'https://anweshak.dev')
      },
      verifiedCertificates: certificates,
      peerEndorsements: endorsements
    };

    await updateProfile(updatedData);
    if (onShowToast) onShowToast('Profile changes saved and synced successfully! ✨', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Hero Card */}
      <div className="relative rounded-3xl bg-[#0E0E10] border border-neutral-800/80 p-6 sm:p-8 shadow-2xl shadow-cyan-500/5 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Status Ring */}
          <div className="relative">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={profileForm.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-2 ring-cyan-500/40 shadow-2xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=06b6d4&color=000&bold=true`;
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-cyan-400 text-black p-1.5 rounded-xl shadow-lg ring-2 ring-[#0E0E10]" title="Active Builder">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Bio & Title Bar */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profileForm.name || 'Your Profile'}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-tag font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                CR & LEAD
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-tag font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>VERIFIED BUILDER</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-purple-400">
              {profileForm.role} • {profileForm.department}
            </p>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {profileForm.bio}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-400 font-mono-tag">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>{profileForm.university} ({profileForm.yearOfStudy})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>AVAILABILITY: <strong className="text-neutral-200">{profileForm.availability.toUpperCase()}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <strong className="text-white">5.0</strong> (18 REVIEWS)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Dark Neutral Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: Profile Form & Tech Stack (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0E0E10] border border-neutral-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight font-mono-tag">
                    <span className="text-cyan-400">01 —</span> PERSONAL & TECH PROFILE
                  </h2>
                  <p className="text-xs text-neutral-400">Manage your builder specifications visible across the network</p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Save changes to your profile specification"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Save Changes</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Monospace Sub-label: Personal Info */}
              <div className="text-xs font-mono-tag font-bold text-neutral-400 uppercase tracking-wider">
                01 - PERSONAL INFO
              </div>

              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    aria-label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Role / Specialization</label>
                  <input
                    type="text"
                    aria-label="Role or Specialization"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: University & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>University</span>
                  </label>
                  <input
                    type="text"
                    aria-label="University"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Department / Branch</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Department or Branch"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Year of Study, Availability & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Academic Year</label>
                  <select
                    aria-label="Academic Year of Study"
                    value={profileForm.yearOfStudy}
                    onChange={(e) => setProfileForm({ ...profileForm, yearOfStudy: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="1st Year B.Tech">1st Year B.Tech</option>
                    <option value="2nd Year B.Tech">2nd Year B.Tech</option>
                    <option value="3rd Year B.Tech">3rd Year B.Tech</option>
                    <option value="4th Year B.Tech">4th Year B.Tech</option>
                    <option value="Masters / Postgraduate">Masters / Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Availability</label>
                  <select
                    aria-label="Weekly Availability Schedule"
                    value={profileForm.availability}
                    onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {AVAILABILITY_OPTIONS.filter((o) => o !== 'Any').map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Experience Level</label>
                  <select
                    aria-label="Experience Seniority Tier"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-purple-500 font-medium"
                  >
                    {EXPERIENCE_LEVELS.filter((e) => e !== 'Any').map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  aria-label="Short Biography"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell potential hackathon teammates about what you love building..."
                  className="w-full px-3.5 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 leading-relaxed font-medium"
                />
              </div>

              {/* Monospace Sub-label: Tech Stack */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tag font-bold text-neutral-400 uppercase tracking-wider">
                    02 - TECH STACK & SKILLS ({profileForm.skills.length})
                  </span>
                  <span className="text-[10px] font-mono-tag text-cyan-400 font-semibold">MATCH ENGINE INPUT</span>
                </div>

                {/* Active Skill Tags */}
                <div className="flex flex-wrap gap-1.5 p-3 bg-[#18181C] rounded-2xl border border-neutral-800 min-h-[50px]">
                  {profileForm.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        aria-label={`Remove skill ${skill}`}
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="Add new skill"
                    placeholder="Add new skill (e.g. Next.js, Rust, Docker, PyTorch)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    aria-label="Add skill to profile"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-200 text-xs font-semibold border border-neutral-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Monospace Sub-label: Spoken Languages */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
                <span className="text-xs font-mono-tag font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  <span>03 - SPOKEN LANGUAGES</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_LANGUAGES.map((lang) => {
                    const isSelected = profileForm.languages?.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        aria-label={`Toggle spoken language ${lang}`}
                        aria-pressed={isSelected}
                        onClick={() => handleToggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-500/30'
                            : 'bg-[#18181C] text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monospace Sub-label: Links & Socials */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
                <span className="text-xs font-mono-tag font-bold text-neutral-400 uppercase tracking-wider">
                  04 - LINKS & SOCIALS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <GithubIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      aria-label="GitHub Profile URL"
                      placeholder="GitHub URL"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="relative">
                    <LinkedinIcon className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      aria-label="LinkedIn Profile URL"
                      placeholder="LinkedIn URL"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      aria-label="Portfolio or Devpost URL"
                      placeholder="Portfolio / Devpost"
                      value={profileForm.portfolio}
                      onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Bottom Action */}
              <div className="pt-3">
                <button
                  type="submit"
                  aria-label="Update Profile Specification"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Save className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Update Profile Specification</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Ratings, Verified Certificates & Peer Reviews (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Star Rating Widget */}
          <div className="bg-[#0E0E10] border border-neutral-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono-tag">
                    <span className="text-amber-400">01 —</span> PEER TRUST & RATING
                  </h3>
                  <p className="text-xs text-neutral-400">Calculated from past hackathon sprint evaluations</p>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-xl">
                100% RELIABLE
              </span>
            </div>

            {/* Score Big Display */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#18181C] border border-neutral-800">
              <div className="text-center px-2">
                <span className="text-4xl font-black text-white tracking-tight">5.0</span>
                <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono-tag">18 PEER RATINGS</span>
              </div>

              {/* Progress Breakdown */}
              <div className="flex-1 space-y-1.5 text-[11px] text-neutral-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-20">Code Quality</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-full" />
                  </div>
                  <span className="font-mono text-neutral-200">5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20">Communication</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full w-full" />
                  </div>
                  <span className="font-mono text-neutral-200">5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20">Sprint Speed</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full w-[96%]" />
                  </div>
                  <span className="font-mono text-neutral-200">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Verified Projects & Hackathon Certificates Uploader */}
          <div className="bg-[#0E0E10] border border-neutral-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono-tag">
                    <span className="text-purple-400">02 —</span> VERIFIED CREDENTIALS
                  </h3>
                  <p className="text-xs text-neutral-400">Upload hackathon certificates & proof of work</p>
                </div>
              </div>
            </div>

            {/* Certificate Upload Form */}
            <form onSubmit={handleUploadCertificate} className="p-4 rounded-2xl bg-[#18181C] border border-neutral-800 space-y-3">
              <div className="space-y-2">
                <input
                  type="text"
                  aria-label="Certificate or Credential Title"
                  placeholder="Certificate title (e.g. TreeHacks 2026 Winner)..."
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  aria-label="Issuing Organization"
                  placeholder="Issuing organization (e.g. Stanford University, ETHGlobal)..."
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* File Attachment Input */}
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-neutral-700 hover:border-cyan-500 bg-[#0E0E10] text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{certFile ? certFile.name : 'Attach PDF / PNG proof'}</span>
                  <input
                    type="file"
                    aria-label="Attach certificate proof in PDF or PNG"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                  />
                </label>

                <button
                  type="submit"
                  aria-label="Verify and attach certificate"
                  disabled={!certTitle.trim() || isUploading}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* List of Verified Badges */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start justify-between p-3 rounded-2xl bg-[#18181C] border border-neutral-800 hover:border-cyan-500/40 transition-colors group/cert"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover/cert:text-cyan-300 transition-colors">{cert.title}</h4>
                      <p className="text-[11px] text-neutral-400">{cert.issuer} • {cert.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-tag text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md flex-shrink-0">
                    VERIFIED ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Peer Reviews & Endorsements Section */}
          <div className="bg-[#0E0E10] border border-neutral-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono-tag">
                    <span className="text-pink-400">03 —</span> PEER ENDORSEMENTS
                  </h3>
                  <p className="text-xs text-neutral-400">Interactive badges from hackathon teammates</p>
                </div>
              </div>
            </div>

            {/* Endorsements Matrix */}
            <div className="flex flex-wrap gap-2">
              {endorsements.map((item) => {
                const active = hasEndorsed[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Endorse ${item.tag}, currently ${item.count} endorsements`}
                    aria-pressed={active}
                    onClick={() => handleEndorseTag(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 ring-2 ring-pink-400'
                        : 'bg-[#18181C] hover:bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-purple-500/40'
                    }`}
                    title="Click to endorse this peer strength"
                  >
                    <span>{item.tag}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/20 text-white font-black' : 'bg-neutral-900 text-cyan-400'
                    }`}>
                      {item.count}
                    </span>
                    <ThumbsUp className={`w-3 h-3 ${active ? 'fill-white text-white' : 'text-neutral-500'}`} />
                  </button>
                );
              })}
            </div>
            
            <p className="text-[11px] text-neutral-500 italic text-center pt-1 font-mono-tag">
              CLICK ANY ENDORSEMENT BADGE TO SUBMIT YOUR VOTE
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
