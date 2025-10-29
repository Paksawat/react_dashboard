interface GlobalLoaderProps {
  text?: string;
}

const LoaderGlobal: React.FC<GlobalLoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center align-middle p-2 w-screen h-[100vh] fixed inset-0 bg-white z-9999">
      <div className="min-h-10 min-w-10 max-h-16 max-w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <p className="text-lg">{text}</p>
    </div>
  );
};

export default LoaderGlobal;
