import type { Metadata } from "next";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider"
import "../styles/globals.css"
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "Resume",
  description:
    "An AI powered application to ease your job hunt.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
        >
          {children}

          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;