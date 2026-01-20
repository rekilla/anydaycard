import React from 'react';
import { Calendar, CheckCircle, Clock, Mail, PencilRuler, Plus, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from './Button';
import { User, GeneratedCard, RecipientProfile, Order, NotificationItem } from '../types';

interface DashboardProps {
  user: User | null;
  recipients: RecipientProfile[];
  history: GeneratedCard[];
  orders: Order[];
  notifications: NotificationItem[];
  onCreateNew: () => void;
  onSendToRecipient: (recipientId: string) => void;
  onResumeDraft?: (card: GeneratedCard) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  recipients, 
  history, 
  orders,
  notifications,
  onCreateNew, 
  onSendToRecipient,
  onResumeDraft
}) => {
  const scheduledOrders = orders.filter(order => order.status === 'scheduled' || order.scheduledDate);
  const queuedNotifications = notifications.filter(notification => notification.status === 'queued');
  const draftCards = history.filter(card => card.status === 'draft');
  const recentHistory = history.slice(0, 4);

  const displayName = user?.email ? user.email.split('@')[0] : 'there';
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 -right-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-24 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl"></div>
        <nav className="relative z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 text-brand-600 font-serif font-bold text-xl cursor-pointer" onClick={() => window.location.hash = "#/"}>
              AnyDayCard
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <CheckCircle size={12} className="text-emerald-500" /> {scheduledOrders.length} scheduled
              </button>
              <button className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                {user?.email ? user.email.substring(0, 2).toUpperCase() : <UserIcon size={16} />}
              </button>
              <button className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-brand-600">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
          <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <Sparkles size={14} className="text-brand-500" /> Dashboard
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-serif font-bold leading-tight">
                Welcome back, {displayName}.
                <span className="block text-slate-500 text-2xl md:text-3xl font-semibold mt-3">Make today a little more thoughtful.</span>
              </h1>
              <p className="mt-4 text-slate-500 max-w-xl">
                Track your cards, plan sends ahead of time, and keep your favorite recipients close.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={onCreateNew} className="px-8">
                  Create a card
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Set up calendar
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Total cards</div>
                  <div className="text-2xl font-bold mt-2">{history.length}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Scheduled</div>
                  <div className="text-2xl font-bold mt-2">{scheduledOrders.length}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Drafts</div>
                  <div className="text-2xl font-bold mt-2">{draftCards.length}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Queued alerts</div>
                  <div className="text-2xl font-bold mt-2">{queuedNotifications.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl shadow-slate-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
                  <h2 className="text-2xl font-serif font-semibold mt-3">{displayName}</h2>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <UserIcon size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-brand-200" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PencilRuler size={16} className="text-brand-200" />
                  <span>{recipients.length} saved recipients</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-brand-200" />
                  <span>Last activity {history[0] ? new Date(history[0].createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full border-white/30 text-white hover:border-white/60">
                  Profile settings
                </Button>
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="bg-white/90 border border-slate-200/70 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar size={18} className="text-brand-500" /> Calendar queue
                </h3>
                <button className="text-xs font-semibold uppercase tracking-widest text-brand-600">Manage</button>
              </div>
              <div className="space-y-4">
                {scheduledOrders.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    No scheduled sends yet. Pick a date to make it effortless.
                  </div>
                )}
                {scheduledOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">For {order.recipientName}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : 'Date TBD'}
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Scheduled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 border border-slate-200/70 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle size={18} className="text-brand-500" /> Recent cards
                </h3>
                <button className="text-xs font-semibold uppercase tracking-widest text-brand-600">View all</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {recentHistory.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    No cards yet. Start one in minutes.
                  </div>
                )}
                {recentHistory.map(card => (
                  <div
                    key={card.id}
                    onClick={() => card.status === 'draft' && onResumeDraft ? onResumeDraft(card) : null}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100">
                        <img src={card.image} alt="Card preview" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">For {card.recipientName || 'Friend'}</div>
                        <div className="text-xs text-slate-500">{new Date(card.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">{card.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="bg-white/90 border border-slate-200/70 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserIcon size={18} className="text-brand-500" /> Favorite recipients
                </h3>
                <button className="text-xs font-semibold uppercase tracking-widest text-brand-600">Add</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {recipients.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 w-full">
                    Save a recipient to keep them handy.
                  </div>
                )}
                {recipients.slice(0, 6).map(recipient => (
                  <button
                    key={recipient.id}
                    onClick={() => onSendToRecipient(recipient.id)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:border-brand-300 hover:text-brand-600"
                  >
                    <span className="font-semibold">{recipient.name}</span>
                    <span className="text-xs text-slate-400">{recipient.relationshipType}</span>
                  </button>
                ))}
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600"
                >
                  <Plus size={14} /> New recipient
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-orange-400 text-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Start a new card fast</h3>
              <p className="text-sm text-white/80">
                Keep the momentum. Pick a vibe and we will prefill the writing flow.
              </p>
              <div className="mt-5 space-y-3">
                {['Just to say hi', 'Small victory', 'Rough week'].map(label => (
                  <button
                    key={label}
                    onClick={onCreateNew}
                    className="w-full flex items-center justify-between rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/30"
                  >
                    {label}
                    <span className="text-xs uppercase tracking-widest">Start</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
