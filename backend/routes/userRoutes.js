import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  verifyStripe,
  paymentRazorpay,
  verifyRazorpay,
  addReview,
  listDoctors
} from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/all-doctors', listDoctors);

// Authenticated Routes
userRouter.get('/get-profile', authUser, getUserProfile);
userRouter.post('/update-profile', authUser, upload.single('image'), updateUserProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verify-stripe', authUser, verifyStripe);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);
userRouter.post('/add-review', authUser, addReview);

export default userRouter;
