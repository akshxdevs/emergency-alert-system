"use client";
import { useTheme } from "@/app/contexts/ThemeContext";

export const ThemeDemo = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className={`p-6 rounded-lg transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-100 border border-gray-600' 
        : 'bg-white text-gray-800 border border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
      }`}>
        Theme System Demo
      </h2>
      
      <div className="space-y-4">
        <div>
          <p className={`mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Current Theme: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Toggle Theme
          </button>
          
          <button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Light
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Dark
          </button>
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            This component automatically adapts to the current theme. The theme is stored in localStorage 
            and persists across page refreshes. You can also use the useThemeToggle hook for more convenience.
          </p>
        </div>
      </div>
    </div>
  );
}; 