"use client";
import { cn } from "../../../public/libs/utlis";
import Marquee from "../ui/marquee";

const reviews = [
  {
    name: "Anonymous",
    username: "@fardeen14693425",
    body: "What’s one thing you wish people understood about you but rarely do?",
  },
  {
    name: "Anonymous",
    username: "@anonymous_user1",
    body: "If you could change one decision you made in the past year, what would it be and why?",
  },
  {
    name: "Anonymous",
    username: "@anon_quest2",
    body: "What’s something you’re passionate about but haven’t had the chance to pursue yet?",
  },
  {
    name: "Anonymous",
    username: "@hidden_wanderer",
    body: "What advice would you give to someone going through a rough time, based on your own experiences?",
  },
  {
    name: "Anonymous",
    username: "@mystery_mind",
    body: "If you could instantly master any skill, what would it be and how would you use it?",
  },
  {
    name: "Anonymous",
    username: "@secret_inquirer",
    body: "What’s one thing you wish people understood about you but rarely do?",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  username,
  body,
}: {
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300",
        // Modern, appealing design with better colors
        "bg-white/90 border-slate-200/60 shadow-md hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm",
        "dark:bg-slate-800/90 dark:border-slate-600/60 dark:shadow-slate-900/30 dark:hover:shadow-slate-800/40"
      )}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
      
      {/* Content container */}
      <div className="space-y-3">
        {/* Header section */}
        <div className="flex items-center gap-3">
          {/* Minimal avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-col">
            <figcaption className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {name}
            </figcaption>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {username}
            </p>
          </div>
        </div>
        
        {/* Quote content */}
        <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {body}
        </blockquote>
      </div>
      
      {/* Subtle bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700 transform scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left" />
    </figure>
  );
};

export default function MarqueeComponent() {
    return (
      <div className="relative flex h-[400px] max-sm:h-[270px] w-full flex-col items-center justify-center overflow-hidden rounded-xl ">
        
        {/* Top Row - left to right */}
        <Marquee pauseOnHover className="[--duration:20s]" reverse={false}>
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
  
        {/* Bottom Row - right to left */}
        <Marquee pauseOnHover className="[--duration:20s]" reverse>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 dark:w-1/4 w-[12%] bg-gradient-to-r from-white dark:from-black"></div> */}
          {/* <div className="pointer-events-none absolute inset-y-0 right-0 dark:w-1/4 w-[12%] bg-gradient-to-l from-white  dark:from-black"></div> */}
      </div>
    );
  }
  
