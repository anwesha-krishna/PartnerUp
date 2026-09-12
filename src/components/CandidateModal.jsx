import React from 'react';
import { X, GraduationCap, Briefcase, Calendar, Clock, Globe, Sparkles, UserCheck, UserPlus, Check, Languages, Building2, BookOpen } from 'lucide-react';
import { sanitizeUrl } from '../utils/security';

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

export default function CandidateModal({
  candidate,
  isOpen,
  onClose,
  isSquadMember,
  onToggleSquad
}) {
  if (!isOpen || !candidate) return null;

  const socials = candidate.socials || {};
  const githubUrl = sanitizeUrl(socials.github || candidate.github, 'https://github.com');
  const linkedinUrl = sanitizeUrl(socials.linkedin || candidate.linkedin, 'https://linkedin.com');
  const portfolioUrl = sanitizeUrl(socials.portfolio || candidate.portfolio, 'https://devpost.com');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#0E0E10] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-white z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-cyan-950 via-[#0E0E10] to-purple-950 relative border-b border-neutral-800">
            <button
              type="button"
              aria-label="Close candidate details modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar & Match Score */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <img
                src={candidate.avatarUrl}
                alt={`${candidate.name}'s profile avatar`}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#0E0E10] shadow-xl"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=06b6d4&color=000&bold=true`;
                }}
              />
              <div className="bg-[#18181C] px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-base text-cyan-300">
                  {candidate.matchScore}%
                </span>
                <span className="text-xs text-neutral-400 font-mono-tag">MATCH</span>
              </div>
            </div>

            {/* Name, Role, Department and University */}
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-white">{candidate.name}</h3>
                {candidate.yearOfStudy && (
                  <span className="text-xs font-mono-tag font-semibold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    <span>{candidate.yearOfStudy}</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-purple-400">{candidate.role}</p>
              {candidate.department && (
                <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{candidate.department}</span>
                </p>
              )}
              {candidate.university && (
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{candidate.university}</span>
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-5 bg-[#18181C] p-3.5 rounded-2xl border border-neutral-800">
              <h4 className="text-[10px] font-mono-tag font-bold text-neutral-400 uppercase tracking-wider mb-1">ABOUT</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{candidate.bio}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4 font-mono-tag">
              <div className="bg-[#18181C] p-2.5 rounded-xl border border-neutral-800 text-center">
                <span className="text-[9px] text-neutral-400 uppercase block mb-1">Availability</span>
                <span className="text-xs font-semibold text-neutral-200">{candidate.availability}</span>
              </div>
              <div className="bg-[#18181C] p-2.5 rounded-xl border border-neutral-800 text-center">
                <span className="text-[9px] text-neutral-400 uppercase block mb-1">Experience</span>
                <span className="text-xs font-semibold text-neutral-200">{candidate.experience}</span>
              </div>
              <div className="bg-[#18181C] p-2.5 rounded-xl border border-neutral-800 text-center">
                <span className="text-[9px] text-neutral-400 uppercase block mb-1">Commitment</span>
                <span className="text-xs font-semibold text-neutral-200">{candidate.timeCommitment || '15h/wk'}</span>
              </div>
            </div>

            {/* Spoken Languages */}
            {candidate.languages && candidate.languages.length > 0 && (
              <div className="mb-4 bg-[#18181C] p-3 rounded-2xl border border-neutral-800 flex items-center gap-2">
                <Languages className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-mono-tag font-bold text-neutral-400 uppercase text-[10px]">Languages:</span>
                  {candidate.languages.map((lang) => (
                    <span key={lang} className="text-xs px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200 font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Skills */}
            <div className="mb-4">
              <h4 className="text-[10px] font-mono-tag font-bold text-neutral-400 uppercase tracking-wider mb-2">
                TECH STACK & EXPERTISE
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#18181C] text-cyan-300 border border-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* External Social Links & Squad Toggle Button */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-1.5">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${candidate.name}'s GitHub profile`}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                    title="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${candidate.name}'s LinkedIn profile`}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-purple-400 border border-neutral-800 hover:border-purple-500/50 transition-colors cursor-pointer"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${candidate.name}'s Portfolio website`}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 border border-neutral-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                    title="Portfolio Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

              <button
                type="button"
                aria-label={isSquadMember ? `Remove ${candidate.name} from squad` : `Add ${candidate.name} to squad`}
                onClick={() => {
                  onToggleSquad(candidate);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSquadMember
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                    : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold shadow-md shadow-cyan-500/20'
                }`}
              >
                {isSquadMember ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Remove from Squad</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Add to Squad</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
