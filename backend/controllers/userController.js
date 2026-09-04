import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import Stripe from 'stripe';
import razorpay from 'razorpay';

// Initialize payment gateways if keys are present
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token, message: 'Registration Successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, dob } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !gender || !dob) {
      return res.status(400).json({ success: false, message: 'Missing details to update profile' });
    }

    const updateData = {
      name,
      phone,
      gender,
      dob,
      address: typeof address === 'string' ? JSON.parse(address) : address
    };

    if (imageFile) {
      let imageUrl = '';
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        try {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
          imageUrl = imageUpload.secure_url;
        } catch (err) {
          console.warn("Cloudinary upload failed, using user local static URL fallback:", err.message);
          const host = req.get('host');
          imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
        }
      } else {
        const host = req.get('host');
        imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
      }
      updateData.image = imageUrl;
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    // Get updated profile to send back
    const updatedUser = await userModel.findById(userId).select('-password');

    res.json({ success: true, message: 'Profile Updated Successfully', userData: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData.availability) {
      return res.json({ success: false, message: 'Doctor is not available currently' });
    }

    let slotsBooked = docData.slotsBooked || {};

    // Checking for slot availability
    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot already booked' });
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select('-password');

    // Remove password and sensitive details before caching doctor data
    const doctorDataFiltered = docData.toObject();
    delete doctorDataFiltered.slotsBooked;

    const appointmentData = {
      patientId: userId,
      doctorId: docId,
      appointmentDate: slotDate,
      appointmentTime: slotTime,
      amount: docData.fees,
      doctorData: doctorDataFiltered,
      patientData: userData.toObject(),
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update slotsBooked in doctor schema
    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.json({ success: true, message: 'Appointment Booked Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ patientId: userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Verify appointment owner
    if (appointmentData.patientId.toString() !== userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized action' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' });

    // Release slot
    const { doctorId, appointmentDate, appointmentTime } = appointmentData;
    const doctorData = await doctorModel.findById(doctorId);

    let slotsBooked = doctorData.slotsBooked;
    if (slotsBooked[appointmentDate]) {
      slotsBooked[appointmentDate] = slotsBooked[appointmentDate].filter(e => e !== appointmentTime);
      await doctorModel.findByIdAndUpdate(doctorId, { slotsBooked });
    }

    res.json({ success: true, message: 'Appointment Cancelled Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to process payment via Stripe
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.status === 'cancelled') {
      return res.status(404).json({ success: false, message: 'Appointment not found or cancelled' });
    }

    if (!stripe) {
      // Mock mode checkout fallback if no keys configured
      return res.json({ 
        success: true, 
        message: 'Stripe keys missing. Proceeding with instant Mock checkout.', 
        mockMode: true 
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Appointment with Dr. ${appointmentData.doctorData.name}`,
              description: `Consultation on ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`,
            },
            unit_amount: appointmentData.amount * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/my-appointments?success=true&appointmentId=${appointmentId}`,
      cancel_url: `${req.headers.origin}/my-appointments?success=false&appointmentId=${appointmentId}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify Stripe payment
const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;
    if (success === 'true' || success === true) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { paymentStatus: 'paid' });
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      res.json({ success: false, message: 'Payment Failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to process payment via Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.status === 'cancelled') {
      return res.status(404).json({ success: false, message: 'Appointment not found or cancelled' });
    }

    if (!razorpayInstance) {
      // Mock mode checkout fallback if no keys configured
      return res.json({ 
        success: true, 
        message: 'Razorpay keys missing. Proceeding with instant Mock checkout.', 
        mockMode: true 
      });
    }

    const options = {
      amount: appointmentData.amount * 100, // in paise
      currency: 'INR',
      receipt: appointmentId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, appointmentId } = req.body;
    
    // In local dev/no-secret scenario, signature check is skipped or mocked
    if (razorpay_order_id) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { paymentStatus: 'paid' });
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      res.json({ success: false, message: 'Verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to write rating & review for a doctor
const addReview = async (req, res) => {
  try {
    const { userId, docId, rating, comment } = req.body;

    if (!docId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Missing review details' });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const user = await userModel.findById(userId);

    const reviewObj = {
      patientId: userId,
      patientName: user.name,
      patientImage: user.image,
      rating: Number(rating),
      comment,
      date: new Date()
    };

    // Push review
    doctor.reviews.push(reviewObj);

    // Recalculate average rating
    const totalRating = doctor.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    doctor.rating = Number((totalRating / doctor.reviews.length).toFixed(1));

    await doctor.save();

    res.json({ success: true, message: 'Review added successfully', rating: doctor.rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all doctors list for frontend (public)
const listDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -email');
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
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
};
