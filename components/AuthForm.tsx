"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { set, ZodType } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants/index";
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { handleOAuthSignIn } from "@/lib/actions/auth";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const GitHubIcon = () => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full">
    <svg
      role="img"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="black"
        d="M49 0C21.9 0 0 22.2 0 49.5c0 21.9 14.1 40.5 33.6 47.1 2.5.5 3.4-1.1 3.4-2.4 0-1.2-.1-5.1-.1-9.2-12.8 2.8-15.5-5.5-15.5-5.5-2.3-6-5.6-7.6-5.6-7.6-4.6-3.2.3-3.1.3-3.1 5.1.4 7.8 5.3 7.8 5.3 4.5 7.9 11.8 5.6 14.7 4.3.5-3.2 1.8-5.6 3.2-6.9-10.2-1.2-21-5.2-21-23.2 0-5.1 1.8-9.2 4.9-12.5-.5-1.2-2.1-6 0.5-12.4 0 0 3.9-1.3 12.7 4.8 3.7-1 7.7-1.5 11.7-1.5s8 0.5 11.7 1.5c8.8-6.1 12.7-4.8 12.7-4.8 2.6 6.4 1 11.2 0.5 12.4 3.1 3.3 4.9 7.4 4.9 12.5 0 18.1-10.8 22-21 23.2 1.8 1.5 3.4 4.5 3.4 9.1 0 6.6-.1 11.9-.1 13.5 0 1.3.9 2.9 3.4 2.4 19.5-6.6 33.6-25.2 33.6-47.1C98 22.2 76.1 0 49 0z"
      />
    </svg>
  </div>
);



const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M24 9.5c3.14 0 5.97 1.08 8.19 2.84l6.13-6.13C34.64 2.3 29.64 0 24 0 14.63 0 6.85 5.5 3 13.44l7.47 5.8C12.44 13.47 17.74 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.96 24.46c0-1.57-.14-3.08-.4-4.54H24v9.21h13.05c-.66 3.35-2.51 6.19-5.12 8.04l7.47 5.79c4.35-4.02 7.56-10.06 7.56-18.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.86A14.43 14.43 0 0 1 9.49 24c0-1.7.3-3.33.84-4.86L3 13.44A23.94 23.94 0 0 0 0 24c0 3.93.96 7.65 2.64 10.93l7.89-6.07z"
    />
    <path
      fill="#EA4335"
      d="M24 48c6.48 0 11.88-2.14 15.85-5.79l-7.47-5.79c-2.02 1.36-4.6 2.16-8.38 2.16-6.26 0-11.56-3.97-13.52-9.64L3 34.93C6.85 42.5 14.63 48 24 48z"
    />
  </svg>
);

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsLoading(true);
    const result = await onSubmit(data);

    if (result.success) {
      toast.success(
        isSignIn ? "You have successfully signed in." : "You have successfully signed up."
      );
      router.push("/");
    } else {
      toast.error(`Error ${isSignIn ? "signing in" : "signing up"}`, {
        description: result.error ?? "An error occurred.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
        {/* {!isSignIn && (
      <div className="flex items-center justify-center">
        <Image src="/images/logo.png" alt="logo" height={40} width={40} />
      </div>
      <Image src="/images/logo.png" alt="logo" height={30} width={30} className="ml-1"/> 
    )} */}
      <h1 className="text-2xl font-semibold text-center lg:text-3xl">
        {isSignIn ? <div className="flex items-center justify-center">
            <p className="text-nowrap">Welcome back 😊</p>
          </div> : "Create your account"}
      </h1>
      <p className="text-light-200 text-[16px] text-center">
        {isSignIn
          ? "Access the full power of AI to your job search"
          : "A.I to help you in your job search"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                FIELD_NAMES[field.name as keyof typeof FIELD_NAMES] === "Password" ? (
                  <FormItem>
                  <FormLabel >
                    <div className="flex justify-between items-center gap-1">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    {
                      passwordVisible ? <VisibilityOffOutlinedIcon fontSize="small"  onClick={() => setPasswordVisible(false)}/> : <VisibilityOutlinedIcon fontSize="small"  onClick={() => setPasswordVisible(true)} />
                    }
                    </div>
                  </FormLabel>
                  <FormControl>
                  <div >
                  <Input
                      required
                      type={
                        passwordVisible ? "text" : "Password"
                      }
                      {...field}
                      className="form-input "
                    />
                  </div>
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
                ) :
                (<FormItem>
                  <FormLabel >
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={
                        FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                      }
                      {...field}
                      className="form-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>)
              )}
            />
          ))}
          <div className={`flex gap-8 ${isSignIn ? "justify-between" : "justify-center"}`}>
            <Button type="submit" className="btn-primary" disabled={isLoading}>
            {isSignIn ? (isLoading ? (<><span className="loader"></span>Signing In...</>) : "Sign In") : (isLoading ? <><span className="loader"></span>Signing Up...</> : "Sign Up")}
            </Button>
            {isSignIn && (<a href="#" className="text-[blue] text-nowrap">Forget password?</a>)}
          </div>
        </form>
      </Form>

      <p className="text-center  font-medium text-nowrap">
        {isSignIn ? "New to Resume? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/register" : "/login"}
          className="font-bold text-nowrap"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
      <div className="w-full flex justify-between items-center">
        <div className="w-[40%] h-[1px] bg-black-2"></div>
        <p className="font-medium">Or</p>
        <div className="w-[40%] h-[1px] bg-black-2"></div>
      </div>
      <p className="text-center font-medium">Sign in with:</p>
      <div className="flex justify-center items-center gap-6">
        <div className="p-[0.6rem] rounded-full bg-gray-200 cursor-pointer" 
        onClick={() => handleOAuthSignIn("google")}>
          <GoogleIcon />
        </div>
        <div className=" rounded-full cursor-pointer" onClick={() => handleOAuthSignIn("github")}>
          <GitHubIcon />
        </div>
      </div>
    </div>
  );
};
export default AuthForm;

// 