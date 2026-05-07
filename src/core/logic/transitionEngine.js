/**
 * Role Transition Engine
 * Analyzes career path connections using transitionFrom/To data.
 * Computes transition cost (skills to learn), gain (salary delta), and difficulty.
 */

const PROFICIENCY_SCORE = { beginner: 0.33, intermediate: 0.66, advanced: 1.0 };

export function analyzeTransitions({ targetRole, rolesDataset, profileSkills = [], skillsWithLevels = [] }) {
    if (!targetRole || !rolesDataset) return { nextRoles: [], fromRoles: [] };

    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) return { nextRoles: [], fromRoles: [] };

    const swl = skillsWithLevels.length > 0
        ? skillsWithLevels
        : profileSkills.map(s => ({ name: s, level: 'intermediate' }));

    const userSkillsLower = new Set(swl.map(s => s.name.toLowerCase()));

    // Analyze "where can I go next?" transitions
    const nextRoles = (role.transitionTo || [])
        .map(targetId => {
            const nextRole = rolesDataset.find(r => r.roleId === targetId);
            if (!nextRole) return null;

            const required = nextRole.requiredSkills || [];
            const alreadyHave = required.filter(s => userSkillsLower.has(s.toLowerCase()));
            const needToLearn = required.filter(s => !userSkillsLower.has(s.toLowerCase()));
            const matchPercent = required.length > 0 ? Math.round((alreadyHave.length / required.length) * 100) : 0;
            const salaryGain = (nextRole.seniorSalaryINR || 0) - (role.seniorSalaryINR || 0);
            const difficulty = needToLearn.length <= 2 ? 'low' : needToLearn.length <= 4 ? 'medium' : 'high';

            // Transition score: higher = more attractive
            const transitionScore = Math.round((salaryGain / 100000) / (needToLearn.length + 1));

            return {
                roleId: nextRole.roleId,
                roleName: nextRole.roleName,
                category: nextRole.category,
                matchPercent,
                alreadyHave,
                needToLearn,
                salaryGain,
                seniorSalary: nextRole.seniorSalaryINR,
                difficulty,
                transitionScore,
                demandLevel: nextRole.demandLevel || 'medium',
                verdict: getVerdict(matchPercent, salaryGain, difficulty)
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.transitionScore - a.transitionScore);

    // Analyze "where could I have come from?" (context)
    const fromRoles = (role.transitionFrom || [])
        .map(fromId => {
            const fromRole = rolesDataset.find(r => r.roleId === fromId);
            if (!fromRole) return null;
            return { roleId: fromRole.roleId, roleName: fromRole.roleName, category: fromRole.category };
        })
        .filter(Boolean);

    return { nextRoles, fromRoles, currentRole: role.roleName };
}

function getVerdict(matchPercent, salaryGain, difficulty) {
    if (matchPercent >= 70 && salaryGain > 0) return 'Natural progression — strong skill overlap and salary growth';
    if (matchPercent >= 50 && difficulty === 'low') return 'Easy transition — few new skills needed';
    if (salaryGain > 1000000) return 'High reward — significant salary ceiling increase';
    if (matchPercent < 30) return 'Ambitious leap — requires substantial reskilling';
    return 'Worth exploring — moderate alignment with your current skills';
}
