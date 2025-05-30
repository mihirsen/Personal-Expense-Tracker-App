import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DollarSign, Moon, Sun, Download } from "lucide-react";
import CurrencySelector from "./CurrencySelector";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  // State to store the deferred prompt event and control button visibility
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e); // Store the event
      setShowInstallButton(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Clean up the event listener
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We no longer need the prompt. Clear it.
    setDeferredPrompt(null);
    setShowInstallButton(false);

    if (outcome === "accepted") {
      console.log("User accepted the install prompt.");
    } else if (outcome === "dismissed") {
      console.log("User dismissed the install prompt.");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center max-w-6xl gap-3 sm:gap-0">
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              ExpenseTracker
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
          <CurrencySelector />
          {showInstallButton && ( // Conditionally render the install button
            <button
              onClick={handleInstallClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Install app"
            >
              <Download className="h-5 w-5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" />
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            )}
          </button>
          {user && (
            <button onClick={signOut} className="btn btn-outline text-sm ml-2">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
