import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  PlusCircle, 
  User, 
  Compass, 
  LogOut, 
  LogIn, 
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  FolderPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  teamCount = 0, 
  onOpenTeamDrawer, 
  onOpenPostModal,
  activeTab = 'explore', // 'explore' | 'profile'
  onNavigate
}) {
  const { user, openAuthModal, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand & Monospace Nav Indicators */}
        <div className="flex items-center gap-7">
          {/* Logo */}
          <div 
            onClick={() => onNavigate && onNavigate('explore')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Project<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-500">Match</span>
                </span>
                <span className="text-[9px] font-mono-tag font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Monospace Section Indicators Navigation */}
          <nav className="hidden md:flex items-center gap-2 font-mono-tag text-xs" aria-label="Main Navigation">
            <button
              type="button"
              aria-label="Navigate to Dashboard"
              onClick={() => onNavigate && onNavigate('explore')}
              className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-neutral-900 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'
              }`}
            >
              <span className="text-cyan-400 text-[10px]">01</span>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              aria-label="Navigate to My Profile"
              onClick={() => {
                if (user) {
                  onNavigate && onNavigate('profile');
                } else {
                  openAuthModal();
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-neutral-900 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'
              }`}
            >
              <span className="text-purple-400 text-[10px]">02</span>
              <span>My Profile</span>
              {user && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          </nav>
        </div>

        {/* Action Center with Neon Borders */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Profile Tab Trigger */}
          <button
            type="button"
            aria-label="Toggle Dashboard or Profile View"
            onClick={() => onNavigate && onNavigate(activeTab === 'explore' ? 'profile' : 'explore')}
            className="md:hidden p-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-mono-tag border border-neutral-800"
            title="Toggle View"
          >
            {activeTab === 'explore' ? '02 PROFILE' : '01 DASHBOARD'}
          </button>

          {/* Squad Drawer Trigger */}
          <button
            type="button"
            aria-label={`Open My Squad Drawer, ${teamCount} members selected`}
            onClick={onOpenTeamDrawer}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              teamCount > 0
                ? 'bg-neutral-900 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/15'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">My Squad</span>
            {teamCount > 0 ? (
              <span className="flex items-center justify-center w-5 h-5 text-[11px] font-black text-black bg-cyan-400 rounded-full shadow-md animate-pulse font-mono">
                {teamCount}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-500 font-mono">0/5</span>
            )}
          </button>

          {/* Post Project Trigger with Neon Glow */}
          <button
            type="button"
            aria-label="Post a new Hackathon Project"
            onClick={onOpenPostModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all cursor-pointer active:scale-95 border border-cyan-400/40"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post a Project</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* User Auth Profile Chip / Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="User profile options menu"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0E0E10] border border-neutral-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full ring-1 ring-black" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-white leading-tight group-hover:text-purple-300 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 leading-none truncate max-w-[105px]">
                    {user.role || 'Builder'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#0E0E10] border border-neutral-800 rounded-2xl p-2 shadow-2xl text-white z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-neutral-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-cyan-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-md">
                        {user.department || 'CSE Department'}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Edit My Profile"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate && onNavigate('profile');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-900 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Edit My Profile</span>
                    </button>

                    <button
                      type="button"
                      aria-label="Explore Dashboard"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate && onNavigate('explore');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-900 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                      <span>Explore Dashboard</span>
                    </button>

                    <div className="pt-1 border-t border-neutral-800">
                      <button
                        type="button"
                        aria-label="Sign Out"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              aria-label="Sign in to your account"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
