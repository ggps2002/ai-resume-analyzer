import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth();
  if (session) redirect("/");
  return (
    <main className=" lg:overflow-hidden lg:flex w-screen h-screen">
      <section className="lg:w-1/2 h-full w-full p-8 ">
        <div className="flex">
          <Image src="/images/logo.png" alt="logo" height={30} width={30} />
          <h1 className="sidebar-logo ml-1">Resume</h1>
        </div>
        <div className="flex justify-center items-center h-full w-full">
          {children}
        </div>
      </section>
      <section className="w-1/2 h-full relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Ensure the src starts with a leading slash
          alt="auth_image"
          layout="fill" // Use the fill layout mode
          objectFit="cover" // Ensure the image covers the container
        />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h1 className=" text-white text-5xl md:text-8xl lg:text-9xl font-semibold tracking-wide leading-tight">
            Be a <br />
            perfect match
            <br />
            <span>for your job.</span>
          </h1>
        </div>
      </section>
    </main>
  );
};

export default Layout;
