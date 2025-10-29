import { Link } from "react-router-dom";

interface NotificationProps {
  title: string;
  message: string;
  date: string;
  link: string | undefined;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  date,
  link,
}) => {
  return (
    <>
      {!link ? (
        <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 ">
          <p className="text-sm">
            <span className="text-black">{title}</span> {message}
          </p>
          <p className="text-xs">{date}</p>
        </div>
      ) : (
        <Link
          className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 "
          to={link || ""}
        >
          <p className="text-sm">
            <span className="text-black">{title}</span> {message}
          </p>
          <p className="text-xs">{date}</p>
        </Link>
      )}
    </>
  );
};

export default Notification;
