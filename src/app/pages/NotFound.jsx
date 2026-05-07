import { Link } from 'react-router-dom';
import { Hexagon, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[70vh] p-6">
            <div className="text-center max-w-md">
                <div className="relative inline-block mb-8">
                    <Hexagon size={80} className="text-slate-800" />
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-slate-500">
                        404
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Page Not Found</h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/career"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#13ec6d] text-[#0b0f19] rounded-xl font-bold text-sm hover:bg-[#0ea64d] transition-all shadow-lg shadow-[#13ec6d]/20"
                >
                    <Home size={16} /> Go to Career Simulator
                </Link>
            </div>
        </div>
    );
}
