/**
 * ProjectMatch - AI Service for Dynamic Match Justifications & Team Pitch
 * Calls Express backend proxy (/api/ai-synthesis) with Google AI Studio (gemini-2.5-flash)
 * and provides seamless client-side fallbacks.
 */

// In-memory cache for generated justifications to prevent redundant network calls
const explanationCache = new Map();

/**
 * Generates a polished rule-based fallback justification when API key is missing or server is unreachable.
 * @param {Object} criteria - User search criteria
 * @param {Object} candidate - Candidate profile with match calculations
 * @returns {string}
 */
export function generateFallbackExplanation(criteria = {}, candidate = {}) {
  const name = candidate.name || 'This candidate';
  const role = candidate.role || 'teammate';
  const overlapping = candidate.overlappingSkills || [];
  const candidateSkills = candidate.skills || [];
  const availability = candidate.availability || 'Flexible';
  const score = candidate.matchScore || 0;

  if (overlapping.length >= 2) {
    return `${name}'s proven expertise in ${overlapping.slice(0, 2).join(' & ')} directly tackles your core tech requirements, complemented by their ${availability.toLowerCase()} availability.`;
  }

  if (overlapping.length === 1) {
    return `${name} brings targeted ${overlapping[0]} capabilities and solid ${candidate.experience?.toLowerCase() || 'intermediate'} engineering background to accelerate your ${role.toLowerCase()} deliverables.`;
  }

  if (candidate.experience === criteria.experienceLevel && criteria.experienceLevel !== 'Any') {
    return `${name}'s ${candidate.experience?.toLowerCase()} track record and background in ${candidateSkills.slice(0, 2).join(', ')} aligns well with your team's target seniority.`;
  }

  if (candidate.availability === criteria.targetAvailability && criteria.targetAvailability !== 'Any') {
    return `${name} offers direct schedule synchronization with your ${availability.toLowerCase()} milestone sprint, backed by full-stack flexibility.`;
  }

  if (score >= 75) {
    return `${name} demonstrates comprehensive multi-factor synergy across ${candidateSkills.slice(0, 3).join(', ')} and agile hackathon velocity.`;
  }

  if (score >= 50) {
    return `${name} offers solid complementary technical skills in ${candidateSkills.slice(0, 2).join(', ')} to diversify your team's capabilities.`;
  }

  return `${name} provides broad foundational skill coverage in ${candidateSkills.slice(0, 2).join(', ')} with an active interest in collaborative building.`;
}

/**
 * Generates a rule-based fallback team pitch.
 * @param {Array} squad - Array of candidate objects
 * @returns {string}
 */
export function generateFallbackTeamPitch(squad = []) {
  if (!squad || squad.length === 0) {
    return 'Assemble your squad first to generate a customized AI team pitch.';
  }

  const aggregatedSkills = Array.from(new Set(squad.flatMap((m) => m.skills || []))).slice(0, 6);
  const roles = Array.from(new Set(squad.map((m) => m.role))).join(', ');

  return `Our multidisciplinary hackathon squad brings together top talent across ${roles}. With deep aggregate expertise spanning ${aggregatedSkills.slice(0, 5).join(', ')}, we combine rapid UI iteration, resilient distributed backend architecture, and agile shipping velocity to build and launch an award-winning prototype.`;
}

/**
 * Calls backend Express proxy (/api/ai-synthesis) to generate a personalized 1-to-2 sentence match justification.
 * Falls back gracefully to rule-based generation if backend or AI key is absent.
 * 
 * @param {Object} criteria - Search criteria ({ requiredSkills, targetAvailability, experienceLevel, targetInterests, roleFilter })
 * @param {Object} candidate - Candidate profile object ({ name, role, skills, overlappingSkills, availability, experience, bio, matchScore })
 * @param {boolean} [forceRefresh=false] - If true, bypasses the local cache
 * @returns {Promise<{ explanation: string, isAiGenerated: boolean, source: 'gemini' | 'fallback' }>}
 */
export async function generateMatchExplanation(criteria = {}, candidate = {}, forceRefresh = false) {
  if (!candidate || !candidate.id) {
    return {
      explanation: 'No candidate profile provided.',
      isAiGenerated: false,
      source: 'fallback'
    };
  }

  const cacheKey = `${candidate.id}_${JSON.stringify(criteria?.requiredSkills || [])}_${criteria?.targetAvailability || ''}_${criteria?.experienceLevel || ''}`;

  if (!forceRefresh && explanationCache.has(cacheKey)) {
    return explanationCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch('/api/ai-synthesis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        type: 'synthesis',
        criteria,
        candidate
      })
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.explanation) {
        const result = {
          explanation: data.explanation,
          isAiGenerated: Boolean(data.isAiGenerated),
          source: data.source || (data.isAiGenerated ? 'gemini' : 'fallback')
        };
        explanationCache.set(cacheKey, result);
        return result;
      }
    }

    // Fallback if non-ok response
    console.warn('[aiService] Backend synthesis non-OK, using client fallback');
    const fallbackText = generateFallbackExplanation(criteria, candidate);
    const result = {
      explanation: fallbackText,
      isAiGenerated: false,
      source: 'fallback'
    };
    explanationCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.warn('[aiService] Request to /api/ai-synthesis failed or timed out:', error.message);
    const fallbackText = generateFallbackExplanation(criteria, candidate);
    const result = {
      explanation: fallbackText,
      isAiGenerated: false,
      source: 'fallback'
    };
    explanationCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Generates an AI Elevator Pitch summarizing a formed squad's combined strengths via /api/ai-synthesis.
 * @param {Array} squad - Array of candidate objects
 * @returns {Promise<{ pitch: string, isAiGenerated: boolean }>}
 */
export async function generateTeamPitch(squad = []) {
  if (!squad || squad.length === 0) {
    return {
      pitch: 'Assemble your squad first to generate a customized AI team pitch.',
      isAiGenerated: false
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch('/api/ai-synthesis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        type: 'pitch',
        squad
      })
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.pitch) {
        return {
          pitch: data.pitch,
          isAiGenerated: Boolean(data.isAiGenerated)
        };
      }
    }

    // Client fallback
    return {
      pitch: generateFallbackTeamPitch(squad),
      isAiGenerated: false
    };

  } catch (err) {
    console.warn('[aiService] Team pitch generation failed, using client fallback:', err.message);
    return {
      pitch: generateFallbackTeamPitch(squad),
      isAiGenerated: false
    };
  }
}

/**
 * Generates a rule-based fallback squad synergy and skill gap analysis.
 * @param {Array} squad - Array of candidate objects
 * @returns {{ synergyScore: string, detectedGaps: string[], teamStrengths: string[], recommendation: string }}
 */
export function generateFallbackSquadAnalysis(squad = []) {
  if (!squad || !Array.isArray(squad) || squad.length === 0) {
    return {
      synergyScore: "0%",
      detectedGaps: [
        "Frontend Engineering",
        "Backend / Database Architecture",
        "UI/UX Design & Prototyping",
        "DevOps / Cloud Deployment"
      ],
      teamStrengths: [
        "Squad roster is currently empty"
      ],
      recommendation: "Add candidates from the talent pool to begin your AI squad synergy audit."
    };
  }

  const allSkills = squad.flatMap((m) => m.skills || []);
  const uniqueSkills = Array.from(new Set(allSkills));
  const uniqueSkillsLower = uniqueSkills.map((s) => s.toLowerCase());
  const roles = squad.map((m) => m.role || '');
  const rolesLower = roles.map((r) => r.toLowerCase());

  // Domain presence checks
  const hasFrontend = rolesLower.some(r => r.includes('front') || r.includes('web') || r.includes('ui')) ||
    uniqueSkillsLower.some(s => ['react', 'vue', 'svelte', 'typescript', 'javascript', 'tailwind', 'next.js', 'html', 'css', 'redux'].some(k => s.includes(k)));

  const hasBackend = rolesLower.some(r => r.includes('back') || r.includes('full') || r.includes('system') || r.includes('api') || r.includes('engineer')) ||
    uniqueSkillsLower.some(s => ['node', 'express', 'python', 'django', 'fastapi', 'go', 'rust', 'java', 'sql', 'postgres', 'mongo', 'graphql'].some(k => s.includes(k)));

  const hasDevOps = rolesLower.some(r => r.includes('devops') || r.includes('cloud') || r.includes('infra') || r.includes('sre')) ||
    uniqueSkillsLower.some(s => ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'terraform', 'linux'].some(k => s.includes(k)));

  const hasDesign = rolesLower.some(r => r.includes('design') || r.includes('ux') || r.includes('product')) ||
    uniqueSkillsLower.some(s => ['figma', 'adobe', 'ui/ux', 'wireframing', 'design systems', 'user research'].some(k => s.includes(k)));

  const hasAI = rolesLower.some(r => r.includes('ai') || r.includes('ml') || r.includes('data') || r.includes('machine')) ||
    uniqueSkillsLower.some(s => ['pytorch', 'tensorflow', 'openai', 'gemini', 'langchain', 'nlp', 'machine learning', 'python', 'pandas', 'huggingface'].some(k => s.includes(k)));

  // Calculate synergy score percentage (bounded between 55% and 98%)
  let score = 56 + (squad.length * 7.5);
  const uniqueRolesCount = new Set(roles).size;
  score += Math.min(uniqueRolesCount * 3, 10);
  if (hasFrontend && hasBackend) score += 6;
  if (hasDesign) score += 4;
  if (hasDevOps) score += 4;
  if (hasAI) score += 4;
  if (uniqueSkills.length >= 8) score += 3;

  const boundedScore = Math.min(Math.max(Math.round(score), 55), 98);
  const synergyScore = `${boundedScore}%`;

  // Detect critical gaps
  const detectedGaps = [];
  if (!hasDevOps) detectedGaps.push("DevOps / Cloud Architecture");
  if (!hasDesign) detectedGaps.push("UI/UX Design & Prototyping");
  if (!hasAI) detectedGaps.push("AI/ML & Prompt Engineering");
  if (!hasBackend) detectedGaps.push("Backend & Database Architecture");
  if (!hasFrontend) detectedGaps.push("Frontend & Web Performance");
  if (detectedGaps.length === 0) {
    detectedGaps.push("Demo Presentation & Growth Strategy");
  }

  // Determine team superpowers / strengths
  const teamStrengths = [];
  if (hasFrontend && hasBackend) {
    teamStrengths.push("End-to-end Full Stack execution velocity (Client & Server)");
  } else if (hasFrontend) {
    teamStrengths.push("High-fidelity frontend engineering and UI interaction design");
  } else if (hasBackend) {
    teamStrengths.push("Robust backend API development and scalable system design");
  }

  if (hasAI) {
    teamStrengths.push("Advanced Machine Learning and intelligent AI model integration");
  }
  if (hasDesign) {
    teamStrengths.push("User-centric UX flows, design systems, and rapid Figma wireframing");
  }
  if (hasDevOps) {
    teamStrengths.push("Containerized cloud deployments with continuous integration");
  }

  if (uniqueSkills.length > 0) {
    const topSkillsList = uniqueSkills.slice(0, 4).join(', ');
    teamStrengths.push(`Strong collective technical toolkit spanning ${topSkillsList}`);
  }

  // Generate 1-sentence recommendation
  let recommendation = "";
  if (detectedGaps.includes("DevOps / Cloud Architecture")) {
    recommendation = "Recruit a DevOps specialist or Cloud Architect to streamline automated deployments, containerization, and backend infrastructure.";
  } else if (detectedGaps.includes("UI/UX Design & Prototyping")) {
    recommendation = "Bring in a dedicated UI/UX Designer to craft cohesive Figma prototypes and elevate judge presentation aesthetics.";
  } else if (detectedGaps.includes("AI/ML & Prompt Engineering")) {
    recommendation = "Add an AI/ML Engineer to implement intelligent model pipelines and prompt engineering workflows into your project.";
  } else if (detectedGaps.includes("Backend & Database Architecture")) {
    recommendation = "Partner with a Backend Engineer to architect persistent databases, secure authentication, and low-latency APIs.";
  } else {
    recommendation = "Your core engineering stack is well-rounded; focus on refining your demo presentation and submission pitch.";
  }

  return {
    synergyScore,
    detectedGaps: detectedGaps.slice(0, 3),
    teamStrengths: teamStrengths.slice(0, 3),
    recommendation
  };
}

