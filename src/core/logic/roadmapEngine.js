export function generateRoadmap({ targetRole, missingSkills = [], durationWeeks = 4 }) {
    if (!targetRole) throw new Error("targetRole is required");

    const validDurations = [4, 8, 12];
    if (!validDurations.includes(durationWeeks)) {
        durationWeeks = 4;
    }

    const id = `${targetRole}-${durationWeeks}`;

    // Fallback if no specific skills missing
    const skillsToCover = missingSkills.length > 0
        ? [...missingSkills]
        : ["Domain Fundamentals", "Core Patterns", "Advanced Tools", "Best Practices"];

    const weeks = [];
    let totalTasks = 0;
    let totalEstHours = 0;

    let skillIndex = 0;

    for (let w = 1; w <= durationWeeks; w++) {
        // distribute skills evenly, minimum 1 per week
        const skillsPerWeek = Math.max(1, Math.ceil(skillsToCover.length / durationWeeks));

        const focusSkills = [];
        for (let i = 0; i < skillsPerWeek; i++) {
            if (skillIndex < skillsToCover.length) {
                focusSkills.push(skillsToCover[skillIndex]);
                skillIndex++;
            }
        }

        // if we run out of new skills, cycle back or specify review
        if (focusSkills.length === 0) {
            focusSkills.push("Review & Integration");
        }

        const tasks = [];
        let tIndex = 1;

        focusSkills.forEach(skill => {
            // Learn
            tasks.push({
                id: `w${w}-s${skillIndex}-${tIndex++}`,
                skill,
                text: `Complete fundamentals + notes for ${skill}`,
                type: 'learn',
                estHours: 4
            });
            // Practice
            tasks.push({
                id: `w${w}-s${skillIndex}-${tIndex++}`,
                skill,
                text: `Solve 10 exercises / small problems for ${skill}`,
                type: 'practice',
                estHours: 6
            });
            // Build
            tasks.push({
                id: `w${w}-s${skillIndex}-${tIndex++}`,
                skill,
                text: `Mini-project feature using ${skill}`,
                type: 'build',
                estHours: 10
            });
            // Revise
            tasks.push({
                id: `w${w}-s${skillIndex}-${tIndex++}`,
                skill,
                text: `Review + summarize + flashcards for ${skill}`,
                type: 'revise',
                estHours: 2
            });
        });

        const weekEstHours = tasks.reduce((sum, t) => sum + t.estHours, 0);

        weeks.push({
            week: w,
            focusSkills,
            tasks,
            weekEstHours
        });

        totalTasks += tasks.length;
        totalEstHours += weekEstHours;
    }

    return {
        id,
        targetRole,
        durationWeeks,
        weeks,
        summary: {
            totalTasks,
            totalEstHours
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}
