"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import LabOrders from "./LabOrders/LabOrders";
import LabResults from "./LabResults/LabResults";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";

export default function Lab() {
  const [activeTab, setActiveTab] = useState<string>("labResults");
  const router = useRouter();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="labResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="labResults">Lab Results</TabsTrigger>
              <TabsTrigger value="labOrders">Lab Orders</TabsTrigger>
            </TabsList>
            <DefaultButton
              onClick={() =>
                router.push(
                  activeTab === "labResults"
                    ? "/dashboard/provider/labs/create_lab_results"
                    : "/dashboard/provider/labs/create_lab_orders"
                )
              }
            >
                <PlusIcon />
                {activeTab === "labResults" ? "Lab Results" : "Lab Orders"}
            </DefaultButton>
          </div>
          <TabsContent value="labResults">
            <LabResults />
          </TabsContent>
          <TabsContent value="labOrders">
            <LabOrders />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
