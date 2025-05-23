import React from "react";
import imageUrl from "@/public/images/Logo_Red.svg";
import Image from "next/image";
import Link from "next/link";
import AccountIcon from "@/components/account/AccountIcon";

const DashboardLayoutHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-[#FFEBF2]">
      <Link href={"/dashboard"}>
        <Image src={imageUrl} alt={"logo"} height={24} priority />
      </Link>
      <AccountIcon />
    </div>
  );
};

export default DashboardLayoutHeader;
