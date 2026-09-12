import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  UserPlus, 
  UserCheck, 
  ExternalLink, 
  GraduationCap, 
  Clock, 
  Bot, 
  Check, 
  RefreshCw, 
  Languages, 
  Building2, 
  BookOpen, 
  Globe,
  Layers
} from 'lucide-react';
import { generateMatchExplanation } from '../utils/aiService';
import { sanitizeUrl } from '../utils/security';

// GitHub SVG Component
function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// LinkedIn SVG Component
function LinkedinIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z" />
    </svg>
  );
}

export default function CandidateCard({
  candidate,
  criteria = {},
  isSquadMember,
  onToggleSquad,
  onOpenDetails
}) {
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // Fetch AI explanation when expanded or criteria change
  useEffect(() => {
    let isMounted = true;

    async function fetchInsight() {
      if (!showAiAnalysis) return;
      if (explanation) return; // already loaded
      setIsLoadingAi(true);
      try {
        const res = await generateMatchExplanation(criteria, candidate, false);
        if (isMounted) {
          setExplanation(res.explanation);
          setIsAiGenerated(res.isAiGenerated);
        }
      } catch (err) {
        if (isMounted) {
          setExplanation(candidate.matchReason || 'Compatible candidate with relevant domain background.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingAi(false);
        }
      }
    }

    fetchInsight();

    return () => {
      isMounted = false;
    };
  }, [showAiAnalysis, candidate.id, candidate.matchScore]);

  // Refresh Insight Handler
  const handleRefreshInsight = async (e) => {
    e.stopPropagation();
    setIsLoadingAi(true);
    try {
      const res = await generateMatchExplanation(criteria, candidate, true);
      setExplanation(res.explanation);
      setIsAiGenerated(res.isAiGenerated);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Dynamic Color Coding: Cyan/Emerald for >75%, Amber for 50-75%, Neutral for <50%
  const getScoreTheme = (score) => {
    if (score > 75) {
      return {
        badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 ring-1 ring-cyan-500/30 shadow-cyan-500/10',
        textColor: 'text-cyan-400',
        label: 'HIGH MATCH'
      };
    }
    if (score >= 50) {
      return {
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30 shadow-amber-500/10',
        textColor: 'text-amber-400',
        label: 'GOOD MATCH'
      };
    }
    return {
      badgeClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
      textColor: 'text-neutral-500',
      label: 'LOW MATCH'
    };
  };

  const scoreTheme = getScoreTheme(candidate.matchScore);
  const overlappingSkillSet = new Set((candidate.overlappingSkills || []).map(s => s.toLowerCase()));

  // Split skills into matched vs other
  const matchedSkills = candidate.skills.filter(s => overlappingSkillSet.has(s.toLowerCase()));
  const otherSkills = candidate.skills.filter(s => !overlappingSkillSet.has(s.toLowerCase()));

  // Social Links Extraction
  const socials = candidate.socials || {};
  const githubUrl = sanitizeUrl(socials.github || candidate.github, 'https://github.com');
  const linkedinUrl = sanitizeUrl(socials.linkedin || candidate.linkedin, 'https://linkedin.com');
  const portfolioUrl = sanitizeUrl(socials.portfolio || candidate.portfolio, 'https://devpost.com');

  return (
    <div className={`relative bg-[#0E0E10] rounded-3xl border transition-all duration-300 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col justify-between overflow-hidden group ${
      isSquadMember ? 'border-emerald-500/60 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10' : 'border-neutral-800/80'
    }`}>
      
      {/* Main Card Content */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Header: Thumbnail Avatar, Name, Department, Year Badge, Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-800 group-hover:ring-cyan-500/40 transition-all shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=06b6d4&color=000&bold=true`;
                }}
              />
              {isSquadMember && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-black rounded-full p-1 shadow-lg ring-2 ring-[#0E0E10] font-bold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <h3 
                onClick={() => onOpenDetails(candidate)}
                className="text-base font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer leading-tight flex items-center gap-1.5"
              >
                <span>{candidate.name}</span>
              </h3>
              <p className="text-xs font-semibold text-purple-400 mt-0.5">{candidate.role}</p>
              
              {/* Department & Year Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {candidate.department && (
                  <span className="text-[10px] font-mono-tag font-semibold px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 truncate max-w-[150px]">
                    {candidate.department.split('&')[0].trim()}
                  </span>
                )}
                {candidate.yearOfStudy && (
                  <span className="text-[10px] font-mono-tag font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {candidate.yearOfStudy.split(' ')[0]} Year
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Prominent Match Score Indicator */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className={`px-2.5 py-1 rounded-xl border font-mono font-black text-sm flex items-center gap-1 shadow-md ${scoreTheme.badgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{candidate.matchScore}%</span>
            </div>
            <span className={`text-[9px] font-mono-tag font-bold tracking-widest mt-1 uppercase ${scoreTheme.textColor}`}>
              {scoreTheme.label}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
          {candidate.bio}
        </p>

        {/* Availability & Experience Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-mono-tag text-[11px] font-semibold px-2.5 py-1 rounded-xl border bg-neutral-900 text-neutral-300 border-neutral-800 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>{candidate.availability}</span>
          </span>
          <span className="font-mono-tag text-[11px] font-semibold px-2.5 py-1 rounded-xl border bg-neutral-900 text-neutral-300 border-neutral-800 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 text-purple-400" />
            <span>{candidate.experience}</span>
          </span>
          {candidate.languages && candidate.languages.length > 0 && (
            <span className="font-mono-tag text-[11px] font-semibold px-2.5 py-1 rounded-xl border bg-neutral-900 text-neutral-400 border-neutral-800 flex items-center gap-1.5" title={`Languages: ${candidate.languages.join(', ')}`}>
              <Languages className="w-3 h-3 text-cyan-400" />
              <span>{candidate.languages.slice(0, 2).join(', ')}</span>
            </span>
          )}
        </div>

        {/* Skills Pill Rows with Cyan Highlights for Matches */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-500/20"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>{skill}</span>
              </span>
            ))}
            {otherSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-0.5 rounded-lg font-medium bg-[#0A0A0C] text-neutral-400 border border-neutral-800"
              >
                {skill}
              </span>
            ))}
            {otherSkills.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-lg font-mono text-neutral-500">
                +{otherSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Collapsible AI Synthesis Accordion Drawer */}
        <div className="pt-2 border-t border-neutral-800/80">
          <button
            type="button"
            aria-label={`Toggle AI match analysis for ${candidate.name}`}
            aria-expanded={showAiAnalysis}
            onClick={() => setShowAiAnalysis(!showAiAnalysis)}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 hover:text-cyan-300 py-1.5 px-2 rounded-xl hover:bg-neutral-900/60 transition-colors cursor-pointer group/ai"
          >
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover/ai:animate-pulse" />
              <span className="font-mono-tag uppercase tracking-wider text-[11px]">AI Match Analysis</span>
              {isAiGenerated && (
                <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded-full font-bold">
                  Gemini
                </span>
              )}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAiAnalysis ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          {showAiAnalysis && (
            <div className="mt-2 bg-[#0A0A0C] p-3.5 rounded-2xl border border-cyan-500/25 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tag font-bold uppercase tracking-wider text-cyan-400">
                  Synthesis Breakdown
                </span>
                <button
                  type="button"
                  aria-label={`Re-generate AI match justification for ${candidate.name}`}
                  onClick={handleRefreshInsight}
                  disabled={isLoadingAi}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-cyan-300 disabled:opacity-50 transition-colors cursor-pointer"
                  title="Re-generate AI justification"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingAi ? 'animate-spin text-cyan-400' : 'text-amber-400'}`} />
                  <span>Refresh ✨</span>
                </button>
              </div>

              {isLoadingAi ? (
                <div className="space-y-1.5 py-1">
                  <div className="h-2.5 bg-gradient-to-r from-neutral-800 via-cyan-950 to-neutral-800 rounded-md animate-pulse w-full" />
                  <div className="h-2.5 bg-gradient-to-r from-neutral-800 via-cyan-950 to-neutral-800 rounded-md animate-pulse w-4/5" />
                </div>
              ) : (
                <p className="text-xs text-neutral-200 leading-relaxed italic">
                  "{explanation || candidate.matchReason || 'Strong skill synergy and compatible schedule for hackathon sprints.'}"
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Action Footer: Social Direct Links + View Profile & Add to Squad Buttons */}
      <div className="p-4 bg-[#0A0A0C] border-t border-neutral-800/80 flex items-center justify-between gap-2.5">
        
        {/* Social Quick Direct Links with Neon Hover Glow */}
        <div className="flex items-center gap-1">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${candidate.name}'s GitHub Profile`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/15 transition-all cursor-pointer group/soc"
              title={`${candidate.name}'s GitHub`}
            >
              <GithubIcon className="w-3.5 h-3.5 group-hover/soc:scale-110 transition-transform" />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${candidate.name}'s LinkedIn Profile`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-purple-400 border border-neutral-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/15 transition-all cursor-pointer group/soc"
              title={`${candidate.name}'s LinkedIn`}
            >
              <LinkedinIcon className="w-3.5 h-3.5 group-hover/soc:scale-110 transition-transform" />
            </a>
          )}
        </div>

        {/* Action Buttons: View Profile & Add to Squad */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            aria-label={`View full details and profile for ${candidate.name}`}
            onClick={() => onOpenDetails(candidate)}
            className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 hover:border-neutral-700 transition-all flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            aria-label={isSquadMember ? `Remove ${candidate.name} from your squad` : `Add ${candidate.name} to your squad`}
            onClick={() => onToggleSquad(candidate)}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
              isSquadMember
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400 font-extrabold'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold shadow-md shadow-cyan-500/20'
            }`}
          >
            {isSquadMember ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>In Squad ✓</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Add to Squad</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
