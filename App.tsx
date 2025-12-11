/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Coffee, Leaf, ShieldCheck, MessageSquare, X, Send, Menu, ChevronRight, Star, Heart, ArrowRight, Minus, Plus } from 'lucide-react';
import { Button } from './components/Button';
import { useApiKey } from './hooks/useApiKey';
import ApiKeyDialog from './components/ApiKeyDialog';
import { Product, CartItem, ChatMessage, ViewState } from './types';
import { getTeaExpertResponse } from './services/geminiService';

// --- Data ---

const PRODUCTS: Product[] = [
  {
    id: 'sample-100',
    name: 'Lailpuriya Taster',
    size: '100g',
    price: 150,
    description: 'Perfect for first-timers. Experience the bold aroma of authentic Assam gardens.',
    accentColor: 'from-amber-400 to-amber-600'
  },
  {
    id: 'std-250',
    name: 'Lailpuriya Gold',
    size: '250g',
    price: 350,
    description: 'Our signature blend. Rich, malty, and full-bodied. The ideal daily brew.',
    accentColor: 'from-emerald-400 to-emerald-600'
  },
  {
    id: 'family-500',
    name: 'Lailpuriya Family',
    size: '500g',
    price: 650,
    description: 'Keep the family energized. Processed without preservatives for pure health.',
    accentColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'jumbo-1kg',
    name: 'Estate Jumbo Pack',
    size: '1kg',
    price: 1200,
    description: 'For the true connoisseur. Best value direct from the source.',
    accentColor: 'from-teal-600 to-cyan-800'
  }
];

