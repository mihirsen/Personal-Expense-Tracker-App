import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center max-w-6xl text-sm text-gray-600 dark:text-gray-400">
        <div className="text-center sm:text-left mb-2 sm:mb-0">
          © {currentYear} Expense Tracker. All rights reserved.
        </div>
        <div className="text-center sm:text-right">Developed by Mihir Sen</div>
      </div>
    </footer>
  );
};

export default Footer;
