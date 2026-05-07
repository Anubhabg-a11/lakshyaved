/**
 * Recommendation Engine
 * Generates explainable, actionable recommendations based on user profile, target role, and analysis data.
 */

export function generateRecommendations({ targetRole, rolesDataset, profileSkills = [], profileInterests = [], resumeSections = null, matchRate = 0, missingSkills = [], readinessScore = 0 }) {
    if (!targetRole || !rolesDataset) return [];

    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) return [];

    const recommendations = [];

    // 1. Missing Skills Recommendations
    if (missingSkills.length > 0) {
        const topMissing = missingSkills.slice(0, 3);
        const improvementEstimate = Math.min(30, Math.round((topMissing.length / (role.requiredSkills?.length || 1)) * 70));

        recommendations.push({
            id: 'missing-skills',
            category: 'skill',
            impact: missingSkills.length >= 3 ? 'high' : 'medium',
            title: `Bridge ${missingSkills.length} Skill Gap${missingSkills.length > 1 ? 's' : ''}`,
            text: `You're missing ${topMissing.join(', ')}${missingSkills.length > 3 ? ` and ${missingSkills.length - 3} more` : ''}. Learning these could increase your match rate from ${matchRate}% to ~${Math.min(100, matchRate + improvementEstimate)}%.`,
            actionable: `Start with ${topMissing[0]} — it's the most commonly required skill for ${role.roleName}.`
        });
    }

    // 2. Skill Depth Recommendation
    if (profileSkills.length < 5) {
        recommendations.push({
            id: 'skill-breadth',
            category: 'skill',
            impact: 'medium',
            title: 'Expand Your Skill Set',
            text: `You have ${profileSkills.length} skill${profileSkills.length !== 1 ? 's' : ''} listed. Most competitive candidates for ${role.roleName} have 8-12 skills. Adding more skills will improve your readiness score.`,
            actionable: 'Focus on complementary skills like version control (Git), cloud basics (AWS/GCP), or soft skills (Agile, Communication).'
        });
    }

    // 3. Resume Section Recommendations
    if (resumeSections) {
        const missingSections = [];
        if (!resumeSections.projects) missingSections.push('Projects');
        if (!resumeSections.experience) missingSections.push('Experience');
        if (!resumeSections.summary) missingSections.push('Professional Summary');
        if (!resumeSections.links) missingSections.push('Links (GitHub/LinkedIn)');

        if (missingSections.length > 0) {
            const impactPercent = missingSections.length * 5;
            recommendations.push({
                id: 'resume-sections',
                category: 'resume',
                impact: missingSections.length >= 3 ? 'high' : 'medium',
                title: `Strengthen Your Resume`,
                text: `Your resume is missing: ${missingSections.join(', ')}. Adding these sections could improve your resume score by ~${impactPercent}%.`,
                actionable: missingSections.includes('Projects')
                    ? `Add 2-3 technical projects with clear descriptions of tech stack, your role, and measurable impact.`
                    : `Add a concise ${missingSections[0]} section to your resume.`
            });
        }
    }

    // 4. Interest Alignment
    if (role.tags && role.category) {
        const userInterestsLower = profileInterests.map(i => i.toLowerCase());
        const roleTags = [role.category.toLowerCase(), ...role.tags.map(t => t.toLowerCase())];
        const alignedInterests = roleTags.filter(t => userInterestsLower.includes(t));

        if (alignedInterests.length === 0 && profileInterests.length > 0) {
            recommendations.push({
                id: 'interest-alignment',
                category: 'career',
                impact: 'low',
                title: 'Interest-Role Mismatch',
                text: `Your stated interests don't strongly align with ${role.roleName} (${role.category}). This may affect long-term career satisfaction.`,
                actionable: `Consider exploring roles in ${profileInterests[0] || 'your interest area'} or expanding your interests to include ${role.category}.`
            });
        }
    }

    // 5. Readiness Boost
    if (readinessScore < 50) {
        recommendations.push({
            id: 'readiness-boost',
            category: 'career',
            impact: 'high',
            title: 'Low Readiness — Action Plan Needed',
            text: `Your readiness score is ${readinessScore}/100. To be competitive for ${role.roleName}, aim for at least 60. The fastest way to improve is closing skill gaps and uploading a complete resume.`,
            actionable: 'Use the Roadmap Planner to create a structured week-by-week learning plan.'
        });
    } else if (readinessScore >= 70) {
        recommendations.push({
            id: 'readiness-strong',
            category: 'career',
            impact: 'low',
            title: 'Strong Profile — Focus on Differentiation',
            text: `Your readiness score is ${readinessScore}/100 — well above average. Focus on building portfolio projects and gaining real-world experience to stand out.`,
            actionable: 'Consider contributing to open-source projects or building a capstone project related to your target role.'
        });
    }

    // 6. High Match but Low Resume
    if (matchRate >= 70 && resumeSections && !resumeSections.experience && !resumeSections.projects) {
        recommendations.push({
            id: 'skills-resume-gap',
            category: 'resume',
            impact: 'high',
            title: 'Skills Are Strong, Resume Needs Work',
            text: `You have a ${matchRate}% skill match, but your resume lacks Experience and Projects sections. Without evidence of practical application, recruiters may overlook your profile.`,
            actionable: 'Document your skills through project write-ups, even personal or academic ones.'
        });
    }

    return recommendations.sort((a, b) => {
        const priority = { high: 0, medium: 1, low: 2 };
        return (priority[a.impact] || 2) - (priority[b.impact] || 2);
    });
}
