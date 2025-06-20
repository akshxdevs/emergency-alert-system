"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="border p-10 border-gray-950 rounded-lg">
        <h1 className="text-4xl font-Ultra pb-10 text-center">Select a role to continue...</h1>
        <div className="min-w-32 grid xs:grid-col-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group w-60 h-12 flex items-center justify-center">
                <div className="police-glow absolute inset-0 z-[-1] rounded-[10px]"></div>
                <div className="relative bg-[#1c1f2b] w-full h-full rounded-[10px] z-10 flex items-center justify-center">
                  <button onClick={() => router.push("/login/police")}>POLICE 👮🏻</button>
                </div>
            </div>
            <div className="relative group w-60 h-12 flex items-center justify-center">
                <div className="fire-glow absolute inset-0 z-[-1] rounded-[10px]"></div>
                <div className="relative bg-[#1c1f2b] w-full h-full rounded-[10px] z-10 flex items-center justify-center">
                  <button onClick={() => router.push("/login/fire")}>FIRE-MAN 🧑‍🚒</button>
                </div>
            </div>
            <div className="relative group w-60 h-12 flex items-center justify-center">
                <div className="medical-glow absolute inset-0 z-[-1] rounded-[10px]"></div>
                <div className="relative bg-[#1c1f2b] w-full h-full rounded-[10px] z-10 flex items-center justify-center">
                    <button onClick={() => router.push("/login/medical")}>MEDICAL 🧑‍⚕️</button>
                </div>
            </div>
            <div className="relative group w-60 h-12 flex items-center justify-center">
                <div className="citizen-glow absolute inset-0 z-[-1] rounded-[10px]"></div>
                <div className="relative bg-[#1c1f2b] w-full h-full rounded-[10px] z-10 flex items-center justify-center">
                    <button onClick={() => router.push("/login/civilian")}>CITIZEN 👨‍🦱</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
