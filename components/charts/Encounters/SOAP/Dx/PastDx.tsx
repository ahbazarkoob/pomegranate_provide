import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserEncounterData } from "@/types/chartsInterface";
import PastDxBody from "./PastDxBody";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <GhostButton>Past Dx</GhostButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Past Diagnoses</DialogTitle>
        </DialogHeader>
        <PastDxBody patientDetails={patientDetails} />
      </DialogContent>
    </Dialog>
  );
};

export default PastDx;
