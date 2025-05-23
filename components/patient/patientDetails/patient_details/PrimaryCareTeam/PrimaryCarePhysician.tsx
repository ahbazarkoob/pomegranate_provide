import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { searchProviders } from "@/services/registerServices";
import LoadingButton from "@/components/LoadingButton";
import { PatientCareTeamInterface } from "@/types/userInterface";
import styles from "./patient_care_team.module.css";
import { Trash2Icon } from "lucide-react";

const PrimaryCarePhysician = ({
  careTeam,
}: {
  careTeam: PatientCareTeamInterface | null;
}) => {
  const [providers, setProviders] = useState<FetchProviderList[]>([]);
  const [searchPrimaryCarePhysician, setSearchPrimaryCarePhysician] =
    useState("");
  const [selectedPrimaryCarePhysician, setSelectedPrimaryCarePhysician] =
    useState<FetchProviderList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrimaryCarePhysicianSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchProviders({
        name: searchPrimaryCarePhysician,
      });

      if (response) {
        setProviders(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchPrimaryCarePhysician]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPrimaryCarePhysician.trim() && !selectedPrimaryCarePhysician) {
        handlePrimaryCarePhysicianSearch();
      } else {
        setProviders([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchPrimaryCarePhysician,
    selectedPrimaryCarePhysician,
    handlePrimaryCarePhysicianSearch,
  ]);

  const handlePrimaryCarePhysicianSelect = (user: FetchProviderList) => {
    setSelectedPrimaryCarePhysician(user);
    setProviders([]);
  };

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoBoxLabel}>Primary Care Physician</div>
      {/* {selectedPrimaryCarePhysician ? <div>Edit </div> :  */}
      <div>
        <Input
          value={searchPrimaryCarePhysician}
          onChange={(e) => {
            setSearchPrimaryCarePhysician(e.target.value);
            setSelectedPrimaryCarePhysician(null);
          }}
          placeholder="Search providers..."
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-2">
          <LoadingButton />
        </div>
      )}

      {!loading && searchPrimaryCarePhysician && (
        <div className="relative w-full">
          {!selectedPrimaryCarePhysician && providers.length > 0 ? (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
              {providers.map((user) => (
                <div
                  key={user.id}
                  className="border-2 border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePrimaryCarePhysicianSelect(user)}
                >
                  <div className="text-[#84012A] text-base font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results Found
            !selectedPrimaryCarePhysician && (
              <p className="absolute bg-white p-2 rounded shadow-lg">
                No results found.
              </p>
            )
          )}
        </div>
      )}

      <div className={styles.physicianDetailsBox}>
        <PhysicianData
          label="Name of Physician"
          value={careTeam?.primaryCarePhysician.NameOfPhysician || ""}
        />
      </div>
    </div>
  );
};

export default PrimaryCarePhysician;

const PhysicianData = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <div className={styles.labelText}>{label}</div>
      <div className={`${styles.valueText} flex items-center justify-between gap-2`}>
        {value}
        <Button variant="ghost">
          <Trash2Icon color="#84012A" />
        </Button>
      </div>
    </div>
  );
};
