import roles from "../data/roles.v1.json";
import skills from "../data/skills.v1.json";
import interests from "../data/interests.v1.json";
import rolesDataset from "./rolesDataset"; // fallback

export function getAllRoles() {
    return (roles && roles.length > 0) ? roles : rolesDataset;
}

export function getAllSkills() {
    return skills || [];
}

export function getAllInterests() {
    return interests || [];
}

export function findRoles(query, limit = 10) {
    const allRoles = getAllRoles();
    if (!query || !query.trim()) return [];

    const q = query.toLowerCase().trim();
    const matches = allRoles.filter(r => {
        if (r.roleName && r.roleName.toLowerCase().includes(q)) return true;
        if (r.aliases && r.aliases.some(a => a.toLowerCase().includes(q))) return true;
        return false;
    });

    matches.sort((a, b) => {
        const aName = (a.roleName || '').toLowerCase();
        const bName = (b.roleName || '').toLowerCase();

        const aStarts = aName.startsWith(q) || (a.aliases && a.aliases.some(al => al.toLowerCase().startsWith(q)));
        const bStarts = bName.startsWith(q) || (b.aliases && b.aliases.some(al => al.toLowerCase().startsWith(q)));

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aName.length - bName.length;
    });

    return matches.slice(0, limit);
}

export function findSkills(query, limit = 12) {
    const allSkills = getAllSkills();
    if (!query || !query.trim()) return [];

    const q = query.toLowerCase().trim();

    const matches = allSkills.filter(s => {
        if (s.skillName && s.skillName.toLowerCase().includes(q)) return true;
        if (s.aliases && s.aliases.some(a => a.toLowerCase().includes(q))) return true;
        return false;
    });

    matches.sort((a, b) => {
        const aName = (a.skillName || '').toLowerCase();
        const bName = (b.skillName || '').toLowerCase();

        const aStarts = aName.startsWith(q) || (a.aliases && a.aliases.some(al => al.toLowerCase().startsWith(q)));
        const bStarts = bName.startsWith(q) || (b.aliases && b.aliases.some(al => al.toLowerCase().startsWith(q)));

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aName.length - bName.length;
    });

    return matches.slice(0, limit).map(s => ({
        skillId: s.skillId,
        skillName: s.skillName,
        category: s.category
    }));
}

export function findInterests(query, limit = 10) {
    const allInterests = getAllInterests();
    if (!query || !query.trim()) return [];

    const q = query.toLowerCase().trim();

    const matches = allInterests.filter(i => {
        if (i.interestName && i.interestName.toLowerCase().includes(q)) return true;
        if (i.aliases && i.aliases.some(a => a.toLowerCase().includes(q))) return true;
        return false;
    });

    matches.sort((a, b) => {
        const aName = (a.interestName || '').toLowerCase();
        const bName = (b.interestName || '').toLowerCase();

        const aStarts = aName.startsWith(q) || (a.aliases && a.aliases.some(al => al.toLowerCase().startsWith(q)));
        const bStarts = bName.startsWith(q) || (b.aliases && b.aliases.some(al => al.toLowerCase().startsWith(q)));

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aName.length - bName.length;
    });

    return matches.slice(0, limit).map(i => ({
        interestId: i.interestId,
        interestName: i.interestName,
    }));
}
