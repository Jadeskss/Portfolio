const fs = require('fs');
const path = require('path');

// Helper function to read JSON files
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write JSON files
const writeJsonFile = (filename, data) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    switch (type) {
      case 'project':
        return handleProjectUpload(data, res);
      case 'certificate':
        return handleCertificateUpload(data, res);
      case 'skill':
        return handleSkillUpload(data, res);
      case 'education':
        return handleEducationUpload(data, res);
      default:
        return res.status(400).json({ error: 'Invalid upload type' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

function handleProjectUpload(data, res) {
  const { title, description, category, link, github, technologies, image } = data;
  
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const projectsData = readJsonFile('projects.json');
  const newId = projectsData.projects.length > 0 
    ? Math.max(...projectsData.projects.map(p => p.id)) + 1 
    : 1;

  const newProject = {
    id: newId,
    title,
    description,
    category,
    image: image || 'assets/images/projects/default.png',
    link: link || '#',
    github: github || '',
    technologies: technologies || []
  };

  projectsData.projects.push(newProject);
  writeJsonFile('projects.json', projectsData);

  res.json({ 
    success: true, 
    message: 'Project added successfully!',
    project: newProject
  });
}

function handleCertificateUpload(data, res) {
  const { title, issuer, date, tags, link, description } = data;
  
  if (!title || !issuer || !date || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const certsData = readJsonFile('certificates.json');
  const newId = certsData.certificates.length > 0 
    ? Math.max(...certsData.certificates.map(c => c.id)) + 1 
    : 1;

  const newCertificate = {
    id: newId,
    title,
    issuer,
    date,
    tags: tags || [],
    link: link || '#',
    description
  };

  certsData.certificates.push(newCertificate);
  writeJsonFile('certificates.json', certsData);

  res.json({ 
    success: true, 
    message: 'Certificate added successfully!',
    certificate: newCertificate
  });
}

function handleSkillUpload(data, res) {
  const { name, category, icon, iconType } = data;
  
  if (!name || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const skillsData = readJsonFile('skills.json');
  const newId = skillsData.skills.length > 0 
    ? Math.max(...skillsData.skills.map(s => s.id)) + 1 
    : 1;

  const newSkill = {
    id: newId,
    name,
    category,
    icon: icon || '',
    iconType: iconType || 'fontawesome'
  };

  skillsData.skills.push(newSkill);
  writeJsonFile('skills.json', skillsData);

  res.json({ 
    success: true, 
    message: 'Skill added successfully!',
    skill: newSkill
  });
}

function handleEducationUpload(data, res) {
  const { institution, degree, startDate, endDate, description } = data;
  
  if (!institution || !degree || !startDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const eduData = readJsonFile('education.json');
  const newId = eduData.education && eduData.education.length > 0 
    ? Math.max(...eduData.education.map(e => e.id)) + 1 
    : 1;

  const newEducation = {
    id: newId,
    institution,
    degree,
    startDate,
    endDate: endDate || 'Present',
    description: description || ''
  };

  if (!eduData.education) {
    eduData.education = [];
  }

  eduData.education.push(newEducation);
  writeJsonFile('education.json', eduData);

  res.json({ 
    success: true, 
    message: 'Education entry added successfully!',
    education: newEducation
  });
}
