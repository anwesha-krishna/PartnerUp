import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchDashboard from './components/SearchDashboard';
import CandidateCard from './components/CandidateCard';
import CandidateModal from './components/CandidateModal';
import SquadDrawer from './components/SquadDrawer';
import PostProjectModal from './components/PostProjectModal';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import BackgroundCanvas from './components/BackgroundCanvas';
import { AuthProvider, useAuth } from './context/AuthContext';
import { mockProfiles } from './data/mockProfiles';
import { matchCandidates } from './utils/matchingEngine';
import { 
  Sparkles, 
  Users, 
  FilterX, 
  ArrowUpDown, 
  Rocket, 
  CheckCircle2, 
  X,
  TrendingUp,
  Cpu
} from 'lucide-react';

const INITIAL_CRITERIA = {
  requiredSkills: ['React', 'Tailwind CSS'],
  targetAvailability: 'Any',
  experienceLevel: 'Any',
  targetInterests: [],
  roleFilter: 'All',
  searchQuery: ''
};

const SQUAD_STORAGE_KEY = 'project_match_squad_v1';

function AppContent() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  // Navigation tab state: 'explore' | 'profile'
  const [activeTab, setActiveTab] = useState('explore');

  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);
  const [appliedCriteria, setAppliedCriteria] = useState(INITIAL_CRITERIA);
  
  // Squad State with LocalStorage persistence
  const [squad, setSquad] = useState(() => {
    try {
      const saved = localStorage.getItem(SQUAD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal and Drawer states
  const [isSquadDrawerOpen, setIsSquadDrawerOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ message: null, type: 'success' });
  
  // Active posted project banner
  const [activeProjectBanner, setActiveProjectBanner] = useState(null);

  // Sync squad with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(squad));
    } catch (e) {
      // Storage unavailable fallback
    }
  }, [squad]);

  // Available roles for filter dropdowns
  const availableRoles = useMemo(() => {
    return Array.from(new Set(mockProfiles.map((p) => p.role))).sort();
  }, []);

  // Compute matched and ranked candidates dynamically based on applied search criteria
  const matchedCandidates = useMemo(() => {
    return matchCandidates(appliedCriteria, mockProfiles);
  }, [appliedCriteria]);

  // Execute matching search
  const handleSearch = () => {
    setAppliedCriteria({ ...criteria });
    showToast('Matching algorithm computed! Profiles sorted by compatibility.', 'sparkle');
  };

  // Auto-sync criteria when changing filters for live real-time feel or on search button
  const handleCriteriaChange = (newCriteria) => {
    setCriteria(newCriteria);
    setAppliedCriteria(newCriteria);
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Squad management
  const toggleSquadMember = (candidate) => {
    const exists = squad.some((m) => m.id === candidate.id);
    if (exists) {
      setSquad(squad.filter((m) => m.id !== candidate.id));
      showToast(`Removed ${candidate.name} from squad`, 'info');
    } else {
      if (squad.length >= 5) {
        showToast('Squad is full (Max 5 members allowed)', 'warning');
        return;
      }
      setSquad([...squad, candidate]);
      showToast(`Added ${candidate.name} to squad!`, 'sparkle');
    }
  };

  const removeFromSquad = (candidateId) => {
    const member = squad.find((m) => m.id === candidateId);
    setSquad(squad.filter((m) => m.id !== candidateId));
    if (member) showToast(`Removed ${member.name} from squad`, 'info');
  };

  const clearSquad = () => {
    setSquad([]);
    showToast('Squad roster cleared', 'info');
  };

  const handleSendInvites = () => {
    showToast(`🎉 Invite sent to ${squad.length} candidate(s)! Notifications dispatched.`, 'success');
  };

  // Handle Project Posting
  const handlePostProject = (projectData) => {
    const newCriteria = {
      requiredSkills: projectData.requiredSkills || [],
      targetAvailability: projectData.targetAvailability || 'Any',
      experienceLevel: projectData.experienceLevel || 'Any',
      targetInterests: [],
      roleFilter: projectData.roleFilter || 'All',
      searchQuery: ''
    };

    setCriteria(newCriteria);
    setAppliedCriteria(newCriteria);

    setActiveProjectBanner({
      title: projectData.title,
      description: projectData.description,
      requiredSkills: projectData.requiredSkills
    });

    setActiveTab('explore');
    showToast(`Project "${projectData.title}" posted! Finding matching candidates...`, 'sparkle');
  };

  // Preset Handlers
  const handleApplyPreset = (presetType) => {
    let presetCriteria = { ...criteria };
    switch (presetType) {
      case 'ai_hackathon':
        presetCriteria = {
          requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'FastAPI'],
          targetAvailability: 'Evenings',
          experienceLevel: 'Advanced',
          targetInterests: ['AI / ML'],
          roleFilter: 'All',
          searchQuery: ''
        };
        showToast('Applied: AI / ML Hackathon preset', 'info');
        break;
      case 'fullstack_mvp':
        presetCriteria = {
          requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
          targetAvailability: 'Full-time',
          experienceLevel: 'Intermediate',
          targetInterests: ['FinTech', 'Developer Tools'],
          roleFilter: 'All',
          searchQuery: ''
        };
        showToast('Applied: Full-Stack Web MVP preset', 'info');
        break;
      case 'design_lead':
        presetCriteria = {
          requiredSkills: ['Figma', 'UI/UX Design', 'Tailwind CSS'],
          targetAvailability: 'Weekends',
          experienceLevel: 'Intermediate',
          targetInterests: ['Social Impact', 'EdTech'],
          roleFilter: 'UI/UX Designer',
          searchQuery: ''
        };
        showToast('Applied: UI/UX & Frontend Sprint preset', 'info');
        break;
      default:
        break;
    }
    setCriteria(presetCriteria);
    setAppliedCriteria(presetCriteria);
  };

  const handleReset = () => {
    const cleared = {
      requiredSkills: [],
      targetAvailability: 'Any',
      experienceLevel: 'Any',
      targetInterests: [],
      roleFilter: 'All',
      searchQuery: ''
    };
    setCriteria(cleared);
    setAppliedCriteria(cleared);
    setActiveProjectBanner(null);
    showToast('Reset all search filters & criteria', 'info');
  };

  const topMatch = matchedCandidates.length > 0 ? matchedCandidates[0] : null;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative">
      {/* Background Animated Floating Constellation Nodes Canvas */}
      <BackgroundCanvas />

      {/* Foreground Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          teamCount={squad.length}
          onOpenTeamDrawer={() => setIsSquadDrawerOpen(true)}
          onOpenPostModal={() => setIsPostModalOpen(true)}
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        {/* Main Content Area: Tab Views */}
        {activeTab === 'profile' ? (
          <main className="flex-1 w-full">
            <UserProfile onShowToast={showToast} />
          </main>
        ) : (
          <>
            {/* Hero Header */}
            <section className="relative border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/25 via-slate-950/40 to-transparent py-10 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold font-mono-tag">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI MATCHMAKER ENGINE • GEMINI 2.5 FLASH</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
                  Build Your Winning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Hackathon Squad</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Multi-criteria weighted matching engine with Intersection-over-Union (IoU) skill overlap, schedule compatibility, and real-time AI match justifications.
                </p>

                {/* Quick Legend Banner */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono-tag">
                  <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>High Match (&gt;75%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Good Match (50–75%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 text-slate-400 border border-slate-700 px-3 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Low Match (&lt;50%)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Workspace Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
              
              {/* Active Project Posted Notification Banner */}
              {activeProjectBanner && (
                <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-cyan-600/30">
                      <Rocket className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono-tag">Active Posted Project</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Live Matching</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{activeProjectBanner.title}</h3>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {activeProjectBanner.description || 'Finding teammates with required skills: ' + activeProjectBanner.requiredSkills.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Dismiss active project banner"
                      onClick={() => setActiveProjectBanner(null)}
                      className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Dismiss Banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 1. Primary Search Dashboard Component */}
              <SearchDashboard
                criteria={criteria}
                onCriteriaChange={handleCriteriaChange}
                onSearch={handleSearch}
                onReset={handleReset}
                availableRoles={availableRoles}
                onApplyPreset={handleApplyPreset}
              />

              {/* 2. Results Header with Stats */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5 font-mono-tag">
                    <span className="text-cyan-400 font-black">01 —</span>
                    <span className="uppercase tracking-wider">TEAMMATE RESULTS</span>
                    <span className="text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                      {matchedCandidates.length}
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Ranked dynamically by weighted fit: Skill IoU (40%) + Availability (25%) + Experience (20%) + Interests (15%)
                  </p>
                </div>

                {topMatch && (
                  <div className="flex items-center gap-2 text-xs bg-[#0E0E10] border border-neutral-800 px-3.5 py-2 rounded-2xl shadow-sm">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-neutral-400 font-mono-tag">TOP FIT:</span>
                    <span className="font-mono font-bold text-cyan-400">{topMatch.name} ({topMatch.matchScore}%)</span>
                  </div>
                )}
              </div>

              {/* 3. Responsive Candidate Grid / Zero-State Feedback */}
              {matchedCandidates.length === 0 ? (
                <div className="bg-[#0E0E10] border border-neutral-800 rounded-3xl p-12 text-center space-y-5 shadow-xl">
                  <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                    <FilterX className="w-10 h-10 text-neutral-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white">No Matching Candidates Found</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                      No profiles match your specific combination of skill filters, role focus, and schedule constraints.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      aria-label="Clear all search filters and reset criteria"
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                    <button
                      type="button"
                      aria-label="Try AI Hackathon match template"
                      onClick={() => handleApplyPreset('ai_hackathon')}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-colors cursor-pointer"
                    >
                      Try AI Hackathon Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {matchedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      criteria={appliedCriteria}
                      isSquadMember={squad.some((m) => m.id === candidate.id)}
                      onToggleSquad={toggleSquadMember}
                      onOpenDetails={(c) => setSelectedCandidate(c)}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-black/40 backdrop-blur-md py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 ProjectMatch — Smart Team-Formation Platform for Hackathons & Projects</p>
            <div className="flex items-center gap-4 text-slate-400 font-mono-tag">
              <span>IoU ENGINE</span>
              <span>•</span>
              <span>GEMINI 2.5 FLASH</span>
              <span>•</span>
              <span>REACT + TAILWIND</span>
            </div>
          </div>
        </footer>

        {/* Candidate Details Modal */}
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          isSquadMember={selectedCandidate ? squad.some((m) => m.id === selectedCandidate.id) : false}
          onToggleSquad={toggleSquadMember}
        />

        {/* Slide-over Squad Drawer */}
        <SquadDrawer
          isOpen={isSquadDrawerOpen}
          onClose={() => setIsSquadDrawerOpen(false)}
          squad={squad}
          onRemoveFromSquad={removeFromSquad}
          onClearSquad={clearSquad}
          onSendInvites={handleSendInvites}
        />

        {/* Interactive Post Project Modal */}
        <PostProjectModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSubmitProject={handlePostProject}
          availableRoles={availableRoles}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onAuthSuccess={(msg) => showToast(msg, 'sparkle')}
        />

        {/* Toast Notification System */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: null, type: 'success' })}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
