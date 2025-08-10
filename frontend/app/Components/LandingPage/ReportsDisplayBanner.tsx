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
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-200",
        // light mode
        "border-gray-300 bg-white hover:shadow-md hover:-translate-y-1",
        // dark mode
        "dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:border-gray-500"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm max-sm:text-xs font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm max-sm:text-xs text-gray-700 dark:text-gray-300">
        {body}
      </blockquote>
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
  
