import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// API for Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const doctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentModel.find({ doctorId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to mark appointment completed
const appointmentComplete = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'completed', paymentStatus: 'paid' });
      return res.json({ success: true, message: 'Appointment Completed' });
    } else {
      return res.status(400).json({ success: false, message: 'Mark Failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' });

      // Release slot
      const { doctorId: docId, appointmentDate, appointmentTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);
      
      let slotsBooked = doctorData.slotsBooked;
      if (slotsBooked[appointmentDate]) {
        slotsBooked[appointmentDate] = slotsBooked[appointmentDate].filter(e => e !== appointmentTime);
        await doctorModel.findByIdAndUpdate(docId, { slotsBooked });
      }

      return res.json({ success: true, message: 'Appointment Cancelled' });
    } else {
      return res.status(400).json({ success: false, message: 'Cancellation Failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentModel.find({ doctorId });

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.status === 'completed' || item.paymentStatus === 'paid') {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.patientId.toString())) {
        patients.push(item.patientId.toString());
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const profileData = await doctorModel.findById(doctorId).select('-password');
    res.json({ success: true, profileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId, name, specialty, degree, experience, fees, availability, about, phone, password } = req.body;
    const imageFile = req.file;

    const updateData = {
      fees: Number(fees),
      availability: availability === 'true' || availability === true,
      about
    };

    if (name) updateData.name = name;
    if (specialty) updateData.specialty = specialty;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (phone) updateData.phone = phone;

    if (password && password.trim() !== '') {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (imageFile) {
      let imageUrl = '';
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        try {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
          imageUrl = imageUpload.secure_url;
        } catch (err) {
          console.warn("Cloudinary upload failed for doctor profile update, using local static URL fallback:", err.message);
          const host = req.get('host');
          imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
        }
      } else {
        const host = req.get('host');
        imageUrl = `${req.protocol}://${host}/uploads/${imageFile.filename}`;
      }
      updateData.image = imageUrl;
    }

    const updatedProfile = await doctorModel.findByIdAndUpdate(doctorId, updateData, { new: true }).select('-password');
    
    res.json({ success: true, message: 'Profile Updated Successfully', profileData: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  doctorAppointments,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};
