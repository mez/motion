"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const JoinFormSchema = z
  .object({
    email: z
      .string({ required_error: "Need an email to join." })
      .email({ message: "Email not correctly formatted." }),
    password: z
      .string({
        required_error: "Provide a password at least 6 characters long.",
      })
      .min(6, { message: "Min password length is 6 characters." }),
    passwordConfirm: z.string(),
    name: z.string({required_error: "First and last name required." }).min(1, "First and last name required.")
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password confirm must match your password.",
    path: ["passwordConfirm"],
  });

function JoinForm() {
  const form = useForm<z.infer<typeof JoinFormSchema>>({
    resolver: zodResolver(JoinFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: '',
    },
  });

  const { register } = useAuth();

  const router = useRouter();

  const handleSubmit = async ({
    email,
    password,
    passwordConfirm,
    name
  }: z.infer<typeof JoinFormSchema>) => {
    try {
      await register(email, password, passwordConfirm, name);
      
      form.reset();
      router.push("/");
    } catch (error) {
      console.log("auth error: ", error);
    }
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Full name"
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password confirm"
                  type="password"
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* 
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          placeholder="Password confirm"
          required
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        /> */}

        <Button
          type="submit"
          className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-green-500  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Join
        </Button>
      </form>
    </Form>
  );
}

export default JoinForm;
