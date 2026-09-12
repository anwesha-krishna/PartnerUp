import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Check, Sparkles, Filter } from 'lucide-react';
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS } from '../data/mockProfiles';

export default function SearchFilters({
  criteria,
  onCriteriaChange,
  onReset,
  allSkills,
  allInterests,
  availableRoles,
  onApplyPreset
}) {
  const toggleSkill = (skill) => {
    const current = criteria.requiredSkills || [];
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    onCriteriaChange({ ...criteria, requiredSkills: updated });
  };

  const toggleInterest = (interest) => {
    const current = criteria.targetInterests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    onCriteriaChange({ ...criteria, targetInterests: updated });
  };

  const activeFiltersCount =
    (criteria.requiredSkills?.length || 0) +
    (criteria.targetInterests?.length || 0) +
    (criteria.targetAvailability !== 'Any' ? 1 : 0) +
    (criteria.experienceLevel !== 'Any' ? 1 : 0) +
    (criteria.roleFilter !== 'All' ? 1 : 0) +
    (criteria.searchQuery ? 1 : 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/20 space-y-6">
      {/* Header with Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-white text-base">Match Criteria & Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              aria-label="Reset all search filters"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Match Templates:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-label="Apply AI / ML Hackathon Team template"
            onClick={() => onApplyPreset('ai_hackathon')}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/40 text-slate-300 border border-slate-700/80 transition-all"
          >
            🤖 AI / ML Hackathon Team
          </button>
          <button
            type="button"
            aria-label="Apply Full-Stack Web MVP template"
            onClick={() => onApplyPreset('fullstack_mvp')}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/40 text-slate-300 border border-slate-700/80 transition-all"
          >
            🚀 Full-Stack Web MVP
          </button>
          <button
            type="button"
            aria-label="Apply UI/UX & Frontend Sprint template"
            onClick={() => onApplyPreset('design_lead')}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/40 text-slate-300 border border-slate-700/80 transition-all"
          >
            🎨 UI/UX & Frontend Sprint
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          aria-label="Search candidates by name, skill, keyword, or university"
          placeholder="Search by candidate name, skill, keyword, or university..."
          value={criteria.searchQuery || ''}
          onChange={(e) => onCriteriaChange({ ...criteria, searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Grid of Core Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role Filter */}
        <div>
          <label htmlFor="role-filter-select" className="block text-xs font-medium text-slate-300 mb-1.5">
            Role Focus
          </label>
          <select
            id="role-filter-select"
            aria-label="Filter candidates by role focus"
            value={criteria.roleFilter || 'All'}
            onChange={(e) => onCriteriaChange({ ...criteria, roleFilter: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Roles</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Availability Match */}
        <div>
          <label htmlFor="avail-filter-select" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Availability Fit</span>
            <span className="text-[10px] text-indigo-400 font-mono">Weight: 25%</span>
          </label>
          <select
            id="avail-filter-select"
            aria-label="Filter candidates by availability schedule fit"
            value={criteria.targetAvailability || 'Any'}
            onChange={(e) => onCriteriaChange({ ...criteria, targetAvailability: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="exp-filter-select" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Experience Fit</span>
            <span className="text-[10px] text-indigo-400 font-mono">Weight: 20%</span>
          </label>
          <select
            id="exp-filter-select"
            aria-label="Filter candidates by experience tier fit"
            value={criteria.experienceLevel || 'Any'}
            onChange={(e) => onCriteriaChange({ ...criteria, experienceLevel: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Skills (Weight 40%) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <span>Required Skills (IoU Intersection Over Union)</span>
          </label>
          <span className="text-[10px] text-indigo-400 font-mono">Weight: 40%</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl">
          {allSkills.map((skill) => {
            const isSelected = criteria.requiredSkills?.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                aria-label={`Toggle required skill ${skill}`}
                aria-pressed={isSelected}
                onClick={() => toggleSkill(skill)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Interests (Weight 15%) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-300">
            Domain / Project Interests
          </label>
          <span className="text-[10px] text-indigo-400 font-mono">Weight: 15%</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allInterests.map((interest) => {
            const isSelected = criteria.targetInterests?.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                aria-label={`Toggle target domain interest ${interest}`}
                aria-pressed={isSelected}
                onClick={() => toggleInterest(interest)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30 ring-1 ring-pink-400'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
