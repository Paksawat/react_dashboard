import Tooltip from "./Tooltip";

interface CardTitleProps {
  title: string;
  tooltip?: React.ReactNode;
}

const CardHeader: React.FC<CardTitleProps> = ({ title, tooltip }) => {
  return (
    <div className="flex items-center">
      <h2 className="text-lg font-semibold text-title 3xl:text-title-lg capitalize">
        {title}
      </h2>
      <Tooltip tooltip={tooltip} />
    </div>
  );
};

export default CardHeader;
