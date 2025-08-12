import { useTheme } from '@/app/contexts/ThemeContext';

export const useThemeToggle = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
  };
}; 