import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  AlertTriangle,
  Receipt,
  BarChart3,
  Stethoscope,
  Settings,
  LogOut,
  Moon,
  Sun,
  Activity,
  UserCog,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'Patients', path: '/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'Appointments', path: '/appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'Emergency Triage', path: '/emergency', icon: AlertTriangle, roles: ['admin', 'doctor', 'nurse'] },
  { label: 'Doctor Dashboard', path: '/doctor', icon: Stethoscope, roles: ['doctor'] },
  { label: 'Billing', path: '/billing', icon: Receipt, roles: ['admin', 'receptionist'] },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin'] },
  { label: 'AI Symptom Checker', path: '/symptom-checker', icon: Activity, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'] },
  { label: 'Staff Management', path: '/staff', icon: UserCog, roles: ['admin'] },
  { label: 'My Records', path: '/my-records', icon: ClipboardList, roles: ['patient'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-sidebar-accent-foreground">MediCare</h1>
          <p className="text-xs text-sidebar-foreground/70">Hospital System</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-accent-foreground">{user.name}</p>
            <p className="text-xs capitalize text-sidebar-foreground/70">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "animate-scale-in")} />
                  <span>{item.label}</span>
                  {item.path === '/emergency' && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-critical-foreground animate-pulse">
                      3
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <Button
          variant="sidebar"
          size="sm"
          className="w-full justify-start gap-3"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
        
        <NavLink to="/settings">
          <Button
            variant="sidebar"
            size="sm"
            className="w-full justify-start gap-3"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </NavLink>

        <Button
          variant="sidebar"
          size="sm"
          className="w-full justify-start gap-3 text-critical hover:text-critical hover:bg-critical/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
