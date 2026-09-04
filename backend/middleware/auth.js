import jwt from 'jsonwebtoken';

// Patient Authenticate Middleware
export const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

// Doctor Authenticate Middleware
export const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body.doctorId = token_decode.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

// Admin Authenticate Middleware
export const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    
    // Check if the decoded token email matches the configured admin email
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Restricted admin access.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: error.message });
  }
};
