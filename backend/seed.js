import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';

dotenv.config();

const sampleDoctors = [
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@prescripto.com",
    specialty: "General Physician",
    degree: "MBBS, MD",
    experience: "5 Years",
    fees: 50,
    about: "Dr. Sarah Jenkins is committed to providing comprehensive healthcare services, focusing on preventative medicine and patient wellness plans.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Christopher Davis",
    email: "christopher.davis@prescripto.com",
    specialty: "General Physician",
    degree: "MBBS, MD",
    experience: "7 Years",
    fees: 60,
    about: "Dr. Christopher Davis is a seasoned general practitioner with expertise in managing chronic illnesses, primary healthcare, and emergency diagnostics.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Richard Martinez",
    email: "richard.martinez@prescripto.com",
    specialty: "Gynecologist",
    degree: "MBBS, MS (OBGYN)",
    experience: "8 Years",
    fees: 70,
    about: "Dr. Martinez specializes in women's reproductive health, prenatal support, and complex obstetric care with a compassionate approach.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Chloe Evans",
    email: "chloe.evans@prescripto.com",
    specialty: "Gynecologist",
    degree: "MBBS, MD (OBGYN)",
    experience: "6 Years",
    fees: 75,
    about: "Dr. Chloe Evans offers expert clinical guidance for women's healthcare, prenatal screenings, and reproductive system diagnostics.",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Emily Taylor",
    email: "emily.taylor@prescripto.com",
    specialty: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "6 Years",
    fees: 60,
    about: "Dr. Emily Taylor provides clinical diagnosis and advanced skin treatments for conditions ranging from eczema to cosmetic dermatology.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@prescripto.com",
    specialty: "Pediatrician",
    degree: "MBBS, DCH",
    experience: "10 Years",
    fees: 55,
    about: "Dr. James Wilson is dedicated to the physical, emotional, and social health of infants, children, and adolescents.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Alex Carter",
    email: "alex.carter@prescripto.com",
    specialty: "Neurologist",
    degree: "MBBS, DM (Neurology)",
    experience: "12 Years",
    fees: 100,
    about: "Dr. Alex Carter diagnoses and treats diseases of the central nervous system, specializing in migraine care and sleep neurology.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Harshit",
    email: "harshit.neurology@prescripto.com",
    specialty: "Neurologist",
    degree: "MBBS, MD, DM",
    experience: "4 Years",
    fees: 80,
    about: "Dr. Harshit is specialized in neuro-muscular disorders, stroke treatments, and peripheral nerve therapies.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Olivia Bennett",
    email: "olivia.bennett@prescripto.com",
    specialty: "Gastroenterologist",
    degree: "MBBS, MD, DM",
    experience: "7 Years",
    fees: 80,
    about: "Dr. Olivia Bennett specializes in digestive tract health, IBS treatments, liver care, and diagnostic endoscopy procedures.",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&auto=format&fit=crop&q=80"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/doctor-booking`);
    console.log("Connected to MongoDB for seeding...");

    // Clean existing doctors
    await doctorModel.deleteMany({});
    console.log("Cleared existing doctor records.");

    // Hash passwords and format
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("doctor12345", salt);

    const formattedDoctors = sampleDoctors.map(doc => ({
      ...doc,
      password: hashedPassword,
      availability: true,
      slotsBooked: {},
      date: Date.now()
    }));

    await doctorModel.insertMany(formattedDoctors);
    console.log("Successfully seeded 6 doctor profiles!");

    // Clean and seed a default user patient profile for instant testing
    await userModel.deleteMany({ email: 'user@prescripto.com' });
    const userHashedPassword = await bcrypt.hash("user12345", salt);
    
    const sampleUser = {
      name: "John Doe",
      email: "user@prescripto.com",
      password: userHashedPassword,
      phone: "1234567890",
      gender: "Male",
      dob: "1995-08-15",
      address: { line1: "123 Health Ave", line2: "Clinic District" },
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      role: "patient"
    };

    await userModel.create(sampleUser);
    console.log("Successfully seeded default patient: user@prescripto.com / user12345");

    mongoose.connection.close();
    console.log("Seeding process completed and database connection closed.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
