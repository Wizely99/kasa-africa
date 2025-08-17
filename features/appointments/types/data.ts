export interface Doctors {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location: string;
  avatar: string;
  isAvailable: boolean;
  nextAvailable: string;
  about: string;
  education: string;
  languages: string[];
}

export const mockDoctors: Doctors[] = [
  {
    id: "1",
    name: "Dr. Baraka Joshua",
    specialization: "Dermatology",
    experience: 8,
    rating: 4.8,
    consultationFee: 45000,
    location: "Downtown Medical Center",
    avatar: "/pictures/doctors/male-1.jpg",
    isAvailable: true,
    nextAvailable: "Today 2:30 PM",
    about:
      "Specialized in skin disorders, acne treatment, and cosmetic dermatology with 8+ years of experience.",
    education: "MD from Harvard Medical School",
    languages: ["English", "Kiswahili"],
  },
  {
    id: "2",
    name: "Dr. Hassan Mussa",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.9,
    consultationFee: 20000,
    location: "Heart Care Clinic",
    avatar: "/pictures/doctors/male-2.jpg",
    isAvailable: true,
    nextAvailable: "Tomorrow 10:00 AM",
    about:
      "Expert in cardiovascular diseases, heart surgery, and preventive cardiology.",
    education: "MD from Johns Hopkins University",
    languages: ["English", "Kiswahili"],
  },
  {
    id: "3",
    name: "Dr. Juma Khamisi",
    specialization: "Pediatrics",
    experience: 10,
    rating: 4.7,
    consultationFee: 75000,
    location: "Children's Health Center",
    avatar: "/pictures/doctors/male-7.jpeg",
    isAvailable: false,
    nextAvailable: "Jan 20, 9:00 AM",
    about:
      "Dedicated pediatrician focusing on child development and family healthcare.",
    education: "MD from Stanford University",
    languages: ["English", "Kiswahili"],
  },
  {
    id: "4",
    name: "Dr. Hasheem Thabeet",
    specialization: "Orthopedics",
    experience: 15,
    rating: 4.6,
    consultationFee: 30000,
    location: "Bone & Joint Institute",
    avatar: "/pictures/doctors/male-4.jpg",
    isAvailable: true,
    nextAvailable: "Today 4:00 PM",
    about:
      "Orthopedic surgeon specializing in sports injuries and joint replacement.",
    education: "MD from Mayo Clinic",
    languages: ["English", "Kiswahili","French"],
  },

  {
    id: "5",
    name: "Dr. Anna Mfugole",
    specialization: "General Medicine",
    experience: 6,
    rating: 4.5,
    consultationFee: 30000,
    location: "Family Health Clinic",
    avatar: "/pictures/doctors/female-1.jpg",
    isAvailable: true,
    nextAvailable: "Today 11:30 AM",
    about:
      "General practitioner providing comprehensive primary care for all ages.",
    education: "MD from University of Washington",
    languages: ["English", "Korean"],
  },
  {
    id: "6",
    name: "Dr. Halima Mohamed",
    specialization: "General Medicine",
    experience: 6,
    rating: 4.5,
    consultationFee: 30000,
    location: "Family Health Clinic",
    avatar: "/pictures/doctors/female-2.jpg",
    isAvailable: true,
    nextAvailable: "Today 11:30 AM",
    about:
      "General practitioner providing comprehensive primary care for all ages.",
    education: "MD from University of Washington",
    languages: ["English", "Korean"],
  },
];

export const specializations = [
  "All Specializations",
  "Cardiology",
  "Dermatology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
];