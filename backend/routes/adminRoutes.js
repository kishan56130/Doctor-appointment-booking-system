import express from 'express';
import {
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
} from '../controllers/adminController.js';
import upload from '../middleware/multer.js';
import { authAdmin } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/edit-doctor', authAdmin, upload.single('image'), editDoctor);
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);
adminRouter.get('/profile', authAdmin, getAdminProfile);
adminRouter.post('/update-profile', authAdmin, upload.single('image'), updateAdminProfile);

export default adminRouter;
