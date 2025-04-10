"use client"

import { Info } from "lucide-react"; // Import the Info icon from lucide-react
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`flex justify-between items-center p-4 border-t ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-100'
    }`}>
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        © 2025 Glynac. All rights reserved.
      </div>
      <div>
        <Info className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
    </footer>
  );
}