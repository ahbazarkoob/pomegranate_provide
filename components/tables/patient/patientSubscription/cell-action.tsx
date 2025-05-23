'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Subscription } from '@/types/userInterface';
import { deleteQuestion } from '@/services/formServices';
import { BadgePercentIcon, ClipboardPlus, DollarSign, MoreHorizontal,  } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Subscription;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAppointmentClick = () => {
    // router.push(`/dashboard/provider/patient/appointments/${data.}`);
  };

  const handleSubscriptionClick = () => {
    // router.push(`/dashboard/provider/patient/subscriptions/${data.id}`);
  };

  const handlePaymentsClick = () => {
    // router.push(`/dashboard/provider/patient/payments/${data.id}`);
  };

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteQuestion({ id: data.id });
      router.refresh(); // Optionally refresh the page to reflect changes
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
      setOpen(false); // Close the modal after operation
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="h-8 w-8 p-0 border-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={handleAppointmentClick}
          >
            <ClipboardPlus className="mr-2 h-4 w-4" /> Appointment 
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSubscriptionClick}>
            <BadgePercentIcon className="mr-2 h-4 w-4" /> Subscription
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePaymentsClick}>
            <DollarSign className="mr-2 h-4 w-4" /> Payments
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
