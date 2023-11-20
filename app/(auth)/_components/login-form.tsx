'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginForm() {
  const {login} = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter()

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      await login(email, password);
      router.push('/')
    } catch (error) {
      console.log("auth error: ",error);
    }
    
  }

  return (
   <>
   <form onSubmit={handleSubmit} className="space-y-5">
         
         <Input
           id="email"
           name="email"
           type="email"
           value={email}
           onChange={(event) => setEmail(event.target.value)}
           placeholder="Email"
           autoComplete="email"
           required
           className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
         />
     
         <Input
           id="password"
           name="password"
           type="password"
           value={password}
           onChange={(event) => setPassword(event.target.value)}
           placeholder="Password"
           autoComplete="current-password"
           required
           className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
         />

   
       <Button
         type="submit"
         className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-green-500  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
       >
         Log in
       </Button>
    
   </form>
   </>
  )
}

export default LoginForm