import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const JobSearchFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Internal state for debouncing the search input
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const activeStatus = searchParams.get('status') || '';
    const activeDate = searchParams.get('date_applied') || '';

    // Calculate if any filters are currently active (excluding pagination)
    const hasActiveFilters = searchValue !== '' || activeStatus !== '' || activeDate !== '';

    // 1. Debounce Search Input
    useEffect(() => {
        const handler = setTimeout(() => {
            const currentUrlSearch = searchParams.get('search') || '';
            if (searchValue !== currentUrlSearch) {
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    if (searchValue) {
                        params.set('search', searchValue);
                    } else {
                        params.delete('search');
                    }
                    params.set('page', '1'); // Reset pagination on search change
                    return params;
                });
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchValue, searchParams, setSearchParams]);

    // Update internal search value if URL changes externally (e.g. going back in history)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (searchValue !== urlSearch) {
            setSearchValue(urlSearch);
        }
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.set('page', '1'); // Reset to page 1 heavily strictly
            return params;
        });
        // We do *not* close the filter modal immediately so the user can select multiple filters
    };

    const handleClearAll = () => {
        setSearchValue('');
        setSearchParams(new URLSearchParams()); // Erases everything including page/per_page, reverting to defaults
    };

    return (
        <div className="flex items-center gap-3">
            {/* SEARCH INPUT */}
            <div className={`relative group flex-1 rounded-xl transition-all duration-300 ${searchParams.get('search') ? 'ring-2 ring-brand ring-offset-2 ring-offset-workspace shadow-lg shadow-brand/20' : ''}`}>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search roles, companies..."
                    className={`w-full sm:w-64 text-text-main pl-10 pr-10 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-brand/30 transition-all placeholder:opacity-40 ${searchParams.get('search') ? 'bg-brand/10 border-2 border-brand/40 font-medium' : 'bg-surface border border-surface-border'
                        }`}
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${searchParams.get('search') ? 'text-brand opacity-100' : 'text-text-main opacity-40 group-focus-within:opacity-100 group-focus-within:text-brand'}`}>
                    🔍
                </div>
                <AnimatePresence>
                    {searchValue && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                                setSearchValue('');
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    params.delete('search');
                                    params.set('page', '1');
                                    return params;
                                });
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-text-main/10 text-text-main/60 hover:bg-rose-500 hover:text-white transition-all duration-200 focus:outline-none"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </motion.button>
                    )}
                </AnimatePresence>
                {searchParams.get('search') && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-brand rounded-full border-2 border-workspace shadow-sm shadow-brand/20 animate-pulse pointer-events-none"></span>
                )}
            </div>

            {/* FILTER DROPDOWN TRIGGER */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${isFilterOpen || activeStatus || activeDate
                        ? 'bg-brand/10 border-brand/30 text-brand'
                        : 'bg-surface border-surface-border text-text-main hover:border-text-main/20'
                        }`}
                >
                    <span>⚙️ Filters</span>
                    {(activeStatus || activeDate) && (
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-brand rounded-full border-2 border-workspace shadow-sm shadow-brand/20"></span>
                    )}
                </button>

                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, width: 0, scale: 0.8 }}
                            animate={{ opacity: 1, width: 'auto', scale: 1 }}
                            exit={{ opacity: 0, width: 0, scale: 0.8 }}
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold whitespace-nowrap"
                        >
                            ✕ Clear
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-surface border-l border-surface-border shadow-2xl z-50 p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-text-main tracking-tight">Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} className="text-text-main opacity-50 hover:opacity-100 p-2 transition-opacity">
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-8 flex-1 overflow-y-auto pr-2">
                                <div>
                                    <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-3">
                                        Job Status
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['applied', 'interviewing', 'offered', 'rejected'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleFilterChange('status', activeStatus === status ? '' : status)}
                                                className={`py-2 px-2 text-sm font-medium rounded-lg border capitalize transition-all ${activeStatus === status
                                                    ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
                                                    : 'bg-workspace border-surface-border text-text-main hover:border-brand/30'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-3">
                                        Date Applied
                                    </label>
                                    <select
                                        value={activeDate}
                                        onChange={(e) => handleFilterChange('date_applied', e.target.value)}
                                        className="w-full bg-workspace border border-surface-border text-text-main p-3 rounded-xl outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition-all cursor-pointer"
                                    >
                                        <option value="">Any Time</option>
                                        <option value="last_24h">Past 24 Hours</option>
                                        <option value="last_week">Past Week</option>
                                        <option value="last_month">Past Month</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-surface-border">
                                <button
                                    onClick={handleClearAll}
                                    disabled={!hasActiveFilters}
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${hasActiveFilters
                                        ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-500/20'
                                        : 'bg-workspace text-text-main opacity-40 cursor-not-allowed border border-surface-border'
                                        }`}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
