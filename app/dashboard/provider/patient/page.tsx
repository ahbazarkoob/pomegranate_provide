//dashboard/provider/patient
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { PatientClient } from "@/components/tables/patient/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
];
export default function Patients() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientClient />
      </div>
    </PageContainer>
  );
}
