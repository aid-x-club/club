import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Send response with token
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Use user.id for Supabase (instead of user._id for Mongoose)
  const token = generateToken(user.id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Return public user data (exclude password_hash)
  const { password_hash, ...publicUser } = user;

  res.status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: publicUser
    });
};

// Validate student ID format
export const isValidStudentId = (studentId) => {
  // Example: ABC123 or ABC-2024-001
  // Adjust regex based on your institution's format
  return /^[A-Z0-9]{3,20}$/.test(studentId.toUpperCase());
};
