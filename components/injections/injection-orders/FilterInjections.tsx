import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { injectionsSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface FilterInjectionsProps {
  injectionsData: InjectionsInterface[];
  onHandleSearch: (values: z.infer<typeof injectionsSearchParams>) => void;
}

function FilterInjections({
  injectionsData,
  onHandleSearch,
}: FilterInjectionsProps) {
  const form = useForm<z.infer<typeof injectionsSearchParams>>({
    resolver: zodResolver(injectionsSearchParams),
  });
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);
  // Loading State
  const [loading, setLoading] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchUserDataResponse({
        pageNo: 1,
        pageSize: 10,
        firstName: searchTerm,
        lastName: searchTerm,
      });

      if (response) {
        setPatientData(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch patients",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });
      setProvidersList(response.data);
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: "Could not fetch providers",
      });
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Effects
  useEffect(() => {
    fetchUserData();
    fetchProvidersData();
  }, [fetchUserData, fetchProvidersData]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  function onSubmit(values: z.infer<typeof injectionsSearchParams>) {
    onHandleSearch(values);
  }

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {/* Ordered By Filter */}
        <FormField
          control={form.control}
          name="providerId"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Ordered by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All
                    </SelectItem>
                    {providersList
                      .filter(
                        (
                          provider
                        ): provider is typeof provider & {
                          providerDetails: { id: string };
                        } => Boolean(provider?.providerDetails?.id)
                      )
                      .map((provider) => (
                        <SelectItem
                          key={provider.id}
                          value={provider.providerDetails.id}
                          className="cursor-pointer"
                        >
                          {provider.firstName} {provider.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Status Filter */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All
                    </SelectItem>
                    {Array.from(
                      new Set(
                        injectionsData?.map((injection) =>
                          injection?.status.toLowerCase()
                        )
                      )
                    ).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="cursor-pointer"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Patient Filter */}
        <FormField
          control={form.control}
          name="userDetailsId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Search Patient "
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      setVisibleSearchList(true);

                      if (!value) {
                        field.onChange("");
                      }
                    }}
                  />
                  {searchTerm && visibleSearchList && (
                    <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              field.onChange(patient.id);
                              setSearchTerm(
                                `${patient.user.firstName} ${patient.user.lastName}`
                              );
                              setVisibleSearchList(false);
                            }}
                          >
                            {`${patient.user.firstName} ${patient.user.lastName}`}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <SubmitButton label="Search" />
        </div>
      </form>
    </Form>
  );
}

export default FilterInjections;
