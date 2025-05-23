import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import FamilyHistoryDialog from "@/components/charts/Encounters/Details/FamilyHistory/FamilyHistoryDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFamilyHistoryData } from "@/services/chartDetailsServices";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import FamilyHistoryClient from "./client";
import { useCallback, useEffect, useState } from "react";

interface FamilyHistoryProps {
  userDetailsId: string;
}

function FamilyHistory({ userDetailsId }: FamilyHistoryProps) {
  // Family History State
  const [data, setData] = useState<FamilyHistoryResponseInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // GET Family History Data
  const fetchFamilyHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getFamilyHistoryData({
        userDetailsId,
        limit: itemsPerPage,
        page,
      });

      if (response) {
        setData(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, page]);

  useEffect(() => {
    fetchFamilyHistory();
  }, [fetchFamilyHistory]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Family History</span>
        <GhostButton onClick={() => setIsOpen(true)}>Add </GhostButton>
        <FamilyHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchFamilyHistory();
          }}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <FamilyHistoryClient
          data={data}
          loading={loading}
          pageNo={page}
          totalPages={totalPages}
          onSetPageNo={setPage}
        />
      </ScrollArea>
    </div>
  );
}

export default FamilyHistory;
