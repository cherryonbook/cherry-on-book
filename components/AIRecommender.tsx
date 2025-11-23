import React, { useState } from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';

interface AIRecommenderProps {
  onSearch: (query: string) => Promise<void>;
  isSearching: boolean;
  message: string | null;
  onClear: () => void;
}

export const AIRecommender: React.FC<AIRecommenderProps> = ({ 
  onSearch, 
  isSearching, 
  message,
  onClear
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto -mt-8 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-cherry-100/50">
        <div className="flex items-center gap-2 mb-4 text-cherry-600 font-medium text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Cherry Picked Recommendations</span>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="I'm in the mood for a heartwarming mystery..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-lg rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-cherry-500/50 focus:border-cherry-500 transition-all placeholder:text-stone-400"
          />
          <button 
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-cherry-600 text-white rounded-lg flex items-center justify-center hover:bg-cherry-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </form>

        {message && (
          <div className="mt-6 bg-cherry-50 rounded-xl p-4 flex items-start gap-4 animate-fadeIn">
            <div className="bg-white p-2 rounded-full shadow-sm text-cherry-600 flex-shrink-0">
               <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-stone-800 font-medium leading-relaxed">
                {message}
              </p>
              <button 
                onClick={() => {
                  setQuery('');
                  onClear();
                }}
                className="text-xs font-semibold text-cherry-600 hover:text-cherry-800 mt-2 uppercase tracking-wide"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
