import { Users, Stethoscope, Video } from "lucide-react";
import React from "react";
import CategoryCard from "./CategoryCard";

const CategoryGridView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CategoryCard
        icon={Users}
        title="General Consultation"
        description="For routine checkups, common illnesses, and general health concerns."
        color="yellow"
      />
      <CategoryCard
        icon={Stethoscope}
        title="Expert Doctors"
        description="For specialist consultations including cardiologists, dermatologists, etc."
        color="green"
      />
      <CategoryCard
        icon={Video}
        title="Online Consultation"
        description="Get online or text consultations for prescriptions."
        color="blue"
      />
    </div>
  );
};

export default CategoryGridView;
