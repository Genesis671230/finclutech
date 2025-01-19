import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../sheet';
import { ScrollArea } from '../scroll-area';
import logo from '../../../assets/img/logo/finclutechLogo.png';

const NewSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      title: 'Quotations',
      icon: <FileText className="h-5 w-5" />,
      path: '/quotations',
    },
    {
      title: 'Sales Orders',
      icon: <ClipboardList className="h-5 w-5" />,
      path: '/sales-order',
    },
    {
      title: 'Customers',
      icon: <Users className="h-5 w-5" />,
      path: '/customers',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
    },
  ];

  const Sidebar = ({ className, expanded }) => {
    return (
      <div className={cn('relative', className)}>
        <div className={cn(
          'flex h-screen flex-col gap-4 bg-[#1F2A44] text-white',
          expanded ? 'w-72' : 'w-[70px]',
          'transition-all duration-300 ease-in-out'
        )}>
          {/* Logo */}
          <div className={cn(
            'flex h-16 items-center gap-3 border-b border-slate-800 px-3',
            expanded ? 'justify-between' : 'justify-center'
          )}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              {expanded && <span className="text-xl font-bold">Finclutech</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(prev => !prev)}
              className="hidden lg:flex"
            >
              {expanded ? 
                <ChevronLeft className="h-5 w-5" /> : 
                <ChevronRight className="h-5 w-5" />
              }
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2',
                    'transition-all duration-200 ease-in-out',
                    'hover:bg-slate-700',
                    isActive ? 'bg-slate-700 text-white' : 'text-slate-300',
                    !expanded && 'justify-center'
                  )}
                >
                  {item.icon}
                  {expanded && <span>{item.title}</span>}
                </NavLink>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-slate-800 p-3">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-slate-300 hover:text-white',
                !expanded && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5" />
              {expanded && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile sidebar using Sheet component
  const MobileSidebar = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar expanded={true} />
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      <MobileSidebar />
      <Sidebar className="hidden lg:block" expanded={expanded} />
    </>
  );
};

export default NewSidebar; 