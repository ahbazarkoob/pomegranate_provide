import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface PatientAppointmentTab {
  value: string;
  label: string;
  status: string[];
  component: React.ComponentType<{
    userDetailsId: string;
    status: string[];
    refreshTrigger: number;
  }>;
}

const patientAppointmentsTab: PatientAppointmentTab[] = [
  {
    value: "past",
    label: "Past",
    status: ["No Show", "Consulted"],
    component: PatientAppointmentClient,
  },
  {
    value: "upcoming",
    label: "Upcoming",
    status: ["Confirmed"],
    component: PatientAppointmentClient,
  },
  {
    value: "waiting_list",
    label: "Waiting List",
    status: ["Scheduled"],
    component: PatientAppointmentClient,
  },
];

const PatientAppointments = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <DefaultButton
          aria-label="Create New Appointment"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <PlusIcon />
          New Appointment
        </DefaultButton>

        <AppointmentsDialog
          userDetailsId={userDetailsId}
          onClose={handleDialogClose}
          isOpen={isDialogOpen}
        />
      </div>
      <Tabs defaultValue="upcoming" className="">
        <TabsList className="flex gap-3 w-full">
          {patientAppointmentsTab.map((tab) => (
            <CustomTabsTrigger value={tab.value} key={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {patientAppointmentsTab.map(
          ({ value, component: Component, status }) => (
            <TabsContent value={value} key={value}>
              <Component
                userDetailsId={userDetailsId}
                status={status}
                refreshTrigger={refreshTrigger}
              />
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};

export default PatientAppointments;
