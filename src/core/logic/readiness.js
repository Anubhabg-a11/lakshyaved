import { detectResumeSections, computeResumeScore } from '../parsing/resumeParser';

export const calculateReadiness = ({ targetRole, rolesDataset, profileSkills = [], profileInterests = [], resumeRawText = '' }) => {
    if (!targetRole || !rolesDataset) return null;
    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) return null;

    const req = role.requiredSkills.map(s => s.toLowerCase());
    const userSkills = profileSkills.map(s => s.toLowerCase());
    const matched = role.requiredSkills.filter(s => userSkills.includes(s.toLowerCase()));
    const scoreA = req.length ? Math.round((matched.length / req.length) * 70) : 0;

    let scoreB = 0;
    if (resumeRawText) {
        const sectionsObj = detectResumeSections(resumeRawText);
        const parserScore = computeResumeScore(sectionsObj); // 0-100
        scoreB = (parserScore / 100) * 20; // scale to 20
    }

    let scoreC = 0;
    if (profileSkills.length >= 8) scoreC += 5;
    const userInterests = profileInterests.map(i => i.toLowerCase());
    const rTags = [role.category.toLowerCase(), ...role.tags.map(t => t.toLowerCase())];
    if (rTags.some(t => userInterests.includes(t))) scoreC += 5;

    let total = Math.round(scoreA + scoreB + scoreC);
    if (total > 100) total = 100;

    return {
        total, breakdown: [
            { label: 'Skill Coverage', value: `${scoreA}/70` },
            { label: 'Resume Profile', value: `${scoreB}/20` },
            { label: 'Consistency', value: `${scoreC}/10` }
        ]
    };
};
