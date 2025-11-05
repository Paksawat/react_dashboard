export const CardSkeltonLoader = () => {
  return (
    <div className="border-stroke bg-white shadow-default rounded-xl border flex-grow p-4 h-full relative">
      <div className="bg-gray-200 shadow-default rounded-xl border flex-grow p-4 h-full relative animate-pulse">
        {/* Optional: Add inner shapes to mimic chart and text */}
        <div className="w-full h-32 bg-gray-300 rounded-md mb-4" />
        <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-2" />
        <div className="w-1/2 h-6 bg-gray-300 rounded-md" />
      </div>
    </div>
  );
};
