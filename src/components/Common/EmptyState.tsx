interface emptyStateProps {
  survey: boolean;
}

const EmptyState: React.FC<emptyStateProps> = ({ survey }) => {
  const subtext = survey ? 'Awaiting survey results' : '';
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <h3 className="text-title-md font-medium text-title">No data</h3>
        {subtext && (
          <p className="text-gray-500 text-sm font-normal mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
