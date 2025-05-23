import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getInjectionsData } from "@/services/injectionsServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
import FilterInjections from "./FilterInjections";
import { useCallback, useEffect, useState } from "react";
import { injectionsSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";


function InjectionsClient() {
  // Data State
  const [injectionsData, setInjectionsData] = useState<InjectionsInterface[]>(
    []
  );

  // Pagination State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [filters, setFilters] = useState({
    providerId: "",
    userDetailsId: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getInjectionsData({
        providerId: filters.providerId,
        userDetailsId: filters.userDetailsId,
        status: filters.status,
        page: pageNo,
        limit: itemsPerPage,
      });

      if (response) {
        setInjectionsData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageNo, filters.userDetailsId, filters.providerId, filters.status]);

  const handleSearch = (
    filterValues: z.infer<typeof injectionsSearchParams>
  ) => {
    if (filterValues.userDetailsId === "all") {
      filterValues.status = "";
    }

    if (filterValues.providerId === "all") {
      filterValues.providerId = "";
    }

    setFilters({
      providerId: filterValues.providerId || "",
      userDetailsId: filterValues.userDetailsId || "",
      status: filterValues.status || "",
    });
    setPageNo(1);
  };

  // Effects
  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterInjections
          injectionsData={injectionsData}
          onHandleSearch={handleSearch}
        />
      </div>
      <DataTable
        searchKey="Injections"
        columns={columns({
          setLoading,
          showToast: () =>
            showToast({
              toast,
              type: "success",
              message: "Deleted Successfully",
            }),
          fetchInjectionList: () => fetchInjectionsData(),
        })}
        data={injectionsData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default InjectionsClient;
