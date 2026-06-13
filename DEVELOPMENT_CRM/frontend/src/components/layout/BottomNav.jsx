/* ─────────────────────────────────────────────────────────────────────────
   Bottom Navigation Bar for Mobile
   Replaces sidebar on mobile with fixed bottom navigation
   ───────────────────────────────────────────────────────────────────────── */

import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarCheck, ClipboardList, CalendarClock, FileText, UserCircle } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'today', label: 'Today', icon: CalendarCheck, path: '/field/today' },
    { id: 'jobs', label: 'My Jobs', icon: ClipboardList, path: '/field/jobs' },
    { id: 'appointments', label: 'Appointments', icon: CalendarClock, path: '/field/appointments' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/field/reports' },
    { id: 'profile', label: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/field/today') {
      return location.pathname === '/field/today' || location.pathname === '/field';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'var(--safe-bottom)',
        height: 'calc(var(--bottom-nav-height) + var(--safe-bottom))',
      }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors`}
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
