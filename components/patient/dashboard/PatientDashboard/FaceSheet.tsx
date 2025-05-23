import React, { useCallback, useEffect, useState } from "react";
import styles from "./face_Sheet.module.css";
import { fetchUserEssentials } from "@/services/userServices";
import { PatientDetails } from "@/types/userInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { getSupplements } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
import Link from "next/link";

const FaceSheet = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PatientDetails>();
  const [supplementData, setSupplementData] = useState<SupplementInterface[]>();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserEssentials({ userDetailsId });
      setUserData(data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  const fetchSupplements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSupplements({ userDetailsId });
      setSupplementData(response.data);
    } catch (error) {
      console.log("Error fetching supplements:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchUserData();
    fetchSupplements();
  }, [fetchUserData, fetchSupplements]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[65dvh]">
        <div className={styles.infoContent}>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Allergies"
              href="allergies"
              userDetailsId={userDetailsId}
            />
            {userData?.allergies && userData.allergies.length > 0 ? (
              userData?.allergies.map((allergies, index) => (
                <div
                  className={`${styles.infoTextLabel} text-[#fb6e52]`}
                  key={allergies.id}
                >
                  {index === 0 ? "" : ","}
                  {allergies.Allergen}
                </div>
              ))
            ) : (
              <NoDataRecorded />
            )}
          </div>
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Diagnoses"
              href="diagnoses"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.diagnoses ? (
                userData?.diagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {diagnosis.diagnosis_name}[{diagnosis.ICD_Code}]{" "}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(diagnosis.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div> */}
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Medications"
              href="medications"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.medicationPrescriptions ? (
                userData?.medicationPrescriptions.map((medications) => (
                  <div key={medications.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {medications.medicationName.productName} [
                      {medications.medicationName.tradeName}] {""}
                      {medications.medicationName.strength}{" "}
                      {medications.medicationName.doseForm}
                    </div>
                    <div className={styles.infoSub}>
                      {medications.medicationName.route},{""}
                      {medications.directions}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div> */}
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="History"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.section}>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Past Medical History
                  </div>
                  <div className={styles.subContainer}>
                    {userData?.medicalHistory ? (
                      userData?.medicalHistory?.map((medicalHistory) => (
                        <div key={medicalHistory.id}>
                          <div
                            className={`${styles.sectionLabel} text-[#444444]`}
                          >
                            Medical History Recorded on{" "}
                            {new Date(
                              medicalHistory.updatedAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}{" "}
                          </div>
                          <FaceSheetLabels
                            label="GLP Refill Note:"
                            value={medicalHistory.glp_refill_note_practice}
                          />
                          <FaceSheetLabels
                            label="Notes:"
                            value={medicalHistory.notes}
                          />
                        </div>
                      ))
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Family History
                  </div>
                  <div className="flex flex-col gap-3">
                    {userData?.familyHistory ? (
                      userData?.familyHistory?.map((family) => (
                        <div key={family.id}>
                          <div
                            className={`${styles.sectionLabel} text-[#444444]`}
                          >
                            Family History Recorded on{" "}
                            {new Date(family.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                          </div>
                          <FaceSheetLabels
                            label="Relationship/Deceased:"
                            value={family.relationship}
                          />
                          <FaceSheetLabels
                            label="Age:"
                            value={family?.age.toString()}
                          />
                        </div>
                      ))
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Social History
                  </div>
                  <div className="flex flex-col gap-3">
                    {userData?.socialHistories ? (
                      userData?.socialHistories?.map((socialHistory) => (
                        <div key={socialHistory.id}>
                          <div
                            className={`${styles.sectionLabel} text-[#444444]`}
                          >
                            Social History Recorded on{" "}
                            {new Date(
                              socialHistory.updatedAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}{" "}
                          </div>
                          <div
                            className={styles.infoTextLabel}
                            dangerouslySetInnerHTML={{
                              __html: socialHistory.content,
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div> */}
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Supplements"
              href="medications"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {supplementData ? (
                supplementData.map((supplement) => (
                  <div key={supplement.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {supplement.supplement} {""}
                      {supplement.manufacturer} {""}
                      {supplement.dosage} {""}
                      {supplement.unit}{" "}
                    </div>
                    <div className={styles.infoSub}>
                      {supplement.frequency}, {""}
                      {supplement.intake_type}
                      {""}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Recent Vitals"
              href="vitals"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.section}>
                {userData?.vitals ? (
                  userData?.vitals.reverse().map((vitals) => (
                    <div
                      key={vitals.id}
                      className={`${styles.subContainer} bg-[#F5F5F5] p-2 rounded`}
                    >
                      <div className={styles.infoSub}>
                        {new Date(vitals.dateTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      <FaceSheetLabels
                        label="Weight:"
                        value={`${vitals.weightLbs} lbs ${vitals.weightOzs} ozs`}
                      />
                      <FaceSheetLabels
                        label="Height:"
                        value={`${vitals.heightFeets} ' ${vitals.heightInches}`}
                      />
                      <FaceSheetLabels label="BMI:" value={`${vitals.BMI}`} />
                    </div>
                  ))
                ) : (
                  <NoDataRecorded />
                )}
              </div>
            </ScrollArea>
          </div>
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Injections"
              href="injections"
              userDetailsId={userDetailsId}
            />
            {userData?.injections ? (
              <div className="flex flex-col gap-3">
                {userData?.injections.map((injections) => (
                  <div
                    key={injections.id}
                    className={`${styles.subContainer} bg-[#F5F5F5] p-2 rounded`}
                  >
                    <FaceSheetLabels
                      label="Injection Name:"
                      value={
                        injections?.injection_name
                          ? injections.injection_name
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Dosage:"
                      value={
                        injections?.dosage_quantity
                          ? `${injections.dosage_quantity} ${injections.dosage_unit}`
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Administrated On:"
                      value={
                        injections?.administered_date
                          ? `
                      ${new Date(
                        injections?.administered_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                     ${injections.administered_time} ${injections.frequency}`
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Comments:"
                      value={injections?.comments ? injections.comments : "N/A"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div> */}
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Latest Labs"
              href="lab_records"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.labResults ? (
                userData?.labResults.map((labs) => (
                  <div key={labs.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {labs.files.map((image) => (
                        <Button
                          className="p-0"
                          key={image}
                          variant={"link"}
                          onClick={() => {
                            window.open(image, "_blank");
                          }}
                        >
                          {image.split("/")[4]}
                        </Button>
                      ))}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(labs.dateTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div> */}
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Implanted Devices"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            {userData?.implantedDevices ? (
              userData.implantedDevices.map((implantedDevices) => (
                <div key={implantedDevices.id}>
                  <FaceSheetLabels
                    label="UDI:"
                    value={
                      implantedDevices?.UDI ? implantedDevices?.UDI : "N/A"
                    }
                  />
                </div>
              ))
            ) : (
              <NoDataRecorded />
            )}
          </div> */}
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Vaccines"
              href="vaccines"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.vaccines ? (
                userData?.vaccines.map((vaccine) => (
                  <div key={vaccine.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {vaccine.vaccine_name}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(vaccine.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div> */}
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Past Visits"
              href="encounters"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.encounter ? (
                userData?.encounter.map((visit) => (
                  <div key={visit.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {visit.providerID} {""}
                      {""} {visit.mode}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(visit.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Contact Details"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            {userData ? (
              <div>
                <FaceSheetLabels
                  label="Address:"
                  value={userData?.location ? userData?.location : "N/A"}
                />
                <FaceSheetLabels
                  label="Email:"
                  value={userData?.user?.email ? userData?.user?.email : "N/A"}
                />
                <FaceSheetLabels
                  label="Phone:"
                  value={
                    userData?.user?.phoneNumber
                      ? userData?.user?.phoneNumber
                      : "N/A"
                  }
                />
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Documents"
              href="documents"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.subContainer}>
                {userData?.documents ? (
                  userData?.documents.map((doc) => (
                    <div key={doc.id} className={styles.dataContainer}>
                      <div className={`${styles.infoTextLabel}`}>
                        {doc.documents.map((image) => (
                          <Button
                            key={image}
                            className="p-0"
                            variant={"link"}
                            onClick={() => {
                              window.open(image, "_blank");
                            }}
                          >
                            {image.split("/")[4]}
                          </Button>
                        ))}
                      </div>
                      <div className={styles.infoSub}>
                        {new Date(doc.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <NoDataRecorded />
                )}
              </div>
            </ScrollArea>
          </div> */}
        </div>
      </ScrollArea>
    </>
  );
};

export default FaceSheet;

const FaceSheetLabels = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-row gap-3 items-baseline">
      <div className={styles.infoText}>{label}</div>
      <div className={styles.infoTextLabel}>{value}</div>
    </div>
  );
};

const NoDataRecorded = () => {
  return <div className={styles.infoText}>No Data Recorded</div>;
};

const TitleLinks = ({
  title,
  href,
  userDetailsId,
}: {
  title: string;
  href: string;
  userDetailsId: string;
}) => {
  return (
    <Link href={`/dashboard/provider/patient/${userDetailsId}/${href}`}>
      <div
        className={`${styles.infoLabel} hover:text-blue-600 hover:underline`}
      >
        {title}
      </div>
    </Link>
  );
};
