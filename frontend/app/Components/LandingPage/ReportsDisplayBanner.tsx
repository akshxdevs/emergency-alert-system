"use client";
import { cn } from "../../../public/libs/utlis";
import Marquee from "../ui/marquee";

const reviews = [
  {
    name: "City Safety Dept",
    username: "@civic_alerts",
    body: "Severe weather warning issued in your area. Please stay indoors and avoid unnecessary travel.",
  },
  {
    name: "Anonymous Citizen",
    username: "@anon_report1",
    body: "Saw heavy smoke near Elm Street and 5th Avenue. Might be a fire, please check.",
  },
  {
    name: "Neighborhood Watch",
    username: "@neighborhood_watch",
    body: "Suspicious vehicle parked outside for hours near Maple Apartments. License plate: XYZ-1234.",
  },
  {
    name: "Disaster Response Unit",
    username: "@emergency_ops",
    body: "Flash flood risk increased for Riverside District. Evacuate to the nearest shelter immediately.",
  },
  {
    name: "Anonymous Witness",
    username: "@anon_report2",
    body: "Heard loud explosion near the old factory site. Possible gas leak or structural collapse.",
  },
  {
    name: "Local Volunteer Group",
    username: "@helping_hands",
    body: "Urgent: Blood donors needed at Central Hospital after bus accident. Type O- preferred.",
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
      <div className="absolute top-0 left-0 right-0 h-0.5 " />
      
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
  
