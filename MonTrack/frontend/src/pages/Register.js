import React, { useEffect, useState } from 'react'
import { Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner'







const User = mongoose.model('User', userSchema);

const JWT_SECRET = 'your_jwt_secret_key'; 

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    // Return the JWT token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});











const Register = () => {
    const navigate = useNavigate()
    const [laoding, setLaoding] = useState(false)
    //Form Submit
    const submitHandler = async (values) => {
        try {
            setLaoding(true)
            await axios.post('/users/register', values)
            message.success('Registration Successful')
            setLaoding(false)
            navigate('/login')
        } catch (error) {
            setLaoding(false)
            message.error("Invalid Something Went Wrong");
        }
    };


    //Prevent for login user
    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/')
        }
    }, [navigate]);


    return (
        <div className='register'>  
            <div className='register-loading'>
                {laoding && <Spinner />}
            </div>
            <div className='Main-regi'>
                <div className='register-page'>
                    <Form layout='vertical' onFinish={submitHandler}>
                        <h1>Registration Form</h1>
                        <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input type="email" />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input type="password" />
                        </Form.Item>
                        <div className='d-flex justify-content-between'>
                            <Link to="/login">Already Registered?<br></br> Click Here To Login!</Link>
                            <button className='btn btn-primary'>Register</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register
