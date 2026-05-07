import { useEffect, useState } from 'react';
import { Hexagon } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Start fading out after 2 seconds
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        // Call onComplete after fade out animation (0.5s)
        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div 
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] transition-opacity duration-500 ease-in-out ${
                isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            <div className="relative flex flex-col items-center">
                {/* Glowing background effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#13ec6d] rounded-full blur-[60px] opacity-20 animate-pulse"></div>
                
                {/* Logo Icon */}
                <div className="relative text-[#13ec6d] mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                    <Hexagon size={80} fill="currentColor" className="opacity-20 absolute top-0 left-0" />
                    <Hexagon size={80} className="relative z-10 drop-shadow-[0_0_15px_rgba(19,236,109,0.5)]" />
                </div>
                
                {/* Logo Text */}
                <div className="overflow-hidden">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-white animate-fade-up">
                        LAKSHYA<span className="text-[#13ec6d]">VED</span>
                    </h1>
                </div>
                
                {/* Loading indicator */}
                <div className="mt-12 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#13ec6d] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#13ec6d] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#13ec6d] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>

            {/* Custom animations inside style tag for ease of use without tailwind config changes */}
            <style>{`
                @keyframes fade-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-up {
                    animation: fade-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
