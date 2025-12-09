"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authLoadingState, userState } from "./store/atoms";

export default function Home() {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  const setAuthLoading = useSetRecoilState(authLoadingState);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-auth`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
          router.push("/todos");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router, setUser, setAuthLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
