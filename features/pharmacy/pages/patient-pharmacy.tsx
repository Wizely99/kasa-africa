import React from "react";
import PharmacyComponent from "../components/PharmacyComponent";

const PatientPharmacy = () => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">
          Browse and order medicines and healthcare products
        </p>
      </div>
      <PharmacyComponent />
    </>
  );
};

export default PatientPharmacy;
