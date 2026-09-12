import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Layers, 
  Bot, 
  RefreshCw,
  Copy,
  Check,
  Zap,
  ShieldAlert,
  AlertTriangle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { generateTeamPitch, analyzeSquadSynergy } from '../utils/aiService';

export default function SquadDrawer({
  isOpen,
  onClose,
  squad = [],
  onRemoveFromSquad,
  onClearSquad,
  onSendInvites
}) {
  // Pitch Modal State
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [pitchText, setPitchText] = useState('');
  const [isLoadingPitch, setIsLoadingPitch] = useState(false);
  const [isAiGeneratedPitch, setIsAiGeneratedPitch] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // AI Squad Audit State
  const [auditData, setAuditData] = useState(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [auditError, setAuditError] = useState(null);

  // Reset audit data when squad is emptied
  useEffect(() => {
    if (squad.length === 0) {
      setAuditData(null);
      setAuditError(null);
    }
  }, [squad.length]);

  if (!isOpen) return null;

  // Compute aggregate team skills and roles
  const aggregatedSkills = Array.from(
    new Set(squad.flatMap((member) => member.skills || []))
  );

  const roleDistribution = squad.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {});

  // Handle Team Pitch Generation
  const handleGeneratePitch = async () => {
    setIsPitchModalOpen(true);
    setIsLoadingPitch(true);
    setIsCopied(false);
    try {
      const res = await generateTeamPitch(squad);
      setPitchText(res.pitch);
      setIsAiGeneratedPitch(res.isAiGenerated);
    } catch (err) {
      setPitchText('Our squad combines diverse tech skills to ship hackathon prototypes fast.');
    } finally {
      setIsLoadingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    if (!pitchText) return;
    navigator.clipboard.writeText(pitchText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle AI Squad Synergy & Skill Gap Audit
  const handleRunAudit = async () => {
    if (squad.length === 0) return;
    setIsLoadingAudit(true);
    setAuditError(null);
    try {
      const res = await analyzeSquadSynergy(squad, true);
      if (res && res.success) {
        setAuditData(res);
      } else {
        setAuditError('Could not complete squad audit. Please try again.');
      }
    } catch (err) {
      setAuditError('Squad audit request failed.');
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Calculate numeric score for progress bar width
  const scoreNum = auditData?.synergyScore 
    ? parseInt(auditData.synergyScore.replace('%', ''), 10) || 75
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with Darkened Blur Mask */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0C] border-l border-neutral-800 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-[#0A0A0C]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 text-black rounded-xl shadow-md shadow-cyan-500/20 font-bold">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono-tag">
                  <span>MY SQUAD</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-black px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                    {squad.length} / 5
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">Collaborative team formation roster</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close squad drawer"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {squad.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 shadow-inner">
                  <Users className="w-8 h-8 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 font-mono-tag">SQUAD ROSTER IS EMPTY</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                    Browse ranked candidates and click "Add to Squad" to form your ideal hackathon roster.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* 01 — Team Roster List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono-tag">
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      01 — SQUAD MEMBERS ({squad.length})
                    </span>
                    <button
                      type="button"
                      aria-label="Clear all candidates from squad roster"
                      onClick={onClearSquad}
                      className="text-rose-400 hover:text-rose-300 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      CLEAR ALL
                    </button>
                  </div>

                  {squad.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E0E10] border border-neutral-800 hover:border-cyan-500/40 transition-all shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={`${member.name}'s avatar`}
                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-neutral-800 group-hover:ring-cyan-500/40 transition-all"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=06b6d4&color=000`;
                          }}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{member.name}</h4>
                          <p className="text-[11px] font-semibold text-purple-400">{member.role}</p>
                          <span className="text-[10px] text-neutral-400 font-mono-tag">{member.availability} • {member.experience}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${member.name} from squad`}
                        onClick={() => onRemoveFromSquad(member.id)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition-colors cursor-pointer"
                        title="Remove member from squad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 02 — AI Squad Synergy & Skill Gap Analyzer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tag">
                    <div className="flex items-center gap-2 font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>02 — SQUAD SYNERGY & SKILL GAPS</span>
                    </div>
                    <span className="text-[9px] font-mono-tag bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 font-bold">
                      GEMINI 2.5 FLASH
                    </span>
                  </div>

                  {/* Audit Trigger Action */}
                  <div className="bg-[#0E0E10] p-4 rounded-2xl border border-neutral-800 space-y-2.5 shadow-md">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Evaluate team composition balance, calculate collective synergy score, and detect missing key roles.
                    </p>
                    <button
                      type="button"
                      aria-label="Run AI team audit for squad synergy and skill gap analysis"
                      onClick={handleRunAudit}
                      disabled={isLoadingAudit}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black text-xs font-extrabold shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isLoadingAudit ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-black animate-spin stroke-[2.5]" />
                          <span>Analyzing Squad Synergy...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-black fill-black" />
                          <span>{auditData ? 'Re-run AI Team Audit ⚡' : 'Run AI Team Audit ⚡'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Loading State Skeleton / Spinner */}
                  {isLoadingAudit && (
                    <div className="p-5 rounded-2xl bg-[#08080A] border border-neutral-800 space-y-3.5 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-neutral-800 rounded w-1/3" />
                        <div className="h-6 bg-cyan-500/20 rounded w-12" />
                      </div>
                      <div className="w-full h-2.5 bg-neutral-900 rounded-full" />
                      <div className="space-y-2 pt-2">
                        <div className="h-3 bg-neutral-800 rounded w-5/6" />
                        <div className="h-3 bg-neutral-800 rounded w-4/6" />
                      </div>
                    </div>
                  )}

                  {/* AI Analysis Result Card (Pitch-black with Cyan/Purple Gradient Borders) */}
                  {auditData && !isLoadingAudit && (
                    <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-[#08080A] rounded-[15px] p-4.5 space-y-4 text-white">
                        
                        {/* Synergy Score Header */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold font-mono-tag uppercase">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>SYNERGY INDEX</span>
                            </div>
                            <span className="text-2xl font-black font-mono bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                              {auditData.synergyScore}
                            </span>
                          </div>

                          {/* Glowing Animated Synergy Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-[1px]">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                                style={{ width: `${Math.min(Math.max(scoreNum, 10), 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono-tag">
                              <span>0%</span>
                              <span className="text-cyan-400 font-bold">
                                {scoreNum >= 88 ? '🏆 ELITE COMPATIBILITY' : scoreNum >= 75 ? '⚡ HIGH SYNERGY' : '🛠️ BALANCED ROSTER'}
                              </span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>

                        {/* Team Superpowers / Strengths */}
                        {auditData.teamStrengths && auditData.teamStrengths.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-neutral-800/80">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-wider font-mono-tag">
                              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                              <span>TEAM SUPERPOWERS</span>
                            </div>
                            <ul className="space-y-1.5 pl-1">
                              {auditData.teamStrengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-neutral-200 leading-relaxed">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Detected Skill Gaps */}
                        {auditData.detectedGaps && auditData.detectedGaps.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-neutral-800/80">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono-tag">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>DETECTED SKILL GAPS</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {auditData.detectedGaps.map((gap, idx) => (
                                <span 
                                  key={idx}
                                  className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium flex items-center gap-1.5 shadow-sm"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                                  {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Recommendation Box */}
                        {auditData.recommendation && (
                          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 space-y-1.5 shadow-inner">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono-tag">
                              <Bot className="w-3.5 h-3.5 text-purple-400" />
                              <span>NEXT HIRE STRATEGY</span>
                            </div>
                            <p className="text-xs text-neutral-200 leading-relaxed italic">
                              "{auditData.recommendation}"
                            </p>
                          </div>
                        )}

                        {/* Audit Verification Badge */}
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono-tag pt-1">
                          <span className="text-neutral-400">STATUS: AUDITED</span>
                          <span className="text-cyan-400 font-semibold">
                            {auditData.isAiGenerated ? '✦ GEMINI 2.5 FLASH' : '✦ RULE-BASED ENGINE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {auditError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                      {auditError}
                    </div>
                  )}
                </div>

                {/* 03 — AI Team Pitch Generator Button */}
                <div className="bg-[#0E0E10] p-4 rounded-2xl border border-neutral-800 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono-tag text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>03 — ELEVATOR PITCH</span>
                    </div>
                    <span className="text-[9px] font-mono-tag bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                      GEMINI
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Generate an instant 1-paragraph summary of your squad's combined strengths for judges.
                  </p>
                  <button
                    type="button"
                    aria-label="Generate AI Elevator Pitch Deck Summary for this squad"
                    onClick={handleGeneratePitch}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-purple-500/40 text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate Pitch Deck Summary ✨</span>
                  </button>
                </div>

                {/* 04 — Combined Team Tech Stack Matrix */}
                <div className="bg-[#0E0E10] p-4 rounded-2xl border border-neutral-800 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono-tag text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>04 — TEAM COMPOSITION</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-tag text-neutral-400 font-bold uppercase">Role Distribution:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {Object.entries(roleDistribution).map(([role, count]) => (
                        <span key={role} className="text-[11px] px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                          {role} <span className="text-cyan-400 font-bold ml-1 font-mono">×{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-tag text-neutral-400 font-bold uppercase">
                      Covered Tech Stack ({aggregatedSkills.length} unique skills):
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1.5 max-h-32 overflow-y-auto">
                      {aggregatedSkills.map((skill) => (
                        <span key={skill} className="text-[10px] px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-neutral-800 bg-[#0A0A0C] space-y-3">
            <button
              type="button"
              aria-label={`Send squad invitations to ${squad.length} members`}
              disabled={squad.length === 0}
              onClick={onSendInvites}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-extrabold shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Send Squad Invitations ({squad.length})</span>
            </button>
            <p className="text-center text-[10px] text-neutral-500 font-mono-tag">
              INSTANT NOTIFICATION DISPATCHED TO MEMBERS
            </p>
          </div>
        </div>
      </div>

      {/* Generated Team Pitch Modal */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setIsPitchModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#0E0E10] border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono-tag">SQUAD ELEVATOR PITCH</h3>
                  <p className="text-xs text-neutral-400">AI-generated team strength synthesis</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close squad elevator pitch modal"
                onClick={() => setIsPitchModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isLoadingPitch ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 font-mono-tag">ANALYZING SQUAD SYNERGIES & GENERATING PITCH...</p>
              </div>
            ) : (
              <div className="bg-[#18181C] p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-200 leading-relaxed italic">
                "{pitchText}"
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                aria-label="Regenerate squad elevator pitch"
                onClick={handleGeneratePitch}
                disabled={isLoadingPitch}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer font-mono-tag"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPitch ? 'animate-spin' : ''}`} />
                <span>REGENERATE PITCH</span>
              </button>

              <button
                type="button"
                aria-label={isCopied ? "Pitch text copied to clipboard" : "Copy pitch text to clipboard"}
                onClick={handleCopyPitch}
                disabled={isLoadingPitch || !pitchText}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-black stroke-[3]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{isCopied ? 'Copied!' : 'Copy Pitch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

