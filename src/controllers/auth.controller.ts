import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/user.model'; // Ensure this path is correct
import jwt from 'jsonwebtoken';
import { config } from '../config'; // Ensure this path is correct
import { logger } from '../utils/logger'; // Assuming you have this for consistent logging

// Utility to generate JWT
const generateToken = (id: string): string => {
  if (!config.jwtSecret) {
    logger.error('JWT_SECRET is not defined. Cannot generate token.');
    throw new Error('Server configuration error for token generation.');
  }
  return jwt.sign({ id }, config.jwtSecret, {
    // expiresIn: config.jwtExpiresIn, // Using your numeric value
    expiresIn: 1 * 24 * 60 * 60 // 1 day in seconds
  });
};

/**
 * @desc    Register a new admin user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, email, phone, password } = req.body;

  if (!firstname || !lastname || !email || !phone || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email or phone number');
  }

  const user: IUser = await User.create({
    firstname,
    lastname,
    email,
    phone,
    password // Password will be hashed by the pre-save hook in user.model.ts
  });

  if (user) {
    logger.info(`User registered successfully: ${user.email}`);
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id.toString())
    });
  } else {
    // This case is less likely if User.create doesn't throw an error itself
    res.status(400);
    throw new Error('Invalid user data during creation');
  }
});

/**
 * @desc    Authenticate admin user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  logger.info(`Login attempt for email: ${email}`);
  const user = await User.findOne({ email }).select('+password'); // Explicitly select password

  if (!user) {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }

  // Log to see if the password field was actually retrieved
  // Be careful with logging sensitive data, even hashes, in production. This is for debugging.
  // logger.debug(`User found: ${user.email}, has password field: ${!!user.password}`);

  let passwordMatches = false;
  try {
    // Ensure user.password is a string (the hash) before comparing
    if (typeof user.password !== 'string' || user.password.length === 0) {
      logger.error(`Login failed: Password hash not found or invalid for user ${email}`);
      throw new Error('Authentication error: Stored password invalid.');
    }
    passwordMatches = await user.matchPassword(password);
  } catch (matchError: any) {
    logger.error(`Error during password comparison for ${email}: ${matchError.message}`);
    // This will be caught by asyncHandler and result in a 500 if not handled more specifically
    throw new Error('Authentication processing error.');
  }

  if (passwordMatches) {
    logger.info(`Login successful for user: ${user.email}`);
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id.toString())
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});
