import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/config.js';

// Helper to sign JWT token
const signToken = (id, fname) => {
  return jwt.sign({ id, fname }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { fName, lName, email, password, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already in use' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    // Create token
    const token = signToken(newUser._id, newUser.fName);

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    console.error("Error in Registering User: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id, user.fName);
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: {
        user
      }
    });
  } catch (error) {
    console.error("Error in logging in User: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
