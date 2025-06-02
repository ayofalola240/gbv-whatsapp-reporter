import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Utility to generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: 1 * 24 * 60 * 60 // 1day
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
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id.toString())
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
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

  const user = await User.findOne({ email }).select('+password'); // Explicitly select password

  if (user && (await user.matchPassword(password))) {
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
