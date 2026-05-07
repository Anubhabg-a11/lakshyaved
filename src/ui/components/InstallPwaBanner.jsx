import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPwaBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowBanner(false);
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 border border-[#13ec6d]/30 shadow-[0_0_30px_rgba(19,236,109,0.1)] p-5 rounded-2xl z-50 flex items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-[#13ec6d]/20 p-2.5 rounded-xl text-[#13ec6d] shrink-0 mt-1">
                <Download size={24} />
            </div>
            <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-1.5 flex justify-between pr-4 relative">
                    Install Workspace
                </h4>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed tracking-wide">Install this app for sub-second load times, 100% offline data processing, and absolute zero cloud telemetry.</p>
                <div className="flex gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="bg-[#13ec6d] hover:bg-[#0ea64d] text-[#0b0f19] text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#13ec6d]/20"
                    >
                        Install App
                    </button>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-slate-700 cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-slate-500 hover:text-white transition-colors cursor-pointer absolute top-4 right-4 focus:outline-none">
                <X size={16} />
            </button>
        </div>
    );
}
