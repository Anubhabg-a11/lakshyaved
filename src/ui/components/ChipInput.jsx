import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import AutocompleteDropdown from './AutocompleteDropdown';
import { getAllSkills, getAllInterests } from '../../core/logic/dataStore';

export default function ChipInput({
    label,
    chips = [],
    onAdd,
    onRemove,
    placeholder = "Add...",
    strict = false,
    suggestions = [],
    onQueryChange,
    error,
    setError,
    validationType = 'skills',
    emptyText = 'No items found',
}) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        setIsOpen(true);
        setHighlightedIndex(-1);
        if (setError) setError('');
        if (onQueryChange) onQueryChange(val);
    };

    const attemptAdd = (val) => {
        const cleanVal = val.trim();
        if (!cleanVal) return;

        if (strict) {
            let matchedItem = null;
            let itemLabel = '';

            if (validationType === 'skills') {
                const allSkills = getAllSkills();
                const matchedSkill = allSkills.find(s =>
                    s.skillName.toLowerCase() === cleanVal.toLowerCase() ||
                    (s.aliases && s.aliases.some(a => a.toLowerCase() === cleanVal.toLowerCase()))
                );
                if (matchedSkill) {
                    matchedItem = matchedSkill;
                    itemLabel = matchedSkill.skillName;
                }
            } else if (validationType === 'interests') {
                const allInterests = getAllInterests();
                const matchedInterest = allInterests.find(i =>
                    i.interestName.toLowerCase() === cleanVal.toLowerCase() ||
                    (i.aliases && i.aliases.some(a => a.toLowerCase() === cleanVal.toLowerCase()))
                );
                if (matchedInterest) {
                    matchedItem = matchedInterest;
                    itemLabel = matchedInterest.interestName;
                }
            }

            if (matchedItem) {
                onAdd(itemLabel);
                setInputValue('');
                setIsOpen(false);
                if (setError) setError('');
                if (onQueryChange) onQueryChange('');
            } else {
                if (setError) setError(`Select an ${validationType === 'interests' ? 'interest' : 'skill'} from suggestions`);
            }
        } else {
            onAdd(cleanVal);
            setInputValue('');
            setIsOpen(false);
            if (setError) setError('');
            if (onQueryChange) onQueryChange('');
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
        } else {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    const selected = suggestions[highlightedIndex];
                    onSelectDropdown(selected);
                } else {
                    attemptAdd(inputValue);
                }
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        }
    };

    const onSelectDropdown = (item) => {
        onAdd(item.label);
        setInputValue('');
        setIsOpen(false);
        setHighlightedIndex(-1);
        if (setError) setError('');
        if (onQueryChange) onQueryChange('');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
            <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-[#13ec6d]/10 text-[#13ec6d] text-sm font-semibold border border-[#13ec6d]/20 flex items-center gap-1 cursor-pointer hover:bg-[#13ec6d]/20 transition-colors"
                        onClick={() => onRemove(chip)}
                    >
                        {chip} <X size={14} />
                    </span>
                ))}

                <div className="relative flex flex-col justify-center">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                setIsOpen(true);
                                if (onQueryChange) onQueryChange(inputValue);
                            }}
                            className={`px-3 py-1.5 pl-8 rounded-lg bg-slate-100 dark:bg-[#1c2533] text-slate-600 dark:text-slate-400 text-sm font-medium border ${error ? 'border-red-500' : 'border-transparent hover:border-slate-600 dark:hover:border-slate-500'} focus:outline-none focus:ring-1 focus:ring-[#13ec6d] transition-colors w-48`}
                            placeholder={placeholder}
                            role="combobox"
                            aria-expanded={isOpen}
                        />
                        <Plus size={14} className="absolute left-2 text-slate-500" />
                    </div>

                    {isOpen && inputValue.trim().length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-64 z-50">
                            <AutocompleteDropdown
                                items={suggestions}
                                query={inputValue}
                                isOpen={isOpen}
                                onSelect={onSelectDropdown}
                                onClose={() => setIsOpen(false)}
                                highlightedIndex={highlightedIndex}
                                emptyText={emptyText}
                            />
                        </div>
                    )}
                </div>
            </div>
            {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
        </div>
    );
}
