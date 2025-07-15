import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  Award, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  category?: string;
}

const ProfessionalSidebar: React.FC<SidebarProps> = ({ 
  activeItem, 
  onItemClick,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, category: 'main' },
    { id: 'management', label: 'Manajemen Karyawan', icon: Users, category: 'main' },
    { id: 'contracts', label: 'Kontrak Kerja', icon: FileText, category: 'main' },
    { id: 'salary', label: 'Master Gaji', icon: DollarSign, category: 'main' },
    { id: 'kpi', label: 'Penilaian KPI', icon: Award, category: 'main' },
    { id: 'reports', label: 'Laporan & Monitoring', icon: BarChart3, category: 'main' },
    { id: 'settings', label: 'Pengaturan Sistem', icon: Settings, badge: 'BARU', category: 'system' }
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle item click
  const handleItemClick = (itemId: string) => {
    onItemClick(itemId);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className={`fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-300 lg:hidden ${
        isMobileOpen 
          ? 'text-white bg-sidebar-hover' 
          : 'text-sidebar-text bg-sidebar-bg hover:bg-sidebar-hover hover:text-sidebar-text-active'
      }`}
      aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
    >
      {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  // Tooltip component for collapsed state
  const Tooltip: React.FC<{ children: React.ReactNode; text: string; show: boolean }> = ({ 
    children, 
    text, 
    show 
  }) => (
    <div className="relative group">
      {children}
      {show && isCollapsed && !isMobile && (
        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          {text}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );

  // Menu item component
  const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <Tooltip text={item.label} show={true}>
        <button
          onClick={() => handleItemClick(item.id)}
          className={`
            w-full flex items-center transition-all duration-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-sidebar-bg
            ${isCollapsed ? 'justify-center p-4' : 'px-4 py-3 space-x-3'}
            ${isActive 
              ? 'bg-sidebar-active text-sidebar-text-active shadow-lg' 
              : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
            }
            hover:scale-105 transform
          `}
          aria-label={item.label}
          role="menuitem"
        >
          <Icon 
            className={`
              w-6 h-6 flex-shrink-0 transition-transform duration-200
              ${isActive ? 'scale-110' : 'group-hover:scale-105'}
            `} 
          />
          {!isCollapsed && (
            <>
              <span className="font-medium text-base leading-6 truncate">
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </>
          )}
          {isCollapsed && item.badge && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile backdrop */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-sidebar-bg border-r border-sidebar-border text-sidebar-text
          ${isCollapsed ? 'w-16' : 'w-70'}
          ${isMobile ? 'fixed' : 'relative'}
          ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
          h-screen flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${className}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex-shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              R
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold text-sidebar-text-active truncate">Richz-HR</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 flex-shrink-0">
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
            {/* Collapse toggle */}
            {!isMobile && (
              <Tooltip text={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} show={true}>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg transition-all duration-300 text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto custom-scrollbar" role="menu">
          {/* Main Menu */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-4 text-sidebar-text opacity-60">
                MENU UTAMA
              </p>
            )}
            <div className="space-y-2">
              {menuItems.filter(item => item.category === 'main').map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* System Menu */}
          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-4 text-sidebar-text opacity-60">
                SISTEM
              </p>
            )}
            <div className="space-y-2">
              {menuItems.filter(item => item.category === 'system').map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
              <p className="text-xs opacity-90 mb-3">Get access to advanced features</p>
              <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs font-medium py-2 px-3 rounded transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #334155;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #64748b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ProfessionalSidebar;