import { useEffect, useRef } from 'react';

export default function AutocompleteDropdown({
    items,
    query,
    isOpen,
    onSelect,
    onClose,
    emptyText = "No results found",
    highlightedIndex = -1
}) {
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Because the input is usually separate, we ideally want the parent to handle outside clicks,
            // but we can add a simple check here if the user strictly didn't click inside the dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // If it's the input, parent likely handles it. Otherwise, let parent close.
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen || !query) return null;

    return (
        <ul
            ref={dropdownRef}
            id="autocomplete-dropdown"
            className="absolute z-50 w-full mt-1 bg-white dark:bg-[#121a2a] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-2xl max-h-72 overflow-y-auto"
            role="listbox"
        >
            {items.length > 0 ? (
                items.map((item, idx) => {
                    const isHighlighted = idx === highlightedIndex;

                    return (
                        <li
                            key={item.id}
                            role="option"
                            aria-selected={isHighlighted}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(item);
                            }}
                            className={`cursor-pointer px-4 py-3 border-b border-slate-100 dark:border-[#1e293b] last:border-0 transition-colors ${isHighlighted ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {item.label}
                                    </p>
                                    {item.meta && (
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">{item.meta}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })
            ) : (
                <li className="px-4 py-6 text-center text-sm text-slate-500 whitespace-nowrap">
                    {emptyText}
                </li>
            )}
        </ul>
    );
}