// --- Components ---

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  setView,
  activeView
}: { 
  cartCount: number, 
  onOpenCart: () => void,
  setView: (v: ViewState) => void,
  activeView: ViewState
}) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-950/80 backdrop-blur-md border-b border-emerald-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <Leaf className="text-emerald-950 fill-emerald-950/20" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">LAILPURIYA</h1>
            <p className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-medium">Assam's Finest</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['home', 'shop', 'about'].map((link) => (
             <button 
                key={link}
                onClick={() => setView(link as ViewState)}
                className={`text-sm font-medium uppercase tracking-widest hover:text-amber-400 transition-colors ${activeView === link ? 'text-amber-400' : 'text-emerald-100'}`}
             >
                {link}
             </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-emerald-100 hover:text-white transition-colors"
          >
            <ShoppingBag />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-emerald-950 text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu className="text-emerald-100" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-800 p-4 absolute w-full">
           <div className="flex flex-col gap-4">
              {['home', 'shop', 'about'].map((link) => (
                  <button 
                    key={link} 
                    onClick={() => {
                        setView(link as ViewState);
                        setMobileMenu(false);
                    }}
                    className="text-left text-emerald-100 uppercase tracking-widest py-2 border-b border-emerald-900"
                  >
                      {link}
                  </button>
              ))}
           </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onShopNow }: { onShopNow: () => void }) => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-emerald-900/80 to-emerald-950 z-10"></div>
         {/* Abstract Green Pattern */}
         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#065f46_0%,transparent_50%)]"></div>
         <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
           <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              🌱 100% Preservative Free
           </div>
           <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              The Soul of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Assam Gardens</span>
           </h1>
           <p className="text-lg text-emerald-100/80 mb-8 max-w-lg leading-relaxed">
              Experience the robust, malty flavor of Lailpuriya. Hand-picked, carefully processed, and delivered straight to your doorstep without a single additive.
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold" onClick={onShopNow}>
                 Shop Collections
              </Button>
              <Button size="lg" variant="outline" className="border-emerald-700 text-emerald-100 hover:bg-emerald-900">
                 Our Story
              </Button>
           </div>
        </div>

        {/* Visual Element */}
        <div className="relative hidden md:block animate-fade-in delay-200">
           <div className="relative w-96 h-[500px] mx-auto">
              {/* Cup & Steam Animation */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                 <div className="relative">
                    <Coffee size={240} strokeWidth={1} className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
                    {/* Steam Particles */}
                    <div className="absolute -top-10 left-1/2 flex gap-4 opacity-70">
                       <div className="w-4 h-4 bg-white/20 rounded-full blur-md animate-steam"></div>
                       <div className="w-6 h-6 bg-white/20 rounded-full blur-md animate-steam delay-75"></div>
                       <div className="w-3 h-3 bg-white/20 rounded-full blur-md animate-steam delay-150"></div>
                    </div>
                 </div>
              </div>
              
              {/* Abstract Leaves */}
              <Leaf className="absolute top-20 right-0 text-emerald-600/40 w-24 h-24 animate-float" />
              <Leaf className="absolute bottom-40 -left-10 text-emerald-600/40 w-16 h-16 animate-float delay-700 rotate-45" />
           </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => (
  <div className="bg-emerald-900/30 border-y border-emerald-800/50 py-20">
     <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
        {[
           { icon: <ShieldCheck size={32} />, title: "No Preservatives", desc: "100% natural processing ensures you drink only what nature intended." },
           { icon: <Leaf size={32} />, title: "Garden Fresh", desc: "Sourced directly from the finest estates in Assam during the prime harvest." },
           { icon: <Heart size={32} />, title: "Health First", desc: "Rich in antioxidants and packed with health benefits for your daily routine." }
        ].map((f, i) => (
           <div key={i} className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-800/50 hover:border-amber-500/30 transition-colors group">
              <div className="w-16 h-16 mx-auto bg-emerald-900 rounded-full flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                 {f.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">{f.title}</h3>
              <p className="text-emerald-200/70">{f.desc}</p>
           </div>
        ))}
     </div>
  </div>
);

const ShopSection = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto" id="shop">
       <div className="text-center mb-16">
          <h2 className="text-amber-500 font-medium tracking-widest uppercase mb-3">The Collection</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Choose Your Brew</h3>
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map(product => (
             <div key={product.id} className="group relative bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-[0_0_30px_rgba(5,150,105,0.2)] flex flex-col">
                {/* Image Placeholder */}
                <div className={`h-48 w-full bg-gradient-to-br ${product.accentColor} relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <span className="font-serif text-6xl font-bold text-white/20 select-none group-hover:scale-110 transition-transform duration-500">
                      {product.size}
                    </span>
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-950 to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                   <div className="mb-4">
                      <h4 className="text-xl font-bold text-white mb-1">{product.name}</h4>
                      <p className="text-emerald-400 font-mono text-sm">{product.size} Pack</p>
                   </div>
                   <p className="text-emerald-200/60 text-sm mb-6 flex-1">
                      {product.description}
                   </p>
                   
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-900">
                      <span className="text-2xl font-bold text-white">₹{product.price}</span>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-emerald-950 hover:bg-amber-400 hover:scale-105 transition-all"
                      >
                         <Plus size={20} />
                      </button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste! I am the Lailpuriya Tea Sommelier. How can I help you choose the perfect tea today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { validateApiKey } = useApiKey();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check API Key
    const hasKey = await validateApiKey();
    if (!hasKey) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getTeaExpertResponse(messages.concat(userMsg), input);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but I'm having trouble connecting to the tea gardens right now. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-500 hover:scale-110 transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-emerald-950 border border-emerald-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'h-[500px] opacity-100 scale-100' : 'h-0 opacity-0 scale-90 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-emerald-900/50 p-4 border-b border-emerald-800 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                 <Coffee size={16} className="text-emerald-900" />
              </div>
              <div>
                 <h4 className="font-bold text-white text-sm">Tea Sommelier</h4>
                 <p className="text-xs text-emerald-400 flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                 </p>
              </div>
           </div>
           <button onClick={() => setIsOpen(false)} className="text-emerald-400 hover:text-white">
              <X size={20} />
           </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
           {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-emerald-900/80 text-emerald-100 rounded-bl-none border border-emerald-800'
                 }`}>
                    {m.text}
                 </div>
              </div>
           ))}
           {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-emerald-900/50 p-3 rounded-2xl rounded-bl-none flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-emerald-800 bg-emerald-900/30">
           <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about brewing or flavors..."
                className="flex-1 bg-emerald-950 border border-emerald-800 rounded-full px-4 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-amber-500 text-emerald-950 rounded-full hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <Send size={18} />
              </button>
           </div>
        </div>
      </div>
    </>
  );
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[], 
  onUpdateQuantity: (id: string, delta: number) => void 
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-emerald-950 border-l border-emerald-800 z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 border-b border-emerald-800 flex items-center justify-between bg-emerald-900/20">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber-500" /> Your Cart
            </h2>
            <button onClick={onClose} className="text-emerald-400 hover:text-white"><X /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
               <div className="text-center py-20 text-emerald-500/50">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
               </div>
            ) : (
               items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-emerald-900/30 p-4 rounded-xl border border-emerald-800/50">
                     <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.accentColor} flex items-center justify-center text-xs font-bold text-white/50`}>
                        {item.size}
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <p className="text-amber-500 font-mono text-sm">₹{item.price}</p>
                     </div>
                     <div className="flex items-center gap-3 bg-emerald-950 rounded-lg p-1 border border-emerald-800">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-emerald-400 hover:text-white"
                        >
                           <Minus size={14} />
                        </button>
                        <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-emerald-400 hover:text-white"
                        >
                           <Plus size={14} />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>

         <div className="p-6 border-t border-emerald-800 bg-emerald-900/20">
            <div className="flex justify-between items-center mb-6">
               <span className="text-emerald-400 uppercase tracking-wider text-sm">Total</span>
               <span className="text-2xl font-bold text-white font-serif">₹{total}</span>
            </div>
            <Button className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-4 h-auto text-lg">
               Checkout Now
            </Button>
         </div>
      </div>
    </>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // API Key handling
  const { showApiKeyDialog, handleApiKeyDialogContinue } = useApiKey();

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  return (
    <div className="min-h-screen bg-emerald-950 font-sans text-emerald-50 selection:bg-amber-500/30">
      <Navbar 
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        setView={setView}
        activeView={view}
      />
      
      {/* API Key Modal */}
      {showApiKeyDialog && (
        <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />
      )}

      {/* Cart Drawer */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
      />

      <main className="animate-fade-in">
        {view === 'home' && (
          <>
            <Hero onShopNow={() => setView('shop')} />
            <Features />
            <div className="py-20 text-center">
              <p className="font-serif italic text-3xl text-emerald-200/50">"The truest taste of Assam"</p>
            </div>
          </>
        )}

        {view === 'shop' && (
          <div className="pt-20">
             <ShopSection onAddToCart={addToCart} />
          </div>
        )}

        {view === 'about' && (
           <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-serif font-bold text-white mb-8">Our Heritage</h1>
              <div className="aspect-video bg-emerald-900 rounded-2xl mb-12 relative overflow-hidden group">
                 {/* Placeholder for Garden Image */}
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950 opacity-80"></div>
                 <Leaf size={120} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-950/20" />
              </div>
              <div className="space-y-6 text-lg text-emerald-200/80 leading-relaxed font-light">
                 <p>
                    Lailpuriya was born from a simple promise: to bring the authentic, unadulterated taste of Assam tea to the world.
                 </p>
                 <p>
                    Nestled in the lush, rain-fed plains of Northeast India, our gardens have been cultivated for generations. We believe in the power of nature. That's why our processing involves absolutely <strong>no preservatives</strong>. From plucking the two leaves and a bud to the final drying process, every step is monitored to ensure purity.
                 </p>
                 <p>
                    When you sip Lailpuriya, you aren't just drinking tea; you are tasting the mist, the soil, and the soul of Assam.
                 </p>
              </div>
              <Button onClick={() => setView('shop')} className="mt-12 bg-amber-500 text-emerald-950 font-bold">
                 Taste the Purity
              </Button>
           </div>
        )}
      </main>

      {/* Chat Bot */}
      <ChatWidget />

      <footer className="bg-emerald-950 border-t border-emerald-900 py-12 text-center text-emerald-600 text-sm">
         <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf size={16} />
            <span className="font-serif font-bold text-emerald-400">LAILPURIYA</span>
         </div>
         <p>© 2024 Lailpuriya Tea Estate. All rights reserved.</p>
         <p className="mt-2">Made with ♥ in Assam.</p>
      </footer>
    </div>
  );
}
