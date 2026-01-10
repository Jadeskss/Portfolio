module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // Get credentials from environment variables
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        return res.status(500).json({ 
          success: false, 
          error: 'Server configuration error. Please set environment variables.' 
        });
      }

      if (username === adminUsername && password === adminPassword) {
        // Generate a simple token (timestamp + random)
        const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
        
        res.status(200).json({ 
          success: true, 
          token: token,
          message: 'Login successful'
        });
      } else {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid username or password' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'An error occurred during login' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
