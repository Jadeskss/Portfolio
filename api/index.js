const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Helper function to read JSON files
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// API Routes
app.get('/api/skills', (req, res) => {
  try {
    const data = readJsonFile('skills.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load skills data' });
  }
});

app.get('/api/projects', (req, res) => {
  try {
    const data = readJsonFile('projects.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects data' });
  }
});

app.get('/api/certificates', (req, res) => {
  try {
    const data = readJsonFile('certificates.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load certificates data' });
  }
});

app.get('/api/education', (req, res) => {
  try {
    const data = readJsonFile('education.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load education data' });
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
    
    // Here you can add email sending logic (nodemailer, sendgrid, etc.)
    console.log('Contact form submission:', { name, email, message });
    
    res.json({ 
      success: true, 
      message: 'Message received! Will get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
