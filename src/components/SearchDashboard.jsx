import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Plus, 
  X, 
  RotateCcw, 
  Check, 
  SlidersHorizontal,
  Calendar,
  Briefcase,
  Layers,
  Zap,
  ChevronDown,
  Filter
} from 'lucide-react';
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS, POPULAR_QUICK_SKILLS } from '../data/mockProfiles';

const HORIZONTAL_PILL_OPTIONS = [
  "ALL",
  "React",
  "Python",
  "AI / ML",
  "Machine Learning",
  "FinTech",
  "Full Stack",
  "TypeScript",
  "Figma",
  "Node.js",
  "Docker",
  "PostgreSQL",
  "Tailwind CSS",
  "C++"
];

export default function SearchDashboard({
  criteria,
  onCriteriaChange,
  onSearch,
  onReset,
  availableRoles = [],
  onApplyPreset
}) {
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const selectedSkills = criteria.requiredSkills || [];

  // Toggle or Set primary horizontal skill filter
  const handlePillClick = (pill) => {
    if (pill === "ALL") {
      onCriteriaChange({ ...criteria, requiredSkills: [] });
      return;
    }

    if (pill === "AI / ML") {
      const isPresent = selectedSkills.includes("Machine Learning") || selectedSkills.includes("Python");
      const updated = isPresent
        ? selectedSkills.filter(s => s !== "Machine Learning" && s !== "Python")
        : Array.from(new Set([...selectedSkills, "Machine Learning", "Python"]));
      onCriteriaChange({ ...criteria, requiredSkills: updated });
      return;
    }

    if (pill === "Full Stack") {
      const isPresent = selectedSkills.includes("React") && selectedSkills.includes("Node.js");
      const updated = isPresent
        ? selectedSkills.filter(s => s !== "React" && s !== "Node.js")
        : Array.from(new Set([...selectedSkills, "React", "Node.js"]));
      onCriteriaChange({ ...criteria, requiredSkills: updated });
      return;
    }

    if (pill === "FinTech") {
      const isPresent = (criteria.targetInterests || []).includes("FinTech");
      const updatedInterests = isPresent
        ? (criteria.targetInterests || []).filter(i => i !== "FinTech")
        : [...(criteria.targetInterests || []), "FinTech"];
      onCriteriaChange({ ...criteria, targetInterests: updatedInterests });
      return;
    }

    // Standard skill toggle
    const updated = selectedSkills.includes(pill)
      ? selectedSkills.filter((s) => s !== pill)
      : [...selectedSkills, pill];
    onCriteriaChange({ ...criteria, requiredSkills: updated });
  };

  const isPillActive = (pill) => {
    if (pill === "ALL") {
      return selectedSkills.length === 0 && (!criteria.targetInterests || criteria.targetInterests.length === 0);
    }
    if (pill === "AI / ML") {
      return selectedSkills.includes("Machine Learning") || selectedSkills.includes("Python") || (criteria.targetInterests || []).includes("AI / ML");
    }
    if (pill === "Full Stack") {
      return selectedSkills.includes("React") && selectedSkills.includes("Node.js");
    }
    if (pill === "FinTech") {
      return (criteria.targetInterests || []).includes("FinTech");
    }
    return selectedSkills.includes(pill);
  };

  // Handle adding custom skill
  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    const exists = selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onCriteriaChange({
        ...criteria,
        requiredSkills: [...selectedSkills, trimmed]
      });
    }
    setCustomSkillInput('');
  };

  // Handle removing a selected skill tag
  const handleRemoveSkill = (skillToRemove) => {
    const updated = selectedSkills.filter((s) => s !== skillToRemove);
    onCriteriaChange({ ...criteria, requiredSkills: updated });
  };

  const activeFilterCount =
    (criteria.requiredSkills?.length || 0) +
    (criteria.targetAvailability !== 'Any' ? 1 : 0) +
    (criteria.experienceLevel !== 'Any' ? 1 : 0) +
    (criteria.roleFilter !== 'All' ? 1 : 0) +
    (criteria.searchQuery?.trim() ? 1 : 0) +
    ((criteria.targetInterests || []).length > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      
      {/* 1. Full-Width Minimalist Top Search Bar with Integrated Actions */}
      <div className="relative rounded-2xl bg-[#0A0A0C] border border-neutral-800 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all shadow-xl p-1.5 flex items-center gap-2">
        <div className="pl-3.5 text-neutral-400">
          <Search className="w-4 h-4" />
        </div>
        
        <input
          type="text"
          aria-label="Search candidates by name, role, university, or keyword"
          placeholder="Search candidates by name, role, university, or keyword (e.g. Next.js, PyTorch)..."
          value={criteria.searchQuery || ''}
          onChange={(e) => onCriteriaChange({ ...criteria, searchQuery: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
          className="flex-1 bg-transparent py-2.5 px-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
        />

        {criteria.searchQuery && (
          <button
            type="button"
            aria-label="Clear search input"
            onClick={() => onCriteriaChange({ ...criteria, searchQuery: '' })}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Advanced Filters Toggle Button */}
        <button
          type="button"
          aria-label="Toggle advanced match filters"
          aria-expanded={showAdvancedFilters}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showAdvancedFilters || activeFilterCount > 0
              ? 'bg-neutral-900 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
              : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-400 text-black font-extrabold text-[10px] flex items-center justify-center font-mono">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Instant Search Trigger */}
        <button
          type="button"
          aria-label="Run candidate match search"
          onClick={onSearch}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Match</span>
        </button>
      </div>

      {/* 2. Horizontal Filter Pill Bar (Dark Neutral Tags -> Electric Cyan/Purple Gradient) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        <span className="text-[11px] font-mono-tag font-bold text-neutral-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-cyan-400" />
          <span>Quick Stack:</span>
        </span>

        {HORIZONTAL_PILL_OPTIONS.map((pill) => {
          const active = isPillActive(pill);
          return (
            <button
              key={pill}
              type="button"
              aria-label={`Filter by ${pill}`}
              aria-pressed={active}
              onClick={() => handlePillClick(pill)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 text-black font-extrabold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-300'
                  : 'bg-[#0E0E10] border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              {active && pill !== "ALL" && <Check className="w-3 h-3 stroke-[3]" />}
              <span>{pill}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active Custom Skill Tags (if any are active that are not in quick pills) */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#0A0A0C]/80 border border-neutral-800/80 text-xs">
          <span className="text-[11px] font-mono-tag text-cyan-300 font-bold mr-1">Active Criteria ({selectedSkills.length}):</span>
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
            >
              <span>{skill}</span>
              <button
                type="button"
                aria-label={`Remove filter ${skill}`}
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-rose-400 transition-colors cursor-pointer"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {activeFilterCount > 0 && (
            <button
              type="button"
              aria-label="Reset all search criteria"
              onClick={onReset}
              className="ml-auto text-[11px] font-medium text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors pl-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      )}

      {/* 4. Secondary & Advanced Filters (Expandable / Sleek Dropdown Bar) */}
      {showAdvancedFilters && (
        <div className="bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Quick Presets Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-mono-tag font-bold text-neutral-400 uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Match Templates:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-label="Apply AI / ML Squad match preset"
                onClick={() => onApplyPreset('ai_hackathon')}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-cyan-950 text-neutral-300 hover:text-cyan-300 border border-neutral-800 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🤖 AI / ML Squad</span>
              </button>
              <button
                type="button"
                aria-label="Apply Full-Stack Web MVP match preset"
                onClick={() => onApplyPreset('fullstack_mvp')}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-cyan-950 text-neutral-300 hover:text-cyan-300 border border-neutral-800 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🚀 Full-Stack Web MVP</span>
              </button>
              <button
                type="button"
                aria-label="Apply UI/UX Sprint match preset"
                onClick={() => onApplyPreset('design_lead')}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-cyan-950 text-neutral-300 hover:text-cyan-300 border border-neutral-800 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎨 UI/UX Sprint</span>
              </button>
            </div>
          </div>

          {/* Secondary Dropdown Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Availability</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono-tag">Weight 25%</span>
              </label>
              <select
                aria-label="Target Availability filter"
                value={criteria.targetAvailability || 'Any'}
                onChange={(e) => onCriteriaChange({ ...criteria, targetAvailability: e.target.value })}
                className="w-full px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-purple-400" />
                  <span>Experience Level</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono-tag">Weight 20%</span>
              </label>
              <select
                aria-label="Target Experience level filter"
                value={criteria.experienceLevel || 'Any'}
                onChange={(e) => onCriteriaChange({ ...criteria, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-purple-500 font-medium"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Role Focus Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Role Focus
              </label>
              <select
                aria-label="Role Focus filter"
                value={criteria.roleFilter || 'All'}
                onChange={(e) => onCriteriaChange({ ...criteria, roleFilter: e.target.value })}
                className="w-full px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="All">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Skill Input Bar */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
            <input
              type="text"
              aria-label="Add specific skill keyword"
              placeholder="Add specific skill keyword (e.g. GraphQL, Solidity, PyTorch, Kubernetes)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#0E0E10] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              aria-label="Add custom skill"
              disabled={!customSkillInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-200 text-xs font-semibold border border-neutral-800 hover:border-neutral-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
