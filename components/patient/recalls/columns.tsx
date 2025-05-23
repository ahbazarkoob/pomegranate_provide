"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRecalls } from "@/services/chartDetailsServices";
import { RecallsData } from "@/types/recallsInterface";
import { Ellipsis } from "lucide-react";

const handleRecallsDelete = async (
  recallsId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchRecalls: () => void
) => {
  setLoading(true);
  try {
    await deleteRecalls({ id: recallsId });
    showToast({
      type: "success",
      message: "Recalls deleted successfully",
    });
    fetchRecalls();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete recall" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchRecalls,
}: {
  setEditData: (data: RecallsData | null) => void;
  setIsDialogOpen: ({
    create,
    edit,
    view,
  }: {
    create: boolean;
    edit: boolean;
    view: boolean;
  }) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchRecalls: () => void;
}): ColumnDef<RecallsData>[] => [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("notes")}</div>
    ),
  },
  {
    accessorKey: "due_date_period",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("due_date_period")}</div>
    ),
  },
  {
    accessorKey: "due_date_value",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {" "}
        {row.getValue("due_date_value")} {row.getValue("due_date_unit")}
      </div>
    ),
  },
  {
    accessorKey: "due_date_unit",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("due_date_unit")}</div>
    ),
  },
  {
    accessorKey: "auto_reminders",
    header: "auto_reminders",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("auto_reminders")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "active" ? "text-green-500" : "text-red-500";

      return (
        <div className={`cursor-pointer capitalize ${statusColor}`}>
          {row.original.status}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsDialogOpen({ create: false, edit: false, view: true });
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsDialogOpen({ create: false, edit: true, view: false });
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleRecallsDelete(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchRecalls
                );
                fetchRecalls();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
