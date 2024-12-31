"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Asegura que el componente sea reactivo después de montarse
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="bg-zinc-900 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/home">
          <h1 className="font-bold text-xl">Tienda Taller</h1>
        </Link>

        <ul className="flex gap-x-2">
          {status === "authenticated" ? (
            <>
              <li className="px-3 py-1">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Button onClick={() => signOut()}>Logout</Button>
              </li>
            </>
          ) : (
            <>
              <li className="px-3 py-1">
                <Link href="/home">Home</Link>
              </li>
              <li className="bg-indigo-500 px-3 py-1">
                <Link href="/">Login</Link>
              </li>
              <li className="bg-indigo-700 px-3 py-1">
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
