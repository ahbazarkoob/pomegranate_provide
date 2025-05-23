"use client";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import { ImageResultDataResponse } from "@/types/imageResults";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImageResultDataResponse>[] => [
  {
    accessorKey: "id",
    header: "Result ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "reviewerId",
    header: "Reviewer id",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("reviewerId")}</div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date",
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div className="cursor-pointer">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "testResults",
    header: "Results",
    cell: ({ row }) => {
      const testResults = row.getValue(
        "testResults"
      ) as ImageResultDataResponse["testResults"];
      return (
        <div className="cursor-pointer">
          {testResults.map((results) => (
            <div key={results.id} className="flex flex-col gap-2">
              <FormLabels
                label="Image Type"
                value={results.imageTest.imageType.name}
              />
              <FormLabels
                label="Interpretation"
                value={results.interpretation}
              />
              <div className="flex flex-row gap-3">
                <FormLabels
                  label="Documents"
                  value={results.documents?.map((docs, index) => (
                    <Button key={index} variant={"link"} onClick={()=> window.open(docs, "_blank")} className="text-blue-500">{docs.split('/').pop()}</Button>
                  ))}
                />
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "tests",
  //   header: "Tests",
  //   cell: ({ row }) => {
  //     const tests = row.getValue("tests") as Result["tests"];
  //     return (
  //       <div className="cursor-pointer">
  //         {tests.map((test) => (
  //           <span key={test.name}>{test.name}, </span>
  //         ))}
  //       </div>
  //     );
  //   },
  // },
];
