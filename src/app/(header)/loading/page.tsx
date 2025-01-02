"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoadingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role || "user";
      const redirectTo = role === "admin" ? "/dashboard" : "/home";
      router.replace(redirectTo); // Redirige a la ruta correspondiente
    } else if (status === "unauthenticated") {
      router.replace("/"); // Redirige al login si no está autenticado
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Cargando...
    </div>
  );
};

export default LoadingPage;
