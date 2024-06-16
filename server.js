const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Multer storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.single('photo'), (req, res) => {
  res.send('File uploaded successfully');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Update Server Authentication
const auth = require('basic-auth');

const admin = { name: 'admin', pass: 'password' };

const authenticate = (req, res, next) => {
  const user = auth(req);
  if (user && user.name === admin.name && user.pass === admin.pass) {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Access denied');
  }
};

app.get('/admin', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
