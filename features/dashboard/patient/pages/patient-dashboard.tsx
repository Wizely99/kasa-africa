import { Users, Stethoscope, Video } from "lucide-react";
import React from "react";
import AppointmentsList from "../components/AppointmentList";
import CategoryCard from "../components/CategoryCard";
import HealthTips from "../components/HealthTips";
import HeroBanner from "../components/HeroBanner";
import MiniCalendar from "../components/MiniCalendar";
import TopDoctors from "../components/TopDoctors";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-2 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            <HeroBanner />

            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CategoryCard
                  icon={Users}
                  title="General Consultation"
                  description="For routine checkups, common illnesses, and general health concerns."
                  variant="primary"
                />
                <CategoryCard
                  icon={Stethoscope}
                  title="Specialist Consultation"
                  description="For specialist consultations including cardiologists, dermatologists, etc."
                  variant="success"
                />
                <CategoryCard
                  icon={Video}
                  title="Online Consultation"
                  description="Get online or text consultations for prescriptions."
                  variant="info"
                />
              </div>
            </div>

            <AppointmentsList />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Appointments
              </h3>
              <MiniCalendar />
            </div>

            <TopDoctors />
            <HealthTips />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
