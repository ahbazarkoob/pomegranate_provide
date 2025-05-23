import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { prescriptionSchema } from "@/schema/prescriptionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RxPatientDetailsSection from "@/components/charts/Encounters/SOAP/Prescription/RxPatientDetailsSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import { Switch } from "@/components/ui/switch";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createPrescriptions } from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";

const PatientMedicationDialog = ({
  userDetailsId,
  isOpen,
  onClose,
}: {
  userDetailsId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [drugName, setDrugName] = useState<string>("");
  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState<boolean>(false);
  const [dispenseAsWritten, setDispenseAsWritten] = useState<boolean>(false);
  const { toast } = useToast();

  // Chart State
  const chartId = useSelector((state: RootState) => state.user.chartId);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      primary_diagnosis: "",
      secondary_diagnosis: "",
      dosage_quantity: undefined,
      dosage_unit: "",
      route: "",
      frequency: "",
      when: "",
      duration_quantity: "",
      duration_unit: "",
      directions: "",
      dispense_quantity: undefined,
      dispense_unit: "",
      days_of_supply: undefined,
      earliest_fill_date: "",
      prior_auth: "",
      prior_auth_decision: "",
      additional_refills: undefined,
      internal_comments: "",
      Note_to_Pharmacy: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    setLoading(false);
    if (chartId) {
      const requestData = {
        drug_name: drugName,
        dispense_as_written: dispenseAsWritten,
        primary_diagnosis: values.primary_diagnosis,
        secondary_diagnosis: values.secondary_diagnosis,
        directions: values.directions,
        dispense_quantity: values.dispense_quantity,
        dispense_unit: String(values.dispense_quantity),
        prior_auth: values.prior_auth,
        prior_auth_decision: values.prior_auth_decision,
        internal_comments: values.internal_comments || "",
        days_of_supply: values.days_of_supply ?? 0,
        additional_refills: values.additional_refills,
        Note_to_Pharmacy: values.Note_to_Pharmacy,
        earliest_fill_date: values.earliest_fill_date || "",
        dosages: [
          {
            dosage_quantity: values.dosage_quantity,
            dosage_unit: values.dosage_unit,
            route: values.route,
            frequency: values.frequency,
            when: values.when,
            duration_quantity: values.duration_quantity,
            duration_unit: values.duration_unit,
          },
        ],
        chartId,
      };
      try {
        setLoading(true);
        await createPrescriptions({ requestData: requestData });
        setShowPrescriptionForm(!showPrescriptionForm);
        showToast({ toast, type: "success", message: "Saved!" });
      } catch (e) {
        console.log("Error", e);
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>
        {showPrescriptionForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[30rem]">
                <div className={formStyles.formBody}>
                  <div className="flex flex-row gap-2">
                    <div>Dispense as Written</div>
                    <Switch
                      checked={dispenseAsWritten}
                      onCheckedChange={(value) => setDispenseAsWritten(value)}
                    />
                  </div>
                  <Input
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="Enter drug name"
                  />

                  <div className={formStyles.formItem}>
                    <div className="font-semibold">Diagnosis</div>
                    <div className="flex w-full gap-3">
                      <FormField
                        control={form.control}
                        name="primary_diagnosis"
                        render={({ field }) => (
                          <FormItem className={`${formStyles.formItem} w-full`}>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue
                                    placeholder="Select"
                                    className="w-full"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="diagnosis1">
                                    Diagnosis 1
                                  </SelectItem>
                                  <SelectItem value="diagnosis2">
                                    Diagnosis 2
                                  </SelectItem>
                                  <SelectItem value="diagnosis3">
                                    Diagnosis 3
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondary_diagnosis"
                        render={({ field }) => (
                          <FormItem className={`${formStyles.formItem} w-full`}>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="diagnosis1">
                                    Diagnosis 1
                                  </SelectItem>
                                  <SelectItem value="diagnosis2">
                                    Diagnosis 2
                                  </SelectItem>
                                  <SelectItem value="diagnosis3">
                                    Diagnosis 3
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div
                    className={`${formStyles.formItem} bg-[#c5c4c4] p-3 rounded-md`}
                  >
                    <div className="font-semibold">Dosage: </div>
                    <div className="flex w-full gap-3">
                      <FormField
                        control={form.control}
                        name="dosage_quantity"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter quantity"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || "")
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dosage_unit"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mg">mg</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="route"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Route</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="route1">
                                    Route 1
                                  </SelectItem>
                                  <SelectItem value="route2">
                                    Route 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frequency1">
                                    Frequency 1
                                  </SelectItem>
                                  <SelectItem value="frequency2">
                                    Frequency 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="when"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>When</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frequency1">
                                    Frequency 1
                                  </SelectItem>
                                  <SelectItem value="frequency2">
                                    Frequency 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration_quantity"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="Duration" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration_unit"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Duration Unit</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="duration type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="weeks">Weeks</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="directions"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Directions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Directions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full gap-3">
                    <div className={`${formStyles.formItem} w-full`}>
                      <div className="font-semibold">Dispense</div>
                      <div className="flex gap-3 w-full">
                        <FormField
                          control={form.control}
                          name="dispense_quantity"
                          render={({ field }) => (
                            <FormItem
                              className={`${formStyles.formItem} w-full`}
                            >
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Quantity"
                                  className="w-28"
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber || "")
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dispense_unit"
                          render={({ field }) => (
                            <FormItem
                              className={`${formStyles.formItem} w-full`}
                            >
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="mt-0">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gram">Gram</SelectItem>
                                    <SelectItem value="lts">Lts</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="days_of_supply"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel className="w-fit">Days Supply</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder=""
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || "")
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="earliest_fill_date"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel className="w-fit">
                            Earliest Fill Date
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <div className={`${formStyles.formItem} w-full`}>
                      <div>Prior Auth</div>
                      <div className="flex gap-3 w-full">
                        <FormField
                          control={form.control}
                          name="prior_auth"
                          render={({ field }) => (
                            <FormItem
                              className={`${formStyles.formItem} w-full`}
                            >
                              <FormControl>
                                <Input placeholder="Prior Auth" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="prior_auth_decision"
                          render={({ field }) => (
                            <FormItem
                              className={`${formStyles.formItem} w-full`}
                            >
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="mt-0">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="option1">
                                      option 1
                                    </SelectItem>
                                    <SelectItem value="option2">
                                      option 2
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="additional_refills"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel>Additional Refills</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder=""
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || "")
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 items-center w-full">
                    <FormField
                      control={form.control}
                      name="internal_comments"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel>Internal Comments</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Note_to_Pharmacy"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel>Note to Pharmacy</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant={"outline"}
                      className="w-full"
                      onClick={() =>
                        setShowPrescriptionForm(!showPrescriptionForm)
                      }
                    >
                      Cancel
                    </Button>
                    <SubmitButton label="Save" />
                  </div>
                </div>
              </ScrollArea>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col gap-2">
            <RxPatientDetailsSection userDetailsId={userDetailsId} />
            <div className="flex flex-col p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  Search & Add Rx
                </span>
                <Input
                  value={drugName}
                  placeholder="Enter drug name"
                  className="w-1/2 rounded-md"
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <div className="flex text-center">
                  Please search for your drug. If not found,
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className="text-[#84012A] font-semibold ml-1"
                >
                  Add a custom drug
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientMedicationDialog;
