
import Logo from "@/app/(marketing)/_components/logo";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "../_components/login-form";
import OAuthActions from "../_components/oauth-actions";


export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-full flex-1 dark:bg-white">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
             <Logo />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Not a member?{" "}
                <Link
                  href="/join"
                  className="font-semibold inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500 "
                >
                  Join Motion free.
                </Link>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <LoginForm />
              </div>

              <OAuthActions />
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            fill
            src="/login.jpg"
            alt="login image"
            
          />
        </div>
      </div>
    </>
  );
}
