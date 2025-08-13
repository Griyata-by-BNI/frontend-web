interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-teal-600 text-white shadow-sm"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}