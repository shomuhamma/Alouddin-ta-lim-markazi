
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { searchableData, SearchableItem } from '../lib/search-data';
import { SearchIcon, XIcon } from './Icons';

interface SearchPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchableItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Auto-focus input when opened
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery(''); // Reset query on close
        }
    }, [isOpen]);

    // Debounce search input
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const handler = setTimeout(() => {
            const searchTerm = query.toLowerCase();
            
            const scoredResults = searchableData
                .filter(item => item.isActive)
                .map(item => {
                    let score = 0;
                    const lowerCaseTitle = item.title.toLowerCase();
                    const lowerCaseKeywords = item.keywords.join(' ').toLowerCase();
                    const lowerCaseDescription = item.description.toLowerCase();

                    if (lowerCaseTitle.includes(searchTerm)) score += 3;
                    if (lowerCaseKeywords.includes(searchTerm)) score += 2;
                    if (lowerCaseDescription.includes(searchTerm)) score += 1;

                    return { ...item, score };
                })
                .filter(item => item.score > 0);

            scoredResults.sort((a, b) => b.score - a.score);
            setResults(scoredResults);

        }, 200);

        return () => clearTimeout(handler);
    }, [query]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleResultClick = (targetId: string) => {
        onClose();
        if (targetId === 'vakansiyalar') {
            // This is a special case to open the modal.
            // A more robust solution might use a global state manager (like Context)
            // But for this project, a custom event is a clean way to communicate.
            window.dispatchEvent(new CustomEvent('open-vacancies-modal'));
            return;
        }

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight class and remove after animation
            targetElement.classList.add('highlight-search-result');
            setTimeout(() => {
                targetElement.classList.remove('highlight-search-result');
            }, 2000);
        }
    };

    const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
        if (!highlight) return <>{text}</>;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <strong key={i} className="text-orange-600 bg-orange-100">{part}</strong>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    <div className="p-4">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Qidirish... (masalan: matematika)"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 pt-0 max-h-96 overflow-y-auto">
                        {query.length > 1 && results.length > 0 && (
                            <ul className="divide-y divide-gray-200">
                                {results.map((result) => (
                                    <li key={result.targetId} onClick={() => handleResultClick(result.targetId)} className="p-4 hover:bg-gray-50 cursor-pointer rounded-md">
                                        <div className="flex items-center justify-between">
                                            <p className="text-md font-semibold text-gray-800">
                                                <HighlightedText text={result.title} highlight={query} />
                                            </p>
                                            <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded-full">{result.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <HighlightedText text={result.description} highlight={query} />
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {query.length > 1 && results.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                <p>Hech qanday natija topilmadi</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPanel;