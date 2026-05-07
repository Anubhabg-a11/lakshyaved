/**
 * Readiness Engine v2
 * 6-factor model with confidence scoring and explanations.
 */

import { detectResumeSections, computeResumeScore, detectActionVerbs, countBulletPoints } from '../parsing/resumeParser';

const PROFICIENCY_SCORE = { beginner: 0.33, intermediate: 0.66, advanced: 1.0 };
const GRADES = [
    { min: 85, grade: 'A', label: 'Excellent' },
    { min: 70, grade: 'B', label: 'Strong' },
    { min: 50, grade: 'C', label: 'Moderate' },
    { min: 30, grade: 'D', label: 'Developing' },
    { min: 0, grade: 'F', label: 'Early Stage' }
];

function getGrade(score) {
    return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
}

export const calculateReadiness = ({
    targetRole, rolesDataset, profileSkills = [], profileInterests = [],
    resumeRawText = '', education = '', skillsWithLevels = []
}) => {
    if (!targetRole || !rolesDataset) return null;
    const role = rolesDataset.find(r => r.roleId === targetRole);
    if (!role) return null;

    const factors = [];
    const swl = skillsWithLevels.length > 0
        ? skillsWithLevels
        : profileSkills.map(s => ({ name: s, level: 'intermediate' }));

    // Factor 1: Weighted Skill Match (0-35)
    const weights = role.skillWeights || {};
    const required = role.requiredSkills || [];
    const userMap = {};
    for (const s of swl) userMap[s.name.toLowerCase()] = PROFICIENCY_SCORE[s.level] || 0.66;

    let totalWeight = 0, earnedWeight = 0;
    for (const skill of required) {
        const w = weights[skill] || 0.8;
        totalWeight += w;
        const userLevel = userMap[skill.toLowerCase()];
        if (userLevel !== undefined) earnedWeight += userLevel * w;
    }
    const skillRatio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
    const f1Score = Math.round(skillRatio * 35);
    const matchedCount = required.filter(s => userMap[s.toLowerCase()] !== undefined).length;

    factors.push({
        name: 'Weighted Skill Match',
        score: f1Score, maxScore: 35,
        confidence: swl.length >= 3 ? 'high' : 'low',
        explanation: `You match ${matchedCount}/${required.length} required skills with a weighted proficiency score of ${Math.round(skillRatio * 100)}%.`
    });

    // Factor 2: Resume Completeness (0-15)
    let f2Score = 0;
    let f2Conf = 'low';
    let f2Explain = 'No resume uploaded. Upload your resume to improve this score.';
    if (resumeRawText) {
        const sections = detectResumeSections(resumeRawText);
        const resumeScore = computeResumeScore(sections);
        f2Score = Math.round((resumeScore / 100) * 15);
        f2Conf = 'high';
        const sectionCount = Object.values(sections).filter(Boolean).length;
        f2Explain = `Resume has ${sectionCount}/7 key sections detected. Base resume score: ${resumeScore}/100.`;
    }
    factors.push({ name: 'Resume Completeness', score: f2Score, maxScore: 15, confidence: f2Conf, explanation: f2Explain });

    // Factor 3: Experience Signals (0-15)
    let f3Score = 0;
    let f3Conf = 'low';
    let f3Explain = 'No resume to analyze experience signals from.';
    if (resumeRawText) {
        const actionVerbs = detectActionVerbs(resumeRawText);
        const bullets = countBulletPoints(resumeRawText);
        const verbScore = Math.min(1, actionVerbs.count / 8);
        const bulletScore = Math.min(1, bullets / 10);
        f3Score = Math.round((verbScore * 0.6 + bulletScore * 0.4) * 15);
        f3Conf = 'medium';
        f3Explain = `Found ${actionVerbs.count} action verbs and ${bullets} bullet points. Strong verbs: ${actionVerbs.found.slice(0, 4).join(', ') || 'none detected'}.`;
    }
    factors.push({ name: 'Experience Signals', score: f3Score, maxScore: 15, confidence: f3Conf, explanation: f3Explain });

    // Factor 4: Education Fit (0-10)
    let f4Score = 5; // default middle
    let f4Explain = 'No education info provided.';
    if (education && role.educationBonus) {
        const bonus = role.educationBonus[education] || 0.9;
        f4Score = Math.round(Math.min(1, bonus) * 10);
        f4Explain = bonus >= 1.0
            ? `${education} is well-suited for ${role.roleName} (${Math.round(bonus * 100)}% fit).`
            : `${education} is acceptable for ${role.roleName} (${Math.round(bonus * 100)}% fit). A higher degree may improve prospects.`;
    }
    factors.push({ name: 'Education Fit', score: f4Score, maxScore: 10, confidence: education ? 'high' : 'low', explanation: f4Explain });

    // Factor 5: Interest Alignment (0-10)
    let f5Score = 0;
    const userInterests = profileInterests.map(i => i.toLowerCase());
    const roleTags = [...(role.tags || []).map(t => t.toLowerCase()), (role.category || '').toLowerCase()];
    const alignedCount = roleTags.filter(t => userInterests.includes(t)).length;
    if (alignedCount > 0) {
        f5Score = Math.min(10, Math.round((alignedCount / Math.max(roleTags.length, 1)) * 10));
    }
    const f5Explain = alignedCount > 0
        ? `${alignedCount} of your interests align with ${role.roleName}'s domain.`
        : profileInterests.length > 0
            ? `Your interests don't strongly align with ${role.category}. This may affect long-term satisfaction.`
            : 'No interests provided.';
    factors.push({ name: 'Interest Alignment', score: f5Score, maxScore: 10, confidence: profileInterests.length > 0 ? 'medium' : 'low', explanation: f5Explain });

    // Factor 6: Portfolio Evidence (0-15)
    let f6Score = 0;
    let f6Conf = 'low';
    let f6Explain = 'No resume to assess portfolio evidence.';
    if (resumeRawText) {
        const sections = detectResumeSections(resumeRawText);
        const hasProjects = sections.projects ? 6 : 0;
        const hasLinks = sections.links ? 4 : 0;
        const hasCerts = sections.certifications ? 3 : 0;
        f6Score = Math.min(15, hasProjects + hasLinks + hasCerts);
        f6Conf = 'medium';
        const parts = [];
        if (sections.projects) parts.push('projects');
        if (sections.links) parts.push('portfolio links');
        if (sections.certifications) parts.push('certifications');
        f6Explain = parts.length > 0
            ? `Detected: ${parts.join(', ')}. Concrete evidence strengthens your profile.`
            : 'No projects, links, or certifications detected in resume.';
    }
    factors.push({ name: 'Portfolio Evidence', score: f6Score, maxScore: 15, confidence: f6Conf, explanation: f6Explain });

    // Aggregate
    const total = Math.min(100, factors.reduce((sum, f) => sum + f.score, 0));
    const { grade, label } = getGrade(total);
    const maxPossible = factors.reduce((sum, f) => sum + f.maxScore, 0);
    const overallConfidence = factors.filter(f => f.confidence === 'high').length >= 3 ? 'high'
        : factors.filter(f => f.confidence !== 'low').length >= 3 ? 'medium' : 'low';

    return {
        total, grade, gradeLabel: label,
        confidence: overallConfidence,
        factors,
        improvementPotential: maxPossible - total,
        // Backward-compatible breakdown
        breakdown: factors.map(f => ({ label: f.name, value: `${f.score}/${f.maxScore}` }))
    };
};
