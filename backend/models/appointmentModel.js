import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, completed, cancelled
  paymentStatus: { type: String, default: 'pending' }, // pending, paid
  paymentMethod: { type: String, default: 'cash' }, // stripe, razorpay, cash
  doctorData: { type: Object, required: true },
  patientData: { type: Object, required: true },
  date: { type: Number, default: Date.now }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;
