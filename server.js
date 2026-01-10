require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'assets', 'images', 'projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Helper function to read JSON files
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// API Routes
app.get('/api/skills', (req, res) => {
  try {
    const data = readJsonFile('skills.json');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    console.error('Error loading skills:', error);
    res.status(500).json({ error: 'Failed to load skills data' });
  }
});

app.get('/api/projects', (req, res) => {
  try {
    const data = readJsonFile('projects.json');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).json({ error: 'Failed to load projects data' });
  }
});

app.get('/api/certificates', (req, res) => {
  try {
    const data = readJsonFile('certificates.json');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    console.error('Error loading certificates:', error);
    res.status(500).json({ error: 'Failed to load certificates data' });
  }
});

app.get('/api/education', (req, res) => {
  try {
    const data = readJsonFile('education.json');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    console.error('Error loading education:', error);
    res.status(500).json({ error: 'Failed to load education data' });
  }
});

// Get all blogs
app.get('/api/blogs', (req, res) => {
  try {
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    
    // Sort by date (newest first)
    const sortedBlogs = blogsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(sortedBlogs);
  } catch (error) {
    console.error('Error loading blogs:', error);
    res.status(500).json({ error: 'Failed to load blogs data' });
  }
});

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        token: Buffer.from(`${username}:${password}`).toString('base64')
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }
    
    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Upload endpoints
// Helper function to write JSON files
const writeJsonFile = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Upload Project
app.post('/api/upload/project', upload.single('image'), (req, res) => {
  try {
    const { title, description, category, link, github, technologies } = req.body;
    
    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, description, and category are required' 
      });
    }

    // Read existing projects
    const projectsData = readJsonFile('projects.json');
    
    // Generate new ID
    const newId = projectsData.projects.length > 0 
      ? Math.max(...projectsData.projects.map(p => p.id)) + 1 
      : 1;

    // Prepare image path
    let imagePath = 'assets/images/projects/default.png';
    if (req.file) {
      imagePath = `assets/images/projects/${req.file.filename}`;
    }

    // Create new project object
    const newProject = {
      id: newId,
      title,
      description,
      category,
      image: imagePath,
      link: link || '#',
      github: github || '',
      technologies: technologies ? JSON.parse(technologies) : []
    };

    // Add to projects array
    projectsData.projects.push(newProject);

    // Write back to file
    writeJsonFile('projects.json', projectsData);

    res.json({ 
      success: true, 
      message: 'Project added successfully!',
      project: newProject
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add project' 
    });
  }
});

// Upload Certificate
app.post('/api/upload/certificate', (req, res) => {
  try {
    const { title, issuer, date, tags, link, description } = req.body;
    
    // Validate required fields
    if (!title || !issuer || !date || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, issuer, date, and description are required' 
      });
    }

    // Read existing certificates
    const certsData = readJsonFile('certificates.json');
    
    // Generate new ID
    const newId = certsData.certificates.length > 0 
      ? Math.max(...certsData.certificates.map(c => c.id)) + 1 
      : 1;

    // Create new certificate object
    const newCertificate = {
      id: newId,
      title,
      issuer,
      date,
      tags: tags || [],
      link: link || '#',
      description
    };

    // Add to certificates array
    certsData.certificates.push(newCertificate);

    // Write back to file
    writeJsonFile('certificates.json', certsData);

    res.json({ 
      success: true, 
      message: 'Certificate added successfully!',
      certificate: newCertificate
    });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add certificate' 
    });
  }
});

// Upload Blog
app.post('/api/upload/blog', (req, res) => {
  try {
    const { title, excerpt, category, readTime, tags, content } = req.body;
    
    // Validate required fields
    if (!title || !excerpt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and excerpt are required' 
      });
    }

    // Read existing blogs
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    let blogsData = [];
    
    if (fs.existsSync(blogsPath)) {
      blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    }

    // Create new blog object
    const newBlog = {
      id: Date.now().toString(),
      title,
      excerpt,
      date: new Date().toISOString().split('T')[0],
      category: category || 'General',
      readTime: readTime || '5 min read',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      content: content || ''
    };

    // Add to blogs array
    blogsData.push(newBlog);

    // Write back to file
    fs.writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));

    res.json({ 
      success: true, 
      message: 'Blog added successfully!',
      blog: newBlog
    });
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add blog' 
    });
  }
});

