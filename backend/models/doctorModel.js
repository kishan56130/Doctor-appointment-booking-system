import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  fees: { type: Number, required: true },
  about: { type: String, required: true },
  availability: { type: Boolean, default: true },
  image: { type: String, required: true },
  phone: { type: String, default: '' },
  slotsBooked: { type: Object, default: {} },
  date: { type: Number, default: Date.now },
  rating: { type: Number, default: 0 },
  reviews: [{
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    patientName: { type: String, required: true },
    patientImage: { type: String, default: '' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;
