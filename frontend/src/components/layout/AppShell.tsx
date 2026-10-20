import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, NAV_ITEMS } from './Sidebar';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { ContentContainer } from '../common/ContentContainer';
import { cn } from '@/utils/cn';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('commerceiq_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem('commerceiq_sidebar_collapsed', String(collapsed));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [collapsed]);

  // Determine current page title from active route
  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname);
  const pageTitle = currentNav ? currentNav.label : 'CommerceIQ Analytics';

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans relative selection:bg-brand-violet/30 selection:text-brand-cyan">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none radial-glow z-0" aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-40 z-0" aria-hidden="true" />

      {/* Persistent Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Layout Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out z-10',
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Sticky Glass Top Navigation */}
        <TopNav
          pageTitle={pageTitle}
          onOpenMobile={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        {/* Viewport Content Container */}
        <main id="main-content" tabIndex={-1} className="flex-1 pt-16 outline-none">
          <ContentContainer maxWidth="wide" className="flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </ContentContainer>
        </main>
      </div>
    </div>
  );
};
