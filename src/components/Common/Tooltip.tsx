import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface TooltipProps {
  tooltip?: React.ReactNode;
}

const TooltipIcon: React.FC<TooltipProps> = ({ tooltip }) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onTouchStart={() => setOpen(!open)}
            onKeyDown={(e) => {
              e.preventDefault();
              void (e.key === "Enter" && setOpen(!open));
            }}
          >
            <FiInfo className="ml-1 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="relative z-99">
          <span className="inline-block max-w-80 sm:max-w-125">{tooltip}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipIcon;
