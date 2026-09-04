import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import appointmentModel from '../models/appointmentModel.js';

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to add doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, degree, experience, fees, about } = req.body;
    const imageFile = req.file;

    // Checking for all required fields
    if (!name || !email || !password || !specialty || !degree || !experience || (fees === undefined || fees === null || fees === '') || !about || !imageFile) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    // Validating email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    // Validating password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Check if doctor email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary or use local static server URL
    let imageUrl = '';
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        imageUrl = imageUpload.secure_url;
      } catch (err) {
        console.warn("Cloudinary upload failed, using local static URL fallback:", err.message);
        const host = req.get('host');
        imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
      }
    } else {
      const host = req.get('host');
      imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
    }

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      specialty,
      degree,
      experience,
      fees: Number(fees),
      about,
      image: imageUrl,
      slotsBooked: {},
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to edit doctor profile from admin panel
const editDoctor = async (req, res) => {
  try {
    const { docId, name, specialty, degree, experience, fees, about, availability } = req.body;
    const imageFile = req.file;

    const updateData = {
      name,
      specialty,
      degree,
      experience,
      fees: Number(fees),
      about,
      availability: availability === 'true' || availability === true
    };

    if (imageFile) {
      let imageUrl = '';
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        try {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
          imageUrl = imageUpload.secure_url;
        } catch (err) {
          console.warn("Cloudinary upload failed during edit, using local static URL fallback:", err.message);
          const host = req.get('host');
          imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
        }
      } else {
        const host = req.get('host');
        imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
      }
      updateData.image = imageUrl;
    }

    const updatedDoc = await doctorModel.findByIdAndUpdate(docId, updateData, { new: true });
    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Doctor Updated Successfully', doctor: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const deletedDoc = await doctorModel.findByIdAndDelete(docId);
    if (!deletedDoc) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor Deleted Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all appointments list for admin
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to cancel appointment for admin
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' });

    // Release slot from doctor's slotsBooked
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

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({ role: 'patient' });
    const appointments = await appointmentModel.find({});

    const totalRevenue = appointments
      .filter(item => item.paymentStatus === 'paid' || item.paymentMethod === 'cash')
      .reduce((total, item) => total + item.amount, 0);

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      revenue: totalRevenue,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get admin profile details
const getAdminProfile = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    let admin = await userModel.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      admin = new userModel({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
      });
      await admin.save();
    }
    res.json({ success: true, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const { name, password } = req.body;
    const imageFile = req.file;

    let admin = await userModel.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (name) admin.name = name;

    if (password && password.trim() !== '') {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    if (imageFile) {
      let imageUrl = '';
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        try {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
          imageUrl = imageUpload.secure_url;
        } catch (err) {
          console.warn("Cloudinary upload failed for admin, using local static URL fallback:", err.message);
          const host = req.get('host');
          imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
        }
      } else {
        const host = req.get('host');
        imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
      }
      admin.image = imageUrl;
    }

    await admin.save();
    res.json({ success: true, message: 'Admin Profile Updated Successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  addDoctor,
  allDoctors,
  editDoctor,
  deleteDoctor,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  getAdminProfile,
  updateAdminProfile
};
