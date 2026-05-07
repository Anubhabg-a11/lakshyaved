import { Gamepad2, BarChart2, X, Hexagon, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
    const navItems = [
        { id: 'career', path: '/career', icon: Gamepad2, label: 'Career Simulator' },
        { id: 'skillgap', path: '/skill-gap', icon: BarChart2, label: 'Skill Gap Analyzer' },
        { id: 'compare', path: '/compare', icon: Hexagon, label: 'Compare Roles' },
        { id: 'data', path: '/data', icon: Database, label: 'Data Manager' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-white/5 bg-[#121a2a] transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-[#13ec6d]">
                        <Hexagon size={24} fill="currentColor" className="opacity-20" />
                        <span className="text-lg font-extrabold tracking-wide text-white">LAKSHYAVED</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => { if (onClose) onClose(); }}
                            className={({ isActive }) => `
                                w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left
                                ${isActive
                                    ? 'bg-[#13ec6d]/10 text-[#13ec6d]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'text-[#13ec6d]' : 'group-hover:text-[#13ec6d] transition-colors'} />
                                    {item.label}
                                    {isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#13ec6d] shadow-[0_0_8px_rgba(19,236,109,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
