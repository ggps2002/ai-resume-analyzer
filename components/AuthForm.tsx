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
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const [isLoading, setIsLoading] = useState(false);
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
      <h1 className="text-2xl font-semibold text-center lg:text-3xl">
        {isSignIn ? "Welcome back to Resume" : "Create your account"}
      </h1>
      <p className="text-light-200 text-[16px] text-center">
        {isSignIn
          ? "Access the full power of AI to in your job search"
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
                <FormItem>
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
                </FormItem>
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

      <p className="text-center  font-medium">
        {isSignIn ? "New to Resume? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/register" : "/login"}
          className="font-bold"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;