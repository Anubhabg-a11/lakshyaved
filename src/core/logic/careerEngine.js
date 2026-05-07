export function simulateCareer({ skills = [], interests = [], targetRole, rolesDataset = [] }) {
    // 1. Find the target role
    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) {
        throw new Error(`Role not found for ID: ${targetRole}`);
    }

    // 2. Normalize inputs for case-insensitive comparison
    const normalizedUserSkills = skills.map(s => s.trim().toLowerCase());
    const normalizedRequiredSkills = role.requiredSkills.map(s => s.trim().toLowerCase());

    // 3. Calculate skill match
    const matchedSkills = normalizedRequiredSkills.filter(reqSkill =>
        normalizedUserSkills.includes(reqSkill)
    );
    const missingSkills = normalizedRequiredSkills.filter(reqSkill =>
        !normalizedUserSkills.includes(reqSkill)
    );

    // skillMatch = (# skills in requiredSkills) / requiredSkills length
    const skillMatchRatio = role.requiredSkills.length > 0
        ? matchedSkills.length / role.requiredSkills.length
        : 0;

    // 4. Calculate learning speed and effective growth
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    // learningSpeed = clamp(0.7 + skillMatch, 0.7, 1.6)
    const learningSpeed = clamp(0.7 + skillMatchRatio, 0.7, 1.6);

    // effectiveGrowth = clamp(role.growthRate * learningSpeed, 0.10, 0.26)
    const effectiveGrowth = clamp(role.growthRate * learningSpeed, 0.10, 0.26);

    // 5. Generate 5-year projection
    const projection = [];
    let currentSalary = role.baseSalaryINR || 600000;

    for (let year = 1; year <= 5; year++) {
        // Determine title based on year
        // Helper to generate a realistic progression title
        const getTitle = (baseRole, yr) => {
            if (yr === 1) return `Junior ${baseRole}`;
            if (yr === 2) return `${baseRole}`;
            if (yr === 3) return `Mid-Level ${baseRole}`;
            if (yr === 4) return `Senior ${baseRole}`;
            return `Lead ${baseRole}`;
        };

        projection.push({
            year: year,
            title: getTitle(role.roleName, year),
            salaryINR: Math.round(currentSalary),
            skillMatch: Math.round(skillMatchRatio * 100),
            milestone: `Year ${year} Milestone`
        });

        // Apply growth for next year
        currentSalary = currentSalary * (1 + effectiveGrowth);
    }

    // 6. Return standard response object
    return {
        projection,
        explain: {
            requiredSkills: role.requiredSkills, // Original casing
            matchedSkills: role.requiredSkills.filter(s => normalizedUserSkills.includes(s.trim().toLowerCase())),
            missingSkills: role.requiredSkills.filter(s => !normalizedUserSkills.includes(s.trim().toLowerCase())),
            skillMatchPercent: Math.round(skillMatchRatio * 100),
            effectiveGrowthPercent: Math.round(effectiveGrowth * 100)
        }
    };
}
