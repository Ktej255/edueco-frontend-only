import React from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "text" | "avatar" | "table";
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card",
  count = 1,
  className = "",
}) => {
  const baseClass = "animate-pulse bg-gray-700 rounded";

  const variants = {
    card: (
      <div
        className={`border border-gray-800 rounded-xl p-6 space-y-4 ${className}`}
      >
        <div className={`${baseClass} h-6 w-3/4`}></div>
        <div className={`${baseClass} h-4 w-full`}></div>
        <div className={`${baseClass} h-4 w-5/6`}></div>
        <div className={`${baseClass} h-4 w-4/6`}></div>
        <div className="flex gap-2 mt-4">
          <div className={`${baseClass} h-8 w-20`}></div>
          <div className={`${baseClass} h-8 w-20`}></div>
        </div>
      </div>
    ),
    list: (
      <div className={`border-b border-gray-800 py-4 space-y-3 ${className}`}>
        <div className="flex items-center gap-4">
          <div className={`${baseClass} h-12 w-12 rounded-full`}></div>
          <div className="flex-1 space-y-2">
            <div className={`${baseClass} h-4 w-1/3`}></div>
            <div className={`${baseClass} h-3 w-2/3`}></div>
          </div>
        </div>
      </div>
    ),
    text: (
      <div className={`space-y-2 ${className}`}>
        <div className={`${baseClass} h-4 w-full`}></div>
        <div className={`${baseClass} h-4 w-5/6`}></div>
        <div className={`${baseClass} h-4 w-4/6`}></div>
      </div>
    ),
    avatar: (
      <div className={`${baseClass} h-16 w-16 rounded-full ${className}`}></div>
    ),
    table: (
      <div className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${baseClass} h-10`}></div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{variants[variant]}</div>
      ))}
    </>
  );
};
