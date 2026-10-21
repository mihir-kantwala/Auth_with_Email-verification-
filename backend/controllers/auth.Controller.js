import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All the fields are required',
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const emailExist = await User.findOne({ email: normalizedEmail });

    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: 'Email is alredy taken',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Raw token goes in the email; only its hash goes in MongoDB.
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      verificationToken: tokenHash,
      verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    try {
      await sendVerificationEmail(user.email, token);
    } catch (emailError) {
      // Keep the pending account so a resend endpoint can recover it.
      console.error('Verification email delivery failed:', emailError);

      return res.status(503).json({
        message:
          'Account created, but email delivery failed. Please request a new verification email.',
      });
    }

    return res.status(201).json({
      message:
        'Registration successful. Check your email to verify your account.',
    });
  } catch (error) {
    // Handles concurrent registrations against the unique email index.
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    console.error('Registration failed:', error);
    return res.status(500).json({
      message: 'Unable to register right now.',
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        message: 'Invalid or expired verification link.',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOneAndUpdate(
      {
        verificationToken: tokenHash,
        verificationTokenExpires: { $gt: new Date() },
        isVerified: false,
      },
      {
        $set: { isVerified: true },
        $unset: {
          verificationToken: 1,
          verificationTokenExpires: 1,
        },
      },
      { new: true },
    );

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification link.',
      });
    }

    return res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Email verification failed:', error);
    return res.status(500).json({
      message: 'Unable to verify your email right now.',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All the fields are required',
      });
    }

    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'server error',
    });
  }
};
