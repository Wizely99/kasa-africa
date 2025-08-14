"use client";

import PharmacyComponent from "../components/PharmacyComponent";
import StatsCardView from "../components/StatsCardview";
export default function Pharmacy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">
          Browse and order medicines and healthcare products
        </p>
      </div>

      <StatsCardView />
      <PharmacyComponent />
    </div>
  );
}
