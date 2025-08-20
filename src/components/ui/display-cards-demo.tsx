"use client";

import DisplayCards from "./display-cards";
import { Video, Users, GraduationCap } from "lucide-react";

const koboClassCards = [
  {
    icon: <Video className="size-4 text-purple-300" />,
    title: "Live Classes",
    description: "250+ interactive sessions",
    date: "Join now",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Users className="size-4 text-orange-300" />,
    title: "Nigerian Creators",
    description: "100+ skilled instructors",
    date: "Teaching now",
    iconClassName: "text-orange-500",
    titleClassName: "text-orange-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <GraduationCap className="size-4 text-green-300" />,
    title: "Happy Learners",
    description: "4,000+ success stories",
    date: "Growing daily",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[600px] w-full items-center justify-center py-24">
      <div className="w-full max-w-4xl scale-125">
        <DisplayCards cards={koboClassCards} />
      </div>
    </div>
  );
}

export { DisplayCardsDemo };