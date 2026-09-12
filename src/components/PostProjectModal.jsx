import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Rocket, 
  Layers, 
  Users, 
  Calendar, 
  Briefcase, 
  Check, 
  Plus 
} from 'lucide-react';
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS, POPULAR_QUICK_SKILLS } from '../data/mockProfiles';
import { sanitizeText, sanitizeArray } from '../utils/security';

export default function PostProjectModal({
  isOpen,
  onClose,
  onSubmitProject,
  availableRoles
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'TypeScript']);
  const [selectedRoles, setSelectedRoles] = useState(['Frontend Developer']);
  const [availability, setAvailability] = useState('Weekends');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    const cleanSkill = sanitizeText(customSkillInput);
    if (!cleanSkill) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setSelectedSkills((prev) => [...prev, cleanSkill]);
    }
    setCustomSkillInput('');
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = sanitizeText(title);
    if (!cleanTitle) return;

    onSubmitProject({
      title: cleanTitle,
      description: sanitizeText(description),
      requiredSkills: sanitizeArray(selectedSkills),
      rolesNeeded: sanitizeArray(selectedRoles),
      targetAvailability: availability,
      experienceLevel: experienceLevel,
      roleFilter: selectedRoles.length === 1 ? selectedRoles[0] : 'All'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#0E0E10] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-white z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Banner */}
          <div className="p-6 border-b border-neutral-800 bg-[#0A0A0C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-black shadow-lg shadow-cyan-500/20 font-bold">
                <Rocket className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 font-mono-tag">
                  <span>POST A NEW PROJECT</span>
                  <span className="text-[9px] uppercase font-mono-tag font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    INSTANT MATCHING
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Publish your hackathon project to instantly compute compatibility scores across all candidates
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close post project modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Project Title */}
            <div>
              <label htmlFor="post-project-title" className="block text-xs font-mono-tag font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                PROJECT TITLE *
              </label>
              <input
                id="post-project-title"
                type="text"
                required
                aria-label="Project Title"
                placeholder="e.g., NovaHealth — AI Patient Diagnosis & Triage Assistant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium"
              />
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="post-project-desc" className="block text-xs font-mono-tag font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                SHORT DESCRIPTION & MILESTONES
              </label>
              <textarea
                id="post-project-desc"
                rows={2}
                aria-label="Short project description and milestones"
                placeholder="Briefly describe what your team is building, problem statement, and hackathon deliverables..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Required Skills Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono-tag font-bold uppercase tracking-wider text-neutral-300">
                REQUIRED TECH STACK & SKILLS
              </label>
              
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 bg-[#18181C] border border-neutral-800 rounded-xl">
                {POPULAR_QUICK_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      aria-label={`Toggle required skill ${skill}`}
                      aria-pressed={isSelected}
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-500/30 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Addition */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  aria-label="Add custom skill keyword"
                  placeholder="Add custom skill keyword..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  aria-label="Add custom skill"
                  onClick={handleAddCustomSkill}
                  disabled={!customSkillInput.trim()}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 rounded-xl text-xs font-semibold text-neutral-300 border border-neutral-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Roles Needed */}
            <div>
              <label className="block text-xs font-mono-tag font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                ROLES NEEDED
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-label={`Toggle role needed ${role}`}
                      aria-pressed={isSelected}
                      onClick={() => toggleRole(role)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 ring-1 ring-purple-500/30 font-bold'
                          : 'bg-[#18181C] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                      <span>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule & Experience Fit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Availability</span>
                </label>
                <select
                  aria-label="Target availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  <span>Experience Level</span>
                </label>
                <select
                  aria-label="Target experience level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181C] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-purple-500 font-medium"
                >
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                aria-label="Cancel posting project"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label="Publish project and compute candidate matches"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Publish & Match Teammates</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
