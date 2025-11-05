import React from 'react';
import { FiInfo } from 'react-icons/fi';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface TooltipProps {
  tooltip?: React.ReactNode;
}

const TooltipIcon: React.FC<TooltipProps> = ({ tooltip }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button">
          <FiInfo className="ml-1 text-gray-500" />
        </button>
      </DialogTrigger>

      <DialogContent className="absolute z-999999">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>{tooltip}</DialogDescription>
        </DialogHeader>

        <DialogClose className="absolute top-4 right-4">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TooltipIcon;
