interface emptyStateProps {
  survey: boolean;
}

const EmptyState: React.FC<emptyStateProps> = ({ survey }) => {
  const subtext = survey ? "Awaiting survey results" : "";
  return (
    <div className="w-full flex flex-col justify-around items-center h-full">
      <h3 className="text-title-md font-medium text-title">No data</h3>
      <p className="text-gray-500 text-sm font-normal">{subtext}</p>
    </div>
  );
};

export default EmptyState;
