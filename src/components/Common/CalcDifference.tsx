interface CalcDifferenceProps {
  oldValue: number;
  newValue: number;
}

const CalcDifference: React.FC<CalcDifferenceProps> = ({
  oldValue,
  newValue,
}) => {
  const difference = Math.abs(newValue - oldValue);
  return difference;
};

export default CalcDifference;