// In-memory cache for squad synergy audit results
const squadAuditCache = new Map();

/**
 * Calls backend Express API (/api/ai-squad-analysis) to run an AI Squad Synergy & Skill Gap Audit.
 * Falls back to client-side rule engine if server is unreachable.
 * 
 * @param {Array} squad - Array of candidate objects in user's squad
 * @param {boolean} [forceRefresh=false] - Bypass cache if true
 * @returns {Promise<{ success: boolean, synergyScore: string, detectedGaps: string[], teamStrengths: string[], recommendation: string, isAiGenerated: boolean, source: string }>}
 */
export async function analyzeSquadSynergy(squad = [], forceRefresh = false) {
  if (!squad || !Array.isArray(squad) || squad.length === 0) {
    const emptyFallback = generateFallbackSquadAnalysis([]);
    return {
      success: true,
      ...emptyFallback,
      isAiGenerated: false,
      source: 'fallback'
    };
  }

  const cacheKey = squad.map((m) => m.id).sort().join('_');

  if (!forceRefresh && squadAuditCache.has(cacheKey)) {
    return squadAuditCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('/api/ai-squad-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({ squad })
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.synergyScore) {
        const result = {
          success: true,
          synergyScore: data.synergyScore,
          detectedGaps: data.detectedGaps || [],
          teamStrengths: data.teamStrengths || [],
          recommendation: data.recommendation || '',
          isAiGenerated: Boolean(data.isAiGenerated),
          source: data.source || (data.isAiGenerated ? 'gemini' : 'fallback')
        };
        squadAuditCache.set(cacheKey, result);
        return result;
      }
    }

    // Client fallback on non-OK response
    console.warn('[aiService] Squad analysis backend response non-OK, using client fallback');
    const fallback = generateFallbackSquadAnalysis(squad);
    const result = {
      success: true,
      ...fallback,
      isAiGenerated: false,
      source: 'fallback'
    };
    squadAuditCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.warn('[aiService] Request to /api/ai-squad-analysis failed:', error.message);
    const fallback = generateFallbackSquadAnalysis(squad);
    const result = {
      success: true,
      ...fallback,
      isAiGenerated: false,
      source: 'fallback'
    };
    squadAuditCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Clears the explanation and audit cache if needed.
 */
export function clearExplanationCache() {
  explanationCache.clear();
  squadAuditCache.clear();
}

