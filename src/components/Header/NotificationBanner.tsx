import { BiSolidMessageSquareError } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

const message = "This is a notification, message or announcement ";

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;
  return (
    <div className="flex space-between py-3 px-4 items-center bg-[#CFE9FF] rounded-lg flex-grow">
      <BiSolidMessageSquareError className="text-company text-3xl" />
      <p className="mx-2 text-base">{message}</p>
      <IoClose className="ml-20 cursor-pointer" onClick={handleClose} />
    </div>
  );
};

export default NotificationBanner;
