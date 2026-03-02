"use client";

import { SessionProvider } from "next-auth/react";
import { NavProvider } from "@/context/NavContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NavProvider>
                {children}
            </NavProvider>
        </SessionProvider>
    );
}
