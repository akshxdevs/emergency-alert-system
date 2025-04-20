"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <button onClick={()=>{
        router.push("/login/civilian")
      }}>CITIZEN</button>
      <button onClick={()=>{
        router.push("/login/police")
      }}>POLICE</button>
      <button onClick={()=>{
        router.push("/login/fireman")
      }}>FIRE-MAN</button>
      <button onClick={()=>{
        router.push("/login/medical")
      }}>MEDICAL</button>
    </div>
  );
}
