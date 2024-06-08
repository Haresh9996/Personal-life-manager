"use client"
import { useState } from "react";
import Login from "./_components/Login";
import Signup from "./_components/Signup";

export default function Home() {
  const [logIn, setLogIn] = useState(true)

  return (
    <>
      <div className="min-h-[100dvh]">
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 rounded-lg border border-gray-700 shadow-md shadow-slate-800">
              {
                logIn ? <Login /> : <Signup />
              }


              <button onClick={() => setLogIn(!logIn)}>
                {
                  logIn ?
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don&apos;t have an account? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Signup here</span>
                    </p>
                    :
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account ? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</span>
                    </p>
                }
              </button>
            </div>
          </div>

        </section>
      </div >
    </>
  );
}
