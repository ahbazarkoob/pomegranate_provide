import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { filterLabResultsSchema } from "@/schema/createLabResultsSchema";
import { getLabResultList } from "@/services/labResultServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { LabResultsInterface } from "@/types/labResults";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "../../../lab/LabResults/columns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PageContainer from "@/components/layout/page-container";

interface ResultRecordsProps {
  userDetailsId: string;
}

function ResultRecords({ userDetailsId }: ResultRecordsProps) {
  // Data State
  const [resultList, setResultList] = useState<LabResultsInterface>();

  // Pagination State
  const limit = 5;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Providers State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState({
    providers: false,
    labResults: false,
  });

  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    setFilters((prev) => ({
      ...prev,

      reviewer: values.reviewer || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: "",
    }));

    setPage(1);
  }

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, providers: true }));

    try {
      const response = await fetchProviderListDetails({
        page: page,
        limit: 10,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  }, [page]);

  const fetchLabResultsList = useCallback(
    async (page: number) => {
      setLoading((prev) => ({ ...prev, labResults: true }));

      try {
        const response = await getLabResultList({
          userDetailsId,
          providerId: filters.reviewer,
          status: filters.status,
          limit,
          page: page,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / Number(response.limit)));
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading((prev) => ({ ...prev, labResults: false }));
      }
    },
    [filters, userDetailsId]
  );

  useEffect(() => {
    fetchLabResultsList(page);
    fetchProvidersData();
  }, [page, fetchLabResultsList, fetchProvidersData]);

  if (loading.labResults || loading.providers) {
    return <LoadingButton />;
  }

  return (
    <PageContainer scrollable={true}>
      <div>
        {/* Search Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {Array.from(
                          new Set(
                            resultList?.results.map((result) => result?.status)
                          )
                        ).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Reviewer" />
                      </SelectTrigger>
                      <SelectContent>
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
                              key={provider.providerDetails.id}
                              value={provider.providerDetails.id}
                              className="cursor-pointer"
                            >
                              {provider.firstName} {provider.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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

        {/* Results Table */}
        <div className="py-5">
          {resultList?.results && (
            <DataTable
              searchKey="id"
              columns={columns()}
              data={resultList?.results}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default ResultRecords;
