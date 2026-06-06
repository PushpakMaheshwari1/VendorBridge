import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-card px-6">
      {/* Search Bar */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-md border bg-background px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-primary">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search everywhere..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{user?.full_name || 'Guest'}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'No Role'}</span>
          </div>
          
          <button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
            title="Profile"
          >
            <User className="h-5 w-5" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
