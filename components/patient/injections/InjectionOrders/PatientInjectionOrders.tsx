import React from "react";
import ViewInjectionOrders from "./ViewInjectionOrders";
import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";

const PatientInjectionOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end">
        <InjectionOrders />
      </div>
      <ViewInjectionOrders userDetailsId={userDetailsId} />
    </div>
  );
};

export default PatientInjectionOrders;
