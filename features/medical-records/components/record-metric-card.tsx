interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div
      className=" dark:bg-gray-800 rounded-xl border
      border-gray-200 dark:border-gray-700 shadow-sm p-2 flex 
      items-center gap-4 transition-colors duration-300 "
    >
      {/* Icon Section */}
      <div
        className={`${color}  
  rounded-xl 
  shadow-sm p-2 flex items-center gap-4 transition-colors duration-300
  text-white`}
      >
        {icon}
      </div>

      {/* Details Section */}
      <div>
        <h2 className="text-sm text-gray-500 dark:text-white font-semibold">
          {title}
        </h2>
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-100">
          {value}
        </h3>
      </div>
    </div>
  );
}
