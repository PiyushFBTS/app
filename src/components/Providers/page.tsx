'use client';

import { ReactNode, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { store } from "@/store";
import { setUser } from "@/store/userSlice";
import axios from "axios";

function AppInit({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (status !== "authenticated" || !session?.user?.user_code) return;
      const url = process.env.NEXT_PUBLIC_API_URL
      
      try {
        const response = await axios.get(`${url}/api/user/${session.user.user_code}`);
        const data = response.data;

        const {
          role_code = 0,
          user_code = 0,
          user_name = "",
          first_name = "",
          last_name = "",
        } = data;

        dispatch(setUser({ role_code, user_code, user_name, first_name, last_name }));
      } catch (error) {
        console.error("❌ Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [status, session?.user?.user_code, dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <AppInit>{children}</AppInit>
      </ReduxProvider>
    </SessionProvider>
  );
}
