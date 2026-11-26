import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Layers, 
  Calendar, 
  Clock, 
  Users, 
  Grid, 
  Zap, 
  Activity, 
  ExternalLink, 
  Link as LinkIcon, 
  Gift, 
  Settings, 
  Search,
  ChevronDown
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const [openMenus, setOpenMenus] = useState<string[]>(['apps', 'insights']);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const navItems = [
    { id: 'event-types', title: 'Event types', path: '/', icon: Layers },
    { id: 'bookings', title: 'Bookings', path: '/bookings', icon: Calendar },
    { id: 'availability', title: 'Availability', path: '/availability', icon: Clock },
    { id: 'teams', title: 'Teams', path: '/teams', icon: Users },
    { 
      id: 'apps', 
      title: 'Apps', 
      path: '/apps', 
      icon: Grid, 
      subItems: [
        { title: 'App store', path: '/apps/store' },
        { title: 'Installed apps', path: '/apps/installed' }
      ]
    },
    { id: 'routing', title: 'Routing', path: '/routing', icon: Activity },
    { id: 'workflows', title: 'Workflows', path: '/workflows', icon: Zap },
    { 
      id: 'insights', 
      title: 'Insights', 
      path: '/insights', 
      icon: Activity, 
      subItems: [
        { title: 'Bookings', path: '/insights/bookings' },
        { title: 'Routing', path: '/insights/routing' },
        { title: 'Router position', path: '/insights/router-position' },
        { title: 'Call history', path: '/insights/call-history' },
        { title: 'Wrong routing', path: '/insights/wrong-routing' }
      ]
    },
  ];

  const bottomItems = [
    { title: 'View public page', icon: ExternalLink, path: '/u/anushka-pal' },
    { title: 'Copy public page link', icon: LinkIcon, path: '#' },
    { title: 'Refer and earn', icon: Gift, path: '/refer' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#101010] text-[#a1a1a1] flex font-inter">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-[#1e1e1e] flex flex-col h-screen sticky top-0">
        <div className="p-5">
          <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1e1e1e] transition-all text-white group bg-[#111] border border-[#1e1e1e]">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                AV
              </div>
              <span className="text-[14px] font-bold truncate text-gray-400 group-hover:text-white tracking-tight">anushka pal</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </div>
            <Search className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.subItems ? (
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] font-bold transition-all hover:bg-[#1e1e1e] hover:text-white group ${
                    openMenus.includes(item.id) ? 'text-white' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <item.icon className="w-4.5 h-4.5" />
                    <span className="tracking-tight">{item.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-white transition-transform ${openMenus.includes(item.id) ? '' : '-rotate-90'}`} />
                </button>
              ) : (
                <Link
                  to={item.path}
                   className={`flex items-center px-3.5 py-2.5 rounded-xl text-[14.5px] font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-[#1e1e1e] text-white'
                      : 'hover:bg-[#1e1e1e] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <item.icon className="w-4.5 h-4.5" />
                    <span className="tracking-tight">{item.title}</span>
                  </div>
                </Link>
              )}
              
              {item.subItems && openMenus.includes(item.id) && (
                <div className="space-y-1 mt-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.title}
                      to={sub.path}
                      className={`flex items-center px-12 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                        isActive(sub.path)
                          ? 'bg-[#1e1e1e] text-white'
                          : 'hover:bg-[#1e1e1e] hover:text-white'
                      }`}
                    >
                      <span className="tracking-tight">{sub.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e1e1e] space-y-1">
          {bottomItems.map((item) => {
            const isCopyLink = item.title === 'Copy public page link';
            const content = (
              <>
                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-white" />
                <span className="tracking-tight text-gray-400 group-hover:text-white">{item.title}</span>
              </>
            );

            if (isCopyLink) {
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/u/anushka-pal`);
                    alert('Public profile link copied!');
                  }}
                  className="w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#1e1e1e] hover:text-white transition-all text-left group"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.path}
                className="w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#1e1e1e] hover:text-white transition-all text-left group"
              >
                {content}
              </Link>
            );
          })}
          <div className="pt-6 px-4 text-[11px] text-[#444] font-bold tracking-tight">
            © 2024 Cal.com, Inc. v.8.2.8-h-5e312e0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-10 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
