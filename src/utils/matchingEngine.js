/**
 * ProjectMatch - Smart Team Formation Matching Engine
 * 
 * Computes a weighted match score percentage for candidates based on:
 * score = (Skill_Overlap * 0.40) + (Availability_Match * 0.25) + (Experience_Fit * 0.20) + (Interest_Overlap * 0.15)
 */

/**
 * Calculates the Intersection-over-Union (IoU / Jaccard Index) for two arrays of strings.
 * @param {string[]} targetList
 * @param {string[]} candidateList
 * @returns {{ iou: number, intersection: string[] }}
 */
export function calculateIoU(targetList = [], candidateList = []) {
  if (!targetList || targetList.length === 0) {
    return { iou: 1.0, intersection: [] };
  }

  const targetSet = new Set(targetList.map((s) => s.trim().toLowerCase()));
  const candidateSet = new Set(candidateList.map((s) => s.trim().toLowerCase()));

  // Find intersection
  const intersection = candidateList.filter((item) =>
    targetSet.has(item.trim().toLowerCase())
  );

  // Find union
  const unionSet = new Set([...targetSet, ...candidateSet]);

  const iou = unionSet.size > 0 ? intersection.length / unionSet.size : 0;
  return { iou, intersection };
}

/**
 * Calculates availability fit score (0.0 to 1.0).
 * @param {string} targetAvailability
 * @param {string} candidateAvailability
 * @returns {number}
 */
export function calculateAvailabilityScore(targetAvailability, candidateAvailability) {
  if (!targetAvailability || targetAvailability === "Any") {
    return 1.0;
  }

  if (targetAvailability.toLowerCase() === (candidateAvailability || "").toLowerCase()) {
    return 1.0;
  }

  // Full-time candidates can often cover part-time / weekends / evenings
  if (candidateAvailability === "Full-time") {
    return 0.85;
  }

  return 0.0;
}

/**
 * Calculates experience fit score (0.0 to 1.0) using numeric distance.
 * @param {string} targetLevel - "Beginner" | "Intermediate" | "Advanced" | "Any"
 * @param {string} candidateLevel - "Beginner" | "Intermediate" | "Advanced"
 * @returns {number}
 */
export function calculateExperienceScore(targetLevel, candidateLevel) {
  if (!targetLevel || targetLevel === "Any") {
    return 1.0;
  }

  const levels = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
  };

  const targetVal = levels[targetLevel.toLowerCase()] || 2;
  const candidateVal = levels[(candidateLevel || "").toLowerCase()] || 2;

  const diff = Math.abs(targetVal - candidateVal);

  if (diff === 0) return 1.0;
  if (diff === 1) return 0.65;
  return 0.25;
}

/**
 * Generates an automated AI match explanation snippet based on computed fit metrics.
 */
function generateMatchReason(candidate, criteria, overlappingSkills, matchScore) {
  const parts = [];

  if (overlappingSkills.length > 0) {
    parts.push(`Strong overlap on ${overlappingSkills.length} requested skill${overlappingSkills.length > 1 ? 's' : ''} (${overlappingSkills.slice(0, 3).join(', ')}${overlappingSkills.length > 3 ? '...' : ''}).`);
  } else if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
    parts.push(`Offers complementary expertise in ${candidate.skills.slice(0, 2).join(', ')}.`);
  }

  if (criteria.targetAvailability && criteria.targetAvailability !== 'Any') {
    if (candidate.availability === criteria.targetAvailability) {
      parts.push(`Direct schedule alignment for ${candidate.availability}.`);
    } else if (candidate.availability === 'Full-time') {
      parts.push(`Full-time availability offers high bandwidth flexibility.`);
    }
  }

  if (criteria.experienceLevel && criteria.experienceLevel !== 'Any') {
    if (candidate.experience === criteria.experienceLevel) {
      parts.push(`Matches target ${candidate.experience} experience tier.`);
    }
  }

  if (parts.length === 0) {
    if (matchScore >= 75) {
      return `High overall compatibility across tech stack, work availability, and domain interests.`;
    }
    if (matchScore >= 50) {
      return `Solid foundational fit with good potential for agile team collaboration.`;
    }
    return `Broad profile candidate with diverse technical capabilities.`;
  }

  return parts.join(' ');
}

/**
 * Matches a list of candidates against user search criteria.
 * 
 * @param {Object} criteria
 * @param {string[]} criteria.requiredSkills - Array of required skill strings
 * @param {string} criteria.targetAvailability - "Weekends" | "Evenings" | "Full-time" | "Any"
 * @param {string} criteria.experienceLevel - "Beginner" | "Intermediate" | "Advanced" | "Any"
 * @param {string[]} [criteria.targetInterests] - Array of project domain interests
 * @param {string} [criteria.roleFilter] - Optional role filter
 * @param {string} [criteria.searchQuery] - Free text query for name/bio/role
 * @param {Array} profiles - List of candidate profile objects
 * @returns {Array} Sorted list of candidate match results
 */
export function matchCandidates(criteria = {}, profiles = []) {
  const {
    requiredSkills = [],
    targetAvailability = "Any",
    experienceLevel = "Any",
    targetInterests = [],
    roleFilter = "All",
    searchQuery = ""
  } = criteria;

  const WEIGHT_SKILLS = 0.40;
  const WEIGHT_AVAILABILITY = 0.25;
  const WEIGHT_EXPERIENCE = 0.20;
  const WEIGHT_INTERESTS = 0.15;

  const results = profiles
    .filter((profile) => {
      // Role filter
      if (roleFilter && roleFilter !== "All" && profile.role !== roleFilter) {
        return false;
      }

      // Free text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = profile.name.toLowerCase().includes(query);
        const matchesBio = profile.bio.toLowerCase().includes(query);
        const matchesRole = profile.role.toLowerCase().includes(query);
        const matchesSkills = profile.skills.some((s) => s.toLowerCase().includes(query));
        const matchesInterests = (profile.interests || []).some((i) => i.toLowerCase().includes(query));

        if (!matchesName && !matchesBio && !matchesRole && !matchesSkills && !matchesInterests) {
          return false;
        }
      }

      return true;
    })
    .map((profile) => {
      // 1. Skill Overlap (IoU)
      const { iou: skillScore, intersection: overlappingSkills } = calculateIoU(
        requiredSkills,
        profile.skills
      );

      // 2. Availability Match
      const availabilityScore = calculateAvailabilityScore(
        targetAvailability,
        profile.availability
      );

      // 3. Experience Fit
      const experienceScore = calculateExperienceScore(
        experienceLevel,
        profile.experience
      );

      // 4. Interest Overlap (IoU)
      const { iou: interestScore, intersection: overlappingInterests } = calculateIoU(
        targetInterests,
        profile.interests || []
      );

      // Weighted Composite Formula:
      // score = (Skill_Overlap * 0.40) + (Availability_Match * 0.25) + (Experience_Fit * 0.20) + (Interest_Overlap * 0.15)
      const rawScore =
        skillScore * WEIGHT_SKILLS +
        availabilityScore * WEIGHT_AVAILABILITY +
        experienceScore * WEIGHT_EXPERIENCE +
        interestScore * WEIGHT_INTERESTS;

      const matchScore = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

      const matchReason = generateMatchReason(profile, criteria, overlappingSkills, matchScore);

      return {
        ...profile,
        matchScore,
        rawScore,
        matchReason,
        overlappingSkills,
        overlappingInterests,
        breakdown: {
          skillScore: Math.round(skillScore * 100),
          availabilityScore: Math.round(availabilityScore * 100),
          experienceScore: Math.round(experienceScore * 100),
          interestScore: Math.round(interestScore * 100)
        }
      };
    });

  // Sort descending by match score, then rawScore
  return results.sort((a, b) => b.rawScore - a.rawScore);
}
