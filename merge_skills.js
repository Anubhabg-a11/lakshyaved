import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const dataDir = path.join(__dirname, 'src', 'core', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dropFiles = [
        '_drop/DROP_SKILLS_1.txt',
        '_drop/DROP_SKILLS_2.txt',
        '_drop/DROP_SKILLS_3.txt'
    ];

    let batches = [];

    for (let i = 0; i < dropFiles.length; i++) {
        const file = dropFiles[i];
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File ${file} not found.`);
            process.exit(1);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        let parsed;
        try {
            parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) throw new Error('Not an array');
        } catch (e) {
            console.error(`Error: File ${file} failed to parse as valid JSON array.`);
            process.exit(1);
        }

        const outName = `skills.batch${i + 1}.json`;
        fs.writeFileSync(path.join(dataDir, outName), JSON.stringify(parsed, null, 2));
        batches.push(parsed);
    }

    // Merge
    let merged = [...batches[0], ...batches[1], ...batches[2]];

    // Normalize and Deduplicate
    const finalSkills = [];
    const seenIds = new Set();
    const seenNames = new Set();

    const validTypes = new Set(['language', 'framework', 'tool', 'concept', 'domain', 'soft-skill']);

    for (let item of merged) {
        if (!item || typeof item !== 'object') continue;

        let { skillId, skillName, type, aliases } = item;

        if (!skillId) skillId = `skill-${Math.random().toString(36).substr(2, 9)}`;
        if (!skillName) skillName = skillId;

        skillId = String(skillId);
        skillName = String(skillName);

        if (seenIds.has(skillId)) continue;
        if (seenNames.has(skillName.toLowerCase())) continue;

        seenIds.add(skillId);
        seenNames.add(skillName.toLowerCase());

        type = String(type);
        if (!validTypes.has(type)) {
            type = 'concept';
        }

        let normAliases = [];
        if (Array.isArray(aliases)) {
            normAliases = aliases.map(a => String(a).toLowerCase());
        }

        finalSkills.push({
            skillId,
            skillName,
            type,
            aliases: normAliases
        });
    }

    // Trim to 900
    if (finalSkills.length > 900) {
        finalSkills.length = 900;
    } else if (finalSkills.length < 900) {
        console.log(`Warning: Final count is ${finalSkills.length}, which is fewer than 900.`);
    }

    // Save
    fs.writeFileSync(path.join(dataDir, 'skills.v1.json'), JSON.stringify(finalSkills, null, 2));
}

main().catch(err => {
    console.error(err.message);
    process.exit(1);
});
