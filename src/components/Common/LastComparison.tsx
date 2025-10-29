import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
interface LastComparisonProps {
  difference: number | undefined;
  rising?: boolean;
  comparing: string;
  flipped?: boolean;
}

const LastComparison: React.FC<LastComparisonProps> = ({
  rising,
  difference,
  comparing,
  flipped,
}) => {
  const textColor = flipped
    ? rising
      ? "text-red"
      : "text-success"
    : rising
    ? "text-success"
    : "text-red";
  const fillColor = flipped
    ? rising
      ? "fill-red"
      : "fill-success"
    : rising
    ? "fill-success"
    : "fill-red";
  return (
    <div
      className={`flex gap-1 text-sm font-semibold h-fit leading-3 items-center 3xl:text-lg ${textColor}`}
    >
      {rising && <FaArrowTrendUp className={fillColor} />}
      {!rising && <FaArrowTrendDown className={fillColor} />}
      {difference !== undefined ? Math.abs(difference) : 0}%
      <span className="text-slate-600 place-self-end font-medium">
        {comparing}
      </span>
    </div>
  );
};

export default LastComparison;
