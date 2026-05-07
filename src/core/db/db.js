import Dexie from 'dexie';

const db = new Dexie('lakshyaved_db');

db.version(1).stores({
    profile: 'id', // id (string), skills (string[]), interests (string[]), targetRole (string), updatedAt (number)
    resume: 'id', // id (string), rawText (string), updatedAt (number)
    careerResults: 'id', // id (string), projection (array), updatedAt (number)
    skillGapResults: 'id' // id (string), targetRole (string), matchedSkills (string[]), missingSkills (string[]), roadmap (array), updatedAt (number)
});

db.version(2).stores({
    appState: 'id', // id (string), demoMode (boolean), updatedAt (number)
});

db.version(3).stores({
    roadmapPlans: 'id, targetRole, durationWeeks, createdAt, updatedAt', // id (string: role-duration)
    roadmapProgress: 'id, planId, updatedAt' // id (string: planId)
});

db.version(4).stores({
    profile: 'id', // extended: name (string), currentRole (string), education (string), skillsWithLevels (array of {name, level})
    appState: 'id' // extended: onboarded (boolean)
});

export default db;
