import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'src', 'core', 'data');
const skillsFile = path.join(dataDir, 'skills.v1.json');
const rolesFile = path.join(dataDir, 'roles.v1.json');

async function main() {
    if (!fs.existsSync(skillsFile)) {
        console.error("Skills file not found:", skillsFile);
        process.exit(1);
    }

    const skillsData = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    const allSkills = skillsData.map(s => s.skillName);

    if (allSkills.length === 0) {
        console.error("No skills found in skills.v1.json");
        process.exit(1);
    }

    const getRandomSkills = (count, exclude = new Set()) => {
        const selected = new Set();
        while (selected.size < count) {
            const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
            if (!exclude.has(skill)) {
                selected.add(skill);
            }
        }
        return Array.from(selected);
    };

    const prefixes = ['', 'Junior ', 'Senior ', 'Lead ', 'Principal ', 'Chief ', 'Staff '];
    const bases = [
        { name: 'Software Engineer', category: 'Engineering' },
        { name: 'Frontend Developer', category: 'Engineering' },
        { name: 'Backend Developer', category: 'Engineering' },
        { name: 'Full Stack Developer', category: 'Engineering' },
        { name: 'Data Scientist', category: 'Data' },
        { name: 'Data Analyst', category: 'Data' },
        { name: 'Data Engineer', category: 'Data' },
        { name: 'Machine Learning Engineer', category: 'AI/ML' },
        { name: 'DevOps Engineer', category: 'Operations' },
        { name: 'Cloud Architect', category: 'Cloud' },
        { name: 'Security Analyst', category: 'Security' },
        { name: 'Product Manager', category: 'Management' },
        { name: 'Project Manager', category: 'Management' },
        { name: 'UI/UX Designer', category: 'Design' },
        { name: 'Quality Assurance Engineer', category: 'QA' },
        { name: 'Systems Administrator', category: 'IT' },
        { name: 'Network Engineer', category: 'IT' },
        { name: 'Database Administrator', category: 'Data' },
        { name: 'Business Analyst', category: 'Business' },
        { name: 'Technical Writer', category: 'Documentation' },
        { name: 'Scrum Master', category: 'Management' },
        { name: 'Salesforce Developer', category: 'Engineering' },
        { name: 'Blockchain Developer', category: 'Engineering' },
        { name: 'Game Developer', category: 'Engineering' },
        { name: 'Mobile App Developer', category: 'Engineering' },
        { name: 'Android Developer', category: 'Engineering' },
        { name: 'iOS Developer', category: 'Engineering' },
        { name: 'Embedded Systems Engineer', category: 'Hardware' },
        { name: 'Hardware Engineer', category: 'Hardware' },
        { name: 'Firmware Engineer', category: 'Hardware' },
        { name: 'IT Support Specialist', category: 'IT' },
        { name: 'Help Desk Technician', category: 'IT' },
        { name: 'Cybersecurity Engineer', category: 'Security' },
        { name: 'Penetration Tester', category: 'Security' },
        { name: 'Cloud Engineer', category: 'Cloud' },
        { name: 'Site Reliability Engineer', category: 'Operations' },
        { name: 'Release Manager', category: 'Operations' },
        { name: 'Engineering Manager', category: 'Management' },
        { name: 'Director of Engineering', category: 'Management' },
        { name: 'VP of Engineering', category: 'Management' },
        { name: 'Chief Technology Officer', category: 'Executive' },
        { name: 'Data Architect', category: 'Data' },
        { name: 'AI Researcher', category: 'AI/ML' },
        { name: 'Computer Vision Engineer', category: 'AI/ML' },
        { name: 'NLP Engineer', category: 'AI/ML' },
        { name: 'Quantitative Analyst', category: 'Finance' },
        { name: 'Operations Research Analyst', category: 'Operations' },
        { name: 'Actuary', category: 'Finance' },
        { name: 'Economist', category: 'Business' },
        { name: 'Financial Analyst', category: 'Finance' },
        { name: 'Marketing Analyst', category: 'Marketing' },
        { name: 'Sales Engineer', category: 'Sales' },
        { name: 'Solutions Architect', category: 'Sales' },
        { name: 'Customer Success Manager', category: 'Support' },
        { name: 'Tech Lead', category: 'Engineering' },
        { name: 'Platform Engineer', category: 'Engineering' },
        { name: 'Infrastructure Engineer', category: 'IT' },
        { name: 'Automation Engineer', category: 'QA' },
        { name: 'Test Automation Engineer', category: 'QA' },
        { name: 'SDET', category: 'QA' }
    ];

    const roles = [];
    let count = 0;

    for (let p of prefixes) {
        for (let b of bases) {
            if (count >= 400) break;

            const roleName = p + b.name;
            const roleId = roleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

            const reqCount = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
            const requiredSkills = getRandomSkills(reqCount);

            const reqSet = new Set(requiredSkills);
            const nthCount = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
            const niceToHaveSkills = getRandomSkills(nthCount, reqSet);

            const baseSalaryINR = Math.floor(Math.random() * (4000000 - 250000 + 1)) + 250000;
            const growthRate = parseFloat((Math.random() * (0.25 - 0.06) + 0.06).toFixed(2));

            const aliases = [roleName.toLowerCase(), b.name.toLowerCase()];
            const tags = [b.category.toLowerCase(), 'tech'];

            roles.push({
                roleId,
                roleName,
                category: b.category,
                requiredSkills,
                niceToHaveSkills,
                baseSalaryINR,
                growthRate,
                aliases,
                tags
            });

            count++;
        }
        if (count >= 400) break;
    }

    fs.writeFileSync(rolesFile, JSON.stringify(roles, null, 2));
    console.log(`Successfully generated ${roles.length} roles.`);
}

main().catch(console.error);
