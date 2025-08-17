import { ScaleLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        {/* <ScaleLoader  /> */}
        <ScaleLoader barCount={10} loading radius={60} color="#2563eb" />
      </div>
    </div>
  );
};

export default LoadingPage;
