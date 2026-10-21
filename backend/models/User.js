import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // verificationToken: stores the SHA-256 hash of the emailed token, not the raw token.
    verificationToken: {
      type: String,
      default: null,
    },

    // verificationTokenExpires: prevents old links from being used indefinitely.
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collation: 'User-Email',
  },
);

const User = mongoose.model('User', userSchema);

export default User;
