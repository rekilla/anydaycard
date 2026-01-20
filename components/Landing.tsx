import React, { useState } from 'react';
import { ArrowRight, Heart, Sparkles, Mail, CheckCircle2, Menu, X, Star, Calendar, PenTool } from 'lucide-react';
import { Button } from './Button';
import { AuthModal } from './AuthModal';

interface LandingProps {
  onStart: () => void;
  onLogin: (email: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={(email) => {
          setIsAuthOpen(false);
          onLogin(email);
        }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-brand-600 font-serif font-bold text-2xl cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Mail className="fill-brand-100" />
            AnyDayCard
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">How it works</button>
            <button onClick={() => scrollToSection('features')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Pricing</button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button onClick={() => setIsAuthOpen(true)} className="text-slate-900 font-medium hover:text-brand-600 transition-colors">Log in</button>
            <Button size="sm" onClick={onStart}>Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full px-6 py-6 flex flex-col gap-4 shadow-xl">
             <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 font-medium text-slate-600">How it works</button>
             <button onClick={() => scrollToSection('features')} className="text-left py-2 font-medium text-slate-600">Features</button>
             <button onClick={() => scrollToSection('pricing')} className="text-left py-2 font-medium text-slate-600">Pricing</button>
             <hr className="border-slate-100" />
             <button onClick={() => setIsAuthOpen(true)} className="text-left py-2 font-medium text-slate-900">Log in</button>
             <Button className="w-full justify-center" onClick={onStart}>Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-8 animate-fade-in-up border border-brand-100">
            <Sparkles size={16} /> The AI Greeting Card Platform
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Thoughtful cards, <br/>
            <span className="text-brand-600 italic">written by AI,</span> <br/>
            sent by you.
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Turn your specific memories and inside jokes into a one-of-a-kind physical card. No login required to start.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="px-8 shadow-xl shadow-brand-200" onClick={onStart}>
              Quick Create <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsAuthOpen(true)}>
              Create Account
            </Button>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="mt-4 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            See how it works
          </button>
          
          <p className="mt-6 text-sm text-slate-400 flex items-center justify-center lg:justify-start gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> No credit card required to draft
          </p>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-200 to-indigo-200 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <div className="aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1490810277975-e643497aa9d1?q=80&w=1000&auto=format&fit=crop" 
                  alt="Greeting Card Example" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-serif text-2xl font-medium leading-snug">
                    "Happy Birthday Sarah! I still remember when we got lost in IKEA..."
                  </p>
                </div>
             </div>
             <div className="mt-4 flex justify-between items-center px-2">
                <div className="text-sm font-medium text-slate-900">Premium 100lb Matte Cardstock</div>
                <div className="flex text-brand-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by thoughtful people everywhere</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <h3 className="text-xl font-serif font-bold text-slate-800">Vogue</h3>
             <h3 className="text-xl font-serif font-bold text-slate-800">TheNewYorkTimes</h3>
             <h3 className="text-xl font-serif font-bold text-slate-800">Wired</h3>
             <h3 className="text-xl font-serif font-bold text-slate-800">ProductHunt</h3>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">How It Works</h2>
           <p className="text-xl text-slate-600 max-w-2xl mx-auto">We've simplified the process of sending a meaningful card down to just a few clicks.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
               <PenTool size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Share the Details</h3>
            <p className="text-slate-600 leading-relaxed">
              Answer a few fun questions about your relationship, the occasion, and shared memories. No login needed.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
               <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. AI Crafts Magic</h3>
            <p className="text-slate-600 leading-relaxed">
              Our advanced AI generates a completely unique message and custom artwork based on your inputs. No templates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
               <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. We Print & Ship</h3>
            <p className="text-slate-600 leading-relaxed">
              We print your creation on premium stock and mail it directly to your recipient. We only ask for email at checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Features Split Section */}
      <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <h2 className="text-4xl font-serif font-bold mb-6">Never worry about <br/>writer's block again.</h2>
             <div className="space-y-8">
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                    <Sparkles size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Infinite Creativity</h3>
                   <p className="text-slate-400 leading-relaxed">Whether you want funny, sentimental, or weird, our AI adapts to your vibe perfectly.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Calendar size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">For Every Occasion</h3>
                   <p className="text-slate-400 leading-relaxed">Birthdays, anniversaries, or just because. We support all relationship types including "it's complicated".</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Heart size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Truly Personal</h3>
                   <p className="text-slate-400 leading-relaxed">The card will reference that specific road trip or inside joke you share, making it a keepsake.</p>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="lg:w-1/2 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/20 rounded-full filter blur-[80px]"></div>
             <div className="relative grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 transform translate-y-8">
                   <div className="h-4 w-20 bg-white/20 rounded mb-4"></div>
                   <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
                   <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
                   <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
                   <div className="mt-4 aspect-square bg-brand-500/20 rounded-lg"></div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                   <div className="aspect-square bg-indigo-500/20 rounded-lg mb-4"></div>
                   <div className="h-4 w-20 bg-white/20 rounded mb-4"></div>
                   <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
                   <div className="h-3 w-1/2 bg-white/10 rounded mb-2"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto text-center">
         <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
         <p className="text-xl text-slate-600 mb-16">Choose what fits how often you send.</p>

         <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
              <h3 className="text-slate-500 font-bold tracking-widest uppercase mb-2">Single Card</h3>
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-5xl font-bold text-slate-900">$12</span>
                <span className="text-slate-400">/ card</span>
              </div>
              <p className="text-slate-600 mb-8">Perfect for the spontaneous moment.</p>
              <ul className="text-left space-y-4 mb-8">
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Unlimited AI text generations</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Custom AI cover art</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Standard shipping included</span>
                 </li>
              </ul>
              <Button size="lg" className="w-full" onClick={onStart}>Create Your Card</Button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-brand-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <h3 className="text-slate-500 font-bold tracking-widest uppercase mb-2">Monthly</h3>
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-5xl font-bold text-slate-900">$29</span>
                <span className="text-slate-400">/ month</span>
              </div>
              <p className="text-slate-600 mb-8">3 cards per month, plus priority printing.</p>
              <ul className="text-left space-y-4 mb-8">
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>3 cards/month included</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Priority printing queue</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Member-only design styles</span>
                 </li>
              </ul>
              <Button size="lg" className="w-full" onClick={onStart}>Start subscription</Button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
              <h3 className="text-slate-500 font-bold tracking-widest uppercase mb-2">Teams</h3>
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-4xl font-bold text-slate-900">Custom</span>
              </div>
              <p className="text-slate-600 mb-8">For companies sending client or employee notes.</p>
              <ul className="text-left space-y-4 mb-8">
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Shared address books</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Approval workflows</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-brand-500" />
                   <span>Volume billing</span>
                 </li>
              </ul>
              <Button size="lg" variant="outline" className="w-full" onClick={onStart}>Contact sales</Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-2 text-brand-600 font-serif font-bold text-xl mb-4">
                 <Mail className="fill-brand-100" size={20} />
                 AnyDayCard
               </div>
               <p className="text-slate-500 text-sm">
                 Making the world a little more thoughtful, one card at a time.
               </p>
            </div>
            
            <div>
               <h4 className="font-bold text-slate-900 mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-brand-600">Features</a></li>
                 <li><a href="#" className="hover:text-brand-600">Pricing</a></li>
                 <li><a href="#" className="hover:text-brand-600">Examples</a></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold text-slate-900 mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-brand-600">About Us</a></li>
                 <li><a href="#" className="hover:text-brand-600">Contact</a></li>
                 <li><a href="#/privacy" className="hover:text-brand-600">Privacy Policy</a></li>
                 <li><a href="#/terms" className="hover:text-brand-600">Terms of Service</a></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
               <div className="flex gap-4">
                  <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} AnyDayCard. All rights reserved.
         </div>
      </footer>
    </div>
  );
};
