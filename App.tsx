import React, { useState, useEffect } from 'react';
import { ShoppingBag, BookOpen, Star, Menu, ArrowRight } from 'lucide-react';
import { BOOKS } from './constants';
import { Book, CartItem, SearchState } from './types';
import { getBookRecommendations } from './services/geminiService';
import { CartDrawer } from './components/CartDrawer';
import { AIRecommender } from './components/AIRecommender';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    results: null,
    aiMessage: null
  });

  // Cart Logic
  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...book, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // AI Search Logic
  const handleAISearch = async (query: string) => {
    setSearchState(prev => ({ ...prev, isSearching: true, query }));
    
    const { recommendations, message } = await getBookRecommendations(query, BOOKS);
    
    setSearchState({
      query,
      isSearching: false,
      results: recommendations.length > 0 ? recommendations.map(r => r.bookId) : [],
      aiMessage: message
    });
  };

  const clearSearch = () => {
    setSearchState({
      query: '',
      isSearching: false,
      results: null,
      aiMessage: null
    });
  };

  const displayedBooks = searchState.results 
    ? BOOKS.filter(b => searchState.results!.includes(b.id))
        .sort((a, b) => searchState.results!.indexOf(a.id) - searchState.results!.indexOf(b.id))
    : BOOKS;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('home'); clearSearch(); }}>
              <div className="w-8 h-8 bg-cherry-600 rounded-full flex items-center justify-center text-white">
                <span className="font-serif font-bold text-lg">C</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-stone-900">
                Cherry on Book
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => { setActiveTab('home'); clearSearch(); }}
                className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-cherry-600' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-cherry-600' : 'text-stone-600 hover:text-stone-900'}`}
              >
                About
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-cherry-600 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-cherry-600 rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            {/* Hero */}
            <div className="relative bg-stone-900 text-white py-24 sm:py-32 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507842217121-9e96e47759e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                alt="Library background"
              />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-md">
                  Find the <span className="text-cherry-500 italic">cherry</span> on top <br /> of your reading list.
                </h1>
                <p className="mt-4 text-xl text-stone-200 max-w-2xl mx-auto font-light">
                  A curated collection of timeless classics and modern masterpieces. 
                  Let our AI assistant help you find your next obsession.
                </p>
              </div>
            </div>

            {/* AI Search Section */}
            <div className="bg-stone-50 pb-12">
               <AIRecommender 
                  onSearch={handleAISearch} 
                  isSearching={searchState.isSearching}
                  message={searchState.aiMessage}
                  onClear={clearSearch}
               />
            </div>

            {/* Book Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-900">
                  {searchState.results ? "Recommended for You" : "Bestsellers"}
                </h2>
                <span className="text-stone-500 text-sm">{displayedBooks.length} books found</span>
              </div>

              {displayedBooks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
                  <div className="inline-block p-4 rounded-full bg-stone-100 mb-4">
                    <BookOpen className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-xl font-medium text-stone-900">No books found</h3>
                  <p className="text-stone-500 mt-2">Try adjusting your search terms.</p>
                  <button 
                    onClick={clearSearch}
                    className="mt-6 text-cherry-600 font-medium hover:underline"
                  >
                    View all books
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {displayedBooks.map((book) => (
                    <div key={book.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col">
                      <div className="relative aspect-[2/3] overflow-hidden bg-stone-200">
                        <img 
                          src={book.coverUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-stone-900">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {book.rating}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-cherry-600 uppercase tracking-wide bg-cherry-50 px-2 py-0.5 rounded-full">
                            {book.tags[0]}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-stone-500 text-sm mb-4">{book.author}</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                          <span className="font-bold text-xl text-stone-900">₹{book.price.toFixed(2)}</span>
                          <button 
                            onClick={() => addToCart(book)}
                            className="bg-stone-900 text-white p-2.5 rounded-full hover:bg-cherry-600 hover:scale-110 active:scale-95 transition-all shadow-md group-hover:shadow-lg"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-stone-600">
              <p className="mb-6">
                Welcome to <strong>Cherry on Book</strong>. We believe that finding the right book is like finding the perfect topping for your favorite dessert—it makes everything better.
              </p>
              <p className="mb-6">
                Founded in 2024, we set out to combine the warmth of a traditional independent bookstore with the intelligence of modern technology. Our AI-powered recommendations are designed to understand your mood, not just your purchase history.
              </p>
              <p>
                Whether you're looking for a gripping thriller to keep you awake or a gentle romance to soothe your soul, we're here to help you pick the sweetest fruit from the literary tree.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cherry-600 rounded-full flex items-center justify-center text-white text-xs">
              <span className="font-serif font-bold">C</span>
            </div>
            <span className="font-serif font-bold text-lg text-stone-900">
              Cherry on Book
            </span>
          </div>
          <p className="text-stone-500 text-sm">
            © 2024 Cherry on Book. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-stone-400 hover:text-cherry-600 transition">Twitter</a>
            <a href="#" className="text-stone-400 hover:text-cherry-600 transition">Instagram</a>
            <a href="#" className="text-stone-400 hover:text-cherry-600 transition">GitHub</a>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={() => {
          alert("Thank you for your order! The cherry is on its way.");
          setCart([]);
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}

export default App;