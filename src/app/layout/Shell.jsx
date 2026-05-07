import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import InstallPwaBanner from '../../ui/components/InstallPwaBanner';
import ErrorBoundary from '../../ui/components/ErrorBoundary';

export default function Shell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = (pathname) => {
        if (pathname.includes('/career')) return 'Career Simulator';
        if (pathname.includes('/skill-gap')) return 'Skill Gap Analyzer';
        if (pathname.includes('/upload')) return 'Resume Upload';
        if (pathname.includes('/data')) return 'Data Manager';
        return 'LAKSHYAVED';
    };

    const title = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f6f8f7] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#f6f8f7]/80 dark:bg-[#0b0f19]/80 px-4 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
                <InstallPwaBanner />
            </div>
        </div>
    );
}
