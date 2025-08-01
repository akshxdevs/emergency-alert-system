"use client";
import { useEffect, useState } from "react";

export const HeaderCard = () => {
      const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/libs/lib.js';
    script.async = true;

    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).FinisherHeader) {
        new (window as any).FinisherHeader({
          count: 100,
          size: { min: 2, max: 8, pulse: 0 },
          speed: {
            x: { min: 0, max: 1.2 },
            y: { min: 0, max: 1.8 },
          },
          colors: {
            background: '#0000',
            particles: ['#fbfcca', '#d7f3fe', '#ffd0a7', '#fffc00', '#ff005c'],
          },
          blending: 'screen',
          opacity: { center: 1, edge: 0 },
          skew: 0.1,
          shapes: ['c', 's'],
        });
      } else {
        console.error('FinisherHeader not found');
      }
    };

    document.body.appendChild(script);
  }, []);
    return <div
        className="finisher-header relative w-full h-[500px]"
        id="finisher-header"
        >
        <div className="absolute top-[0px] left-1/2 transform -translate-x-1/2 w-full max-w-full pt-40 ">
            <div className="flex flex-col justify-center items-center text-center gap-2 text-slate-50">
                <h1 className="font-gilroyBold text-6xl font-semibold">Stay Safe and Informed With Real-Time Emergency Alerts, Always Reliable</h1>
                <p className="font-gilroyLight">Built to protect. Designed to alert. Trusted in every crisis.</p>
                <button className="flex font-gilroy gap-2 mt-8 text-slate-100 font-bold bg-red-500 px-4 py-3 rounded-full">
                    Begin Setup
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
}