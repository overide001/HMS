import { IconCalendarCheck, IconUser, IconHeartbeat, IconLayoutGridFilled, IconMedicineSyrup, IconMoodHeart, IconStethoscope } from '@tabler/icons-react';
import { Avatar, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


const links = [
  
    { label: 'Dashboard', url: '/patient/dashboard', icon: <IconLayoutGridFilled stroke={1.5} />},
    { label: 'Profile', url: '/patient/profile', icon: <IconUser stroke={1.5} />},
    { label: 'Appointments', url: '/patient/appointments', icon: <IconCalendarCheck stroke={1.5} />}
    
];


function Sidebar() {
  const user = useSelector((state: any) => state.user);
  return (
    <aside className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col flex-shrink-0 sticky top-0 left-0">
      
      {/* Brand - Fixed at top */}
      <div className="flex items-center gap-3 px-6 py-6 flex-shrink-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
          <IconHeartbeat size={22} className="text-white" stroke={2} />
        </div>
        <div className="leading-tight">
          <span className="block text-xl font-bold text-neutral-900">
            Pulse
          </span>
          <span className="block text-xs font-medium text-neutral-500">
            Health Admin
          </span>
        </div>
      </div>

      <div className="mx-6 border-t border-neutral-200 flex-shrink-0" />

      {/* Scrollable content area with hidden scrollbar */}
      <div 
        className="flex flex-col gap-1 py-4 flex-1 overflow-y-auto min-h-0"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {/* User Profile */}
        <div className="flex items-center gap-3 px-6 py-5 hover:bg-neutral-50 transition-colors cursor-pointer rounded-lg mx-2 flex-shrink-0">
          <Avatar
            src="/avatar.png"
            alt="User avatar"
            size={42}
            radius="xl"
            className="ring-2 ring-neutral-200"
          />

          <div className="leading-tight flex-1 min-w-0">
            <Text size="sm" fw={600} className="text-neutral-900 truncate">
              {user.name}
            </Text>
            <Text size="xs" className="text-neutral-700 font-mono truncate">
              {user.role}
            </Text>
          </div>
        </div>

        <div className="mx-6 border-t border-neutral-200 flex-shrink-0" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {links.map((link) => (
            <NavLink 
              to={link.url} 
              key={link.url} 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out transform ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-[1.02]' 
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 hover:scale-[1.01]'
                }`
              }
            >
              <span className="transition-transform duration-300 ease-in-out">
                {link.icon}
              </span>
              <span className="transition-all duration-300 ease-in-out">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;