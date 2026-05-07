import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[60vh] p-6">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-400 mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Something Went Wrong</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            An unexpected error occurred. Your data is safe in local storage.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 text-left">
                            <p className="text-xs text-red-400 font-mono break-all">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                        </div>
                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#13ec6d] text-[#0b0f19] rounded-xl font-bold text-sm hover:bg-[#0ea64d] transition-all shadow-lg shadow-[#13ec6d]/20"
                        >
                            <RefreshCw size={16} /> Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
