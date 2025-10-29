interface MetricCardProps {
  children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ children }) => {
  return (
    <div className="border-stroke bg-white shadow-default rounded-xl border flex-grow">
      {children}
    </div>
  );
};
export default MetricCard;