// Upload Skill
app.post('/api/upload/skill', (req, res) => {
  try {
    const { name, category, icon, iconType } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and category are required' 
      });
    }

    // Read existing skills
    const skillsData = readJsonFile('skills.json');
    
    // Generate new ID
    const newId = skillsData.skills.length > 0 
      ? Math.max(...skillsData.skills.map(s => s.id)) + 1 
      : 1;

    // Create new skill object
    const newSkill = {
      id: newId,
      name,
      category,
      icon: icon || '',
      iconType: iconType || 'fontawesome'
    };

    // Add to skills array
    skillsData.skills.push(newSkill);

    // Write back to file
    writeJsonFile('skills.json', skillsData);

    res.json({ 
      success: true, 
      message: 'Skill added successfully!',
      skill: newSkill
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add skill' 
    });
  }
});

// Upload Education
app.post('/api/upload/education', (req, res) => {
  try {
    const { institution, degree, startDate, endDate, description } = req.body;
    
    // Validate required fields
    if (!institution || !degree || !startDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Institution, degree, and start date are required' 
      });
    }

    // Read existing education
    const eduData = readJsonFile('education.json');
    
    // Generate new ID
    const newId = eduData.education && eduData.education.length > 0 
      ? Math.max(...eduData.education.map(e => e.id)) + 1 
      : 1;

    // Create new education object
    const newEducation = {
      id: newId,
      institution,
      degree,
      startDate,
      endDate: endDate || 'Present',
      description: description || ''
    };

    // Initialize education array if it doesn't exist
    if (!eduData.education) {
      eduData.education = [];
    }

    // Add to education array
    eduData.education.push(newEducation);

    // Write back to file
    writeJsonFile('education.json', eduData);

    res.json({ 
      success: true, 
      message: 'Education entry added successfully!',
      education: newEducation
    });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add education entry' 
    });
  }
});

// CRUD Endpoints for Projects
app.put('/api/projects/:id', upload.single('image'), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, category, link, github, technologies } = req.body;
    
    const projectsData = readJsonFile('projects.json');
    const projectIndex = projectsData.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Update project
    const updatedProject = {
      ...projectsData.projects[projectIndex],
      title: title || projectsData.projects[projectIndex].title,
      description: description || projectsData.projects[projectIndex].description,
      category: category || projectsData.projects[projectIndex].category,
      link: link !== undefined ? link : projectsData.projects[projectIndex].link,
      github: github !== undefined ? github : projectsData.projects[projectIndex].github,
      technologies: technologies ? JSON.parse(technologies) : projectsData.projects[projectIndex].technologies
    };
    
    if (req.file) {
      updatedProject.image = `assets/images/projects/${req.file.filename}`;
    }
    
    projectsData.projects[projectIndex] = updatedProject;
    writeJsonFile('projects.json', projectsData);
    
    res.json({ success: true, message: 'Project updated successfully!', project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projectsData = readJsonFile('projects.json');
    const projectIndex = projectsData.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    projectsData.projects.splice(projectIndex, 1);
    writeJsonFile('projects.json', projectsData);
    
    res.json({ success: true, message: 'Project deleted successfully!' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

// CRUD Endpoints for Certificates
app.put('/api/certificates/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, issuer, date, tags, link, description } = req.body;
    
    const certsData = readJsonFile('certificates.json');
    const certIndex = certsData.certificates.findIndex(c => c.id === id);
    
    if (certIndex === -1) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    
    const updatedCert = {
      ...certsData.certificates[certIndex],
      title: title || certsData.certificates[certIndex].title,
      issuer: issuer || certsData.certificates[certIndex].issuer,
      date: date || certsData.certificates[certIndex].date,
      tags: tags || certsData.certificates[certIndex].tags,
      link: link !== undefined ? link : certsData.certificates[certIndex].link,
      description: description || certsData.certificates[certIndex].description
    };
    
    certsData.certificates[certIndex] = updatedCert;
    writeJsonFile('certificates.json', certsData);
    
    res.json({ success: true, message: 'Certificate updated successfully!', certificate: updatedCert });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to update certificate' });
  }
});

app.delete('/api/certificates/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const certsData = readJsonFile('certificates.json');
    const certIndex = certsData.certificates.findIndex(c => c.id === id);
    
    if (certIndex === -1) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    
    certsData.certificates.splice(certIndex, 1);
    writeJsonFile('certificates.json', certsData);
    
    res.json({ success: true, message: 'Certificate deleted successfully!' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to delete certificate' });
  }
});

// CRUD Endpoints for Skills
app.put('/api/skills/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, icon, iconType } = req.body;
    
    const skillsData = readJsonFile('skills.json');
    const skillIndex = skillsData.skills.findIndex(s => s.id === id);
    
    if (skillIndex === -1) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    
    const updatedSkill = {
      ...skillsData.skills[skillIndex],
      name: name || skillsData.skills[skillIndex].name,
      category: category || skillsData.skills[skillIndex].category,
      icon: icon !== undefined ? icon : skillsData.skills[skillIndex].icon,
      iconType: iconType || skillsData.skills[skillIndex].iconType
    };
    
    skillsData.skills[skillIndex] = updatedSkill;
    writeJsonFile('skills.json', skillsData);
    
    res.json({ success: true, message: 'Skill updated successfully!', skill: updatedSkill });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ success: false, error: 'Failed to update skill' });
  }
});

