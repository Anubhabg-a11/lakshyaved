/**
 * Scenario Simulation Engine
 * Generates 3 what-if scenarios: Current Path, Upskill Path, and Pivot Path.
 */

export function generateScenarios({ targetRole, rolesDataset, profileSkills = [], matchRate = 0, missingSkills = [], readinessScore = 0 }) {
    if (!targetRole || !rolesDataset) return [];

    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) return [];

    const scenarios = [];

    // Scenario 1: Current Path (as-is)
    const currentSalaryY5 = Math.round((role.baseSalaryINR || 600000) * Math.pow(1 + (role.growthRate || 0.12), 5));
    scenarios.push({
        id: 'current',
        name: 'Current Path',
        emoji: '📊',
        description: `Continue as-is with your current ${profileSkills.length} skills and ${matchRate}% match rate.`,
        matchRate: matchRate,
        readiness: readinessScore,
        salaryY5: currentSalaryY5,
        timeline: 'No additional effort',
        verdict: matchRate >= 70 ? 'Viable — you have a solid foundation' : 'Risky — significant gaps remain'
    });

    // Scenario 2: Upskill Path (learn missing skills)
    if (missingSkills.length > 0) {
        const newMatchRate = 100;
        const weeksToLearn = Math.max(4, missingSkills.length * 2);
        const growthBoost = Math.min(0.05, missingSkills.length * 0.01);
        const upskilledSalaryY5 = Math.round((role.baseSalaryINR || 600000) * Math.pow(1 + (role.growthRate || 0.12) + growthBoost, 5));
        const readinessBoost = Math.min(100, readinessScore + Math.round((missingSkills.length / (role.requiredSkills?.length || 1)) * 40));

        scenarios.push({
            id: 'upskill',
            name: 'Upskill Path',
            emoji: '🚀',
            description: `Learn ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? ` +${missingSkills.length - 3} more` : ''} to close all skill gaps.`,
            matchRate: newMatchRate,
            readiness: readinessBoost,
            salaryY5: upskilledSalaryY5,
            timeline: `~${weeksToLearn} weeks of focused learning`,
            verdict: 'Recommended — maximum alignment with target role',
            salaryDiff: upskilledSalaryY5 - currentSalaryY5,
            readinessDiff: readinessBoost - readinessScore
        });
    }

    // Scenario 3: Pivot Path (switch to a better-matched role)
    const userSkillsLower = profileSkills.map(s => s.toLowerCase());
    let bestPivot = null;
    let bestPivotMatch = 0;

    for (const r of rolesDataset) {
        if (r.roleId === targetRole) continue;
        if (!r.requiredSkills || r.requiredSkills.length === 0) continue;

        const matched = r.requiredSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
        const pivotMatchRate = Math.round((matched.length / r.requiredSkills.length) * 100);

        if (pivotMatchRate > bestPivotMatch && pivotMatchRate > matchRate) {
            bestPivotMatch = pivotMatchRate;
            bestPivot = r;
        }
    }

    if (bestPivot) {
        const pivotSalaryY5 = Math.round((bestPivot.baseSalaryINR || 600000) * Math.pow(1 + (bestPivot.growthRate || 0.12), 5));
        scenarios.push({
            id: 'pivot',
            name: 'Pivot Path',
            emoji: '🔄',
            description: `Switch target to ${bestPivot.roleName} where you already have a ${bestPivotMatch}% skill match.`,
            matchRate: bestPivotMatch,
            readiness: Math.min(100, readinessScore + (bestPivotMatch - matchRate)),
            salaryY5: pivotSalaryY5,
            timeline: 'Immediate — leverages existing skills',
            verdict: bestPivotMatch >= 80 ? 'Strong alternative — high natural fit' : 'Worth exploring — better skill alignment',
            pivotRole: bestPivot.roleName,
            salaryDiff: pivotSalaryY5 - currentSalaryY5,
            readinessDiff: Math.min(100, readinessScore + (bestPivotMatch - matchRate)) - readinessScore
        });
    }

    return scenarios;
}
