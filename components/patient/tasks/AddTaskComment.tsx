import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addCommentToTasksSchema } from "@/schema/tasksSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  TasksResponseDataInterface,
  UpdateTaskType,
} from "@/types/tasksInterface";
import { updateTask } from "@/services/chartDetailsServices";
// import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
// import TasksDialog from "@/components/tasks/TasksDialog";
import { showToast } from "@/utils/utils";
import formStyles from "@/components/formStyles.module.css";

function AddTaskComment({
  tasksData,
  onClose,
  isOpen,
}: {
  tasksData?: TasksResponseDataInterface | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  // const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
  //   null
  // );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addCommentToTasksSchema>>({
    resolver: zodResolver(addCommentToTasksSchema),
    defaultValues: {
      comments: "",
    },
  });

  useEffect(() => {
    if (tasksData) {
      form.reset({
        comments: tasksData.description,
      });
      // setEditData(tasksData);
    }
  }, [form, tasksData]);

  const onSubmit = async (values: z.infer<typeof addCommentToTasksSchema>) => {
    if (tasksData) {
      const requestData: UpdateTaskType = {
        category: tasksData?.category,
        description: values?.comments,
        priority: tasksData?.priority,
        status: tasksData?.status,
        notes: tasksData?.notes,
        dueDate: tasksData?.dueDate,
        assignedProviderId: tasksData?.assignedProvider?.id
          ? tasksData.assignedProvider.id
          : "",
        assignerProviderId: tasksData?.assignerProvider?.id,
        assignedByAdmin: tasksData?.assignedByAdmin,
        userDetailsId: tasksData?.userDetailsId,
      };

      setLoading(true);
      try {
        await updateTask({ requestData, id: tasksData.id });
        showToast({
          toast,
          type: "success",
          message: "Comment added successfully",
        });
      } catch (err) {
        console.log("Error", err);
        showToast({
          toast,
          type: "error",
          message: "Error while adding comment.",
        });
      } finally {
        setLoading(false);
        form.reset();
        onClose();
      }
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Add comment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {/* <div className="flex justify-end">
            <Button
            variant={"outline"}
              className="border border-[#84012A] bg-white text-[#84012A]"
              onClick={() => {
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
          </div> */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton label={"Save"} />
              </div>
            </form>
          </Form>
        </div>
        {/* <TasksDialog
          tasksData={editData}
          onClose={() => {
            setIsEditDialogOpen(false);
          }}
          isOpen={isEditDialogOpen}
        /> */}
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskComment;
