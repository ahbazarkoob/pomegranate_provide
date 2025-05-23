"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserAppointmentInterface } from "@/types/userInterface";
import JoinButton from "./JoinButton";
import { Badge } from "@/components/ui/badge";

export const columns = (
  handleRowClick: (userAppointment: UserAppointmentInterface) => void
): ColumnDef<UserAppointmentInterface>[] => [
  {
    accessorKey: "providerName",
    header: "Provider",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("providerName")}
      </div>
    ),
  },
  {
    accessorKey: "dateOfAppointment",
    header: "Date / Time",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.original.dateOfAppointment} / {row.original.timeOfAppointment}
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("reason")}
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "additionalText",
    header: "",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("additionalText")}
      </div>
    ),
  },
  {
    id: "meetingLink",
    header: "Meeting Link",
    cell: ({ row }) => (
      <JoinButton appointmentLink={row.original.meetingLink} />
    ),
    enableSorting: true,
  },
];
