"use client";
import { cn } from "../../../public/libs/utlis";
import Marquee from "../ui/marquee";

const reviews = [
  {
    name: "Anonymous",
    username: "@fardeen14693425",
    body: "What's one thing you wish people understood about you but rarely do?",
  },
  {
    name: "Anonymous",
    username: "@anonymous_user1",
    body: "If you could change one decision you made in the past year, what would it be and why?",
  },
  {
    name: "Anonymous",
    username: "@anon_quest2",
    body: "What's something you're passionate about but haven't had the chance to pursue yet?",
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
    body: "What's one thing you wish people understood about you but rarely do?",
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
        "relative w-48 sm:w-56 md:w-60 lg:w-64 cursor-pointer overflow-hidden rounded-xl border p-3 sm:p-4 md:p-5 transition-all duration-300",
        // Clean, minimal design with site-matching colors
        "bg-white/90 border-slate-200/60 shadow-md hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
      )}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
      
      {/* Content container */}
      <div className="space-y-2 sm:space-y-3">
        {/* Header section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Minimal avatar */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-col">
            <figcaption className="text-xs sm:text-sm font-semibold text-slate-900">
              {name}
            </figcaption>
            <p className="text-xs font-medium text-slate-500">
              {username}
            </p>
          </div>
        </div>
        
        {/* Quote content */}
        <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {body}
        </blockquote>
      </div>
      
      {/* Subtle bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 transform scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left" />
    </figure>
  );
};

export default function MarqueeComponent() {
    return (
      <div className="relative flex h-[300px] sm:h-[350px] md:h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-xl px-4 sm:px-6 md:px-8">
        
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
      </div>
    );
  }
  
