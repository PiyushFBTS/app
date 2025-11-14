'use client';

import { columns } from "./columns"
import { useEffect, useState } from 'react';
import axios from "axios"
import { UserTable } from './data-table';
// import RoleGuard from "@/components/roleGuardts/page";

export default function UserDataTable() {
  const [userData, setUserData] = useState([]);
  const url = process.env.NEXT_PUBLIC_API_URL

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${url}/api/userRole`)
      console.log("urserRole->url", `${url}/api/userRole`);

      setUserData(response.data)
    } catch (error) {
      console.error("error fetch in user", error);
    }
  }
  useEffect(() => {
    fetchUserData()
  }, []);

  return (
    // <RoleGuard allowedRoles={["Super Admin", "OU Manager"]}>
    <div className="container mx-auto py-8 px-4 w-max-[550px] h-[calc(100vh-65px)]">
      <UserTable columns={columns} data={userData} />
    </div>
    // </RoleGuard>
  );
}
