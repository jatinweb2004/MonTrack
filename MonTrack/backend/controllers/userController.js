const userModel = require('../models/userModel')








app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token for the user
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});









//Login callback
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email, password })
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        })
    }
}

//Register callabck
const registerController = async (req, res) => {
    try {
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).json({
            success: true,
            newUser,
        })
    } catch (error) {
        console.error("Error in registerController:", error);
        res.status(400).json({
            success: false,
            error: error.message, // You can also send the error message back to the client
        });
    }
    
}

module.exports = { loginController, registerController }
