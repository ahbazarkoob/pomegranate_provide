"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLabResultsSchema } from "@/schema/createLabResultsSchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import LoadingButton from "@/components/LoadingButton";
import SearchAndAddDrawer from "@/components/charts/Encounters/SOAP/Labs/SearchAndAddDrawer";
import { Separator } from "@/components/ui/separator";
import AddLabsDialog from "@/components/charts/Encounters/SOAP/Labs/AddLabsDialog";
import PastOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/PastOrdersDialog";
import ViewOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/ViewOrdersDialog";
import { fetchUserInfo } from "@/services/userServices";
import { PatientDetails } from "@/types/userInterface";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";

const CreateOrderRecord = () => {
  const [patient, setPatient] = useState<PatientDetails>();

  // Loading State
  const [loading, setLoading] = useState({
    patient: false,
    patients: false,
  });

  // Router Hook
  const router = useRouter();

  // User Details ID extracted from query parameters
  const searchParams = useSearchParams();
  const userDetailsId = searchParams.get("userDetailsId");

  const form = useForm<z.infer<typeof createLabResultsSchema>>({
    resolver: zodResolver(createLabResultsSchema),
    defaultValues: {
      patient: patient?.user.id ?? "",
      reviewer: "",
      dateTime: "",
      labId: "",
      testIds: [],
      testResults: [
        {
          name: "",
          result: "",
          unit: "",
          referenceMin: undefined,
          referenceMax: undefined,
          interpretation: "",
          comment: "",
          groupComment: "",
        },
      ],
      tags: "",
    },
  });

  // GET Patient Data From Id
  const fetchPatientFromId = useCallback(async () => {
    setLoading((prev) => ({ ...prev, patient: true }));

    try {
      if (userDetailsId) {
        const response = await fetchUserInfo({ userDetailsId });

        if (response) {
          setPatient(response?.userDetails);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, patient: false }));
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchPatientFromId();
  }, [fetchPatientFromId]);

  const onSubmit = async (values: z.infer<typeof createLabResultsSchema>) => {
    console.log(values);
  };

  if (loading.patient || loading.patients) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Lab Orders
          <div className="flex gap-3 ">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace(
                  `/dashboard/provider/patient/${userDetailsId}/lab_records`
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={`${formStyles.formBody} w-[30rem]`}>
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Ordered Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        placeholder="Select date"
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Submit" />
            </div>
          </form>
        </Form>
        {userDetailsId && (
          <div className="flex py-5 items-center space-x-4 text-sm">
            <SearchAndAddDrawer userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <AddLabsDialog userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <PastOrdersDialog userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <ViewOrdersDialog userDetailsId={userDetailsId} />
          </div>
        )}
      </div>
    </>
  );
};

export default CreateOrderRecord;