app.delete('/api/skills/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const skillsData = readJsonFile('skills.json');
    const skillIndex = skillsData.skills.findIndex(s => s.id === id);
    
    if (skillIndex === -1) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    
    skillsData.skills.splice(skillIndex, 1);
    writeJsonFile('skills.json', skillsData);
    
    res.json({ success: true, message: 'Skill deleted successfully!' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ success: false, error: 'Failed to delete skill' });
  }
});

// CRUD Endpoints for Education
app.put('/api/education/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { institution, degree, startDate, endDate, description } = req.body;
    
    const eduData = readJsonFile('education.json');
    const eduIndex = eduData.education.findIndex(e => e.id === id);
    
    if (eduIndex === -1) {
      return res.status(404).json({ success: false, error: 'Education not found' });
    }
    
    const updatedEdu = {
      ...eduData.education[eduIndex],
      institution: institution || eduData.education[eduIndex].institution,
      degree: degree || eduData.education[eduIndex].degree,
      startDate: startDate || eduData.education[eduIndex].startDate,
      endDate: endDate !== undefined ? endDate : eduData.education[eduIndex].endDate,
      description: description !== undefined ? description : eduData.education[eduIndex].description
    };
    
    eduData.education[eduIndex] = updatedEdu;
    writeJsonFile('education.json', eduData);
    
    res.json({ success: true, message: 'Education updated successfully!', education: updatedEdu });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ success: false, error: 'Failed to update education' });
  }
});

app.delete('/api/education/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eduData = readJsonFile('education.json');
    const eduIndex = eduData.education.findIndex(e => e.id === id);
    
    if (eduIndex === -1) {
      return res.status(404).json({ success: false, error: 'Education not found' });
    }
    
    eduData.education.splice(eduIndex, 1);
    writeJsonFile('education.json', eduData);
    
    res.json({ success: true, message: 'Education deleted successfully!' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ success: false, error: 'Failed to delete education' });
  }
});

// CRUD Endpoints for Blogs
app.put('/api/blogs/:id', (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, excerpt, category, readTime, tags, content } = req.body;
    
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    let blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    
    const blogIndex = blogsData.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    blogsData[blogIndex] = {
      ...blogsData[blogIndex],
      title: title || blogsData[blogIndex].title,
      excerpt: excerpt || blogsData[blogIndex].excerpt,
      category: category || blogsData[blogIndex].category,
      readTime: readTime || blogsData[blogIndex].readTime,
      tags: tags || blogsData[blogIndex].tags,
      content: content || blogsData[blogIndex].content
    };
    
    fs.writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Blog updated successfully!',
      blog: blogsData[blogIndex]
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, error: 'Failed to update blog' });
  }
});

app.delete('/api/blogs/:id', (req, res) => {
  try {
    const blogId = req.params.id;
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    let blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    
    const blogIndex = blogsData.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    blogsData.splice(blogIndex, 1);
    fs.writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));
    
    res.json({ success: true, message: 'Blog deleted successfully!' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Clean URL routes for pages
app.get('/pages/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'admin-login.html'));
});

app.get('/pages/ups', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'ups.html'));
});

app.get('/pages/projects', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'projects.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

app.get('/pages/blogs', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'blogs.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Redirect .html URLs to clean URLs
app.get('/pages/admin-login.html', (req, res) => {
  res.redirect(301, '/pages/admin-login');
});

app.get('/pages/ups.html', (req, res) => {
  res.redirect(301, '/pages/ups');
});

app.get('/pages/projects.html', (req, res) => {
  res.redirect(301, '/pages/projects');
});

app.get('/pages/blogs.html', (req, res) => {
  res.redirect(301, '/pages/blogs');
});

app.get('*.html', (req, res) => {
  const cleanUrl = req.path.replace('.html', '');
  res.redirect(301, cleanUrl);
});

// Catch-all route for other pages
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  // Try exact file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } 
  // Try with .html extension
  else if (fs.existsSync(filePath + '.html')) {
    res.sendFile(filePath + '.html');
  } 
  // 404
  else {
    const notFoundPath = path.join(__dirname, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.status(404).sendFile(notFoundPath);
    } else {
      res.status(404).send('Page not found');
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;
