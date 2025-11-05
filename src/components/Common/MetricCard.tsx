interface MetricCardProps {
  children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ children }) => {
  return (
    <div className="border-stroke bg-white shadow-default rounded-xl border flex-grow p-4 h-full relative min-h-[200px]">
      {children}
    </div>
  );
};
export default MetricCard;
