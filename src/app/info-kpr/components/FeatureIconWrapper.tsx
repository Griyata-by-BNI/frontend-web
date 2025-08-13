import React from "react";

interface FeatureIconWrapperProps {
  children: React.ReactNode;
}

export const FeatureIconWrapper = ({ children }: FeatureIconWrapperProps) => (
  <div className="flex items-center justify-center h-16 w-16 bg-teal-50 rounded-full mb-4">
    {children}
  </div>
);