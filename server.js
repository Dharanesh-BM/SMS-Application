const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DBConnection', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define User schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadharNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }
});

// Create a model based on the schema
const UserModel = mongoose.model('users', UserSchema);


// POST request for user registration
// Modify the registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, aadharNumber, phoneNumber } = req.body;
        
        // Validate Aadhar number
        if (!/^\d{12}$/.test(aadharNumber)) {
            return res.status(400).json({ error: 'Invalid Aadhar number' });
        }
        
        // Validate phone number
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        const newUser = new UserModel({
            name,
            email,
            password,
            aadharNumber,
            phoneNumber
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST request for login
app.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await UserModel.findOne({ phoneNumber });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user: { name: user.name, phoneNumber: user.phoneNumber } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadharNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }
  });
  
  const contactSchema = new mongoose.Schema({
    from: String, // The user who is adding the contact
    to: String,   // The contact being added
  });
  
  const User = mongoose.model('User', userSchema);
  const Contact = mongoose.model('Contact', contactSchema);
  
  // Check if user exists in database
  app.post('/checkUser', async (req, res) => {
    const { email, fromEmail } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (user) {
        // Create a new contact in the database
        const newContact = new Contact({ from: fromEmail, to: email });
        await newContact.save();
  
        res.json({ message: 'User exists', user });
      } else {
        res.json({ message: 'No user found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Start the server
app.listen(1846, () => {
    console.log("Server is running on http://localhost:1846/");
});
