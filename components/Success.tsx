import React, { useState } from 'react';
import { CheckCircle, Truck, BellRing, Link, Save, UserCircle } from 'lucide-react';
import { Button } from './Button';
import { User, Order, NotificationItem } from '../types';

interface SuccessProps {
  user: User | null;
  order: Order | null;
  notifications: NotificationItem[];
  onCreateAnother: () => void;
  /** Recipient name for save profile prompt */
  recipientName?: string;
  /** Callback when user toggles save profile */
  onSaveProfile?: (save: boolean) => void;
}

const NOTIFICATION_LABELS: Record<NotificationItem['type'], string> = {
  receipt: 'Order receipt sent',
  reminder: '"We got this" reminder email',
  shipping: 'Shipping confirmation email',
  delivery: 'Delivery confirmation email',
};

export const Success: React.FC<SuccessProps> = ({
  user,
  order,
  notifications,
  onCreateAnother,
  recipientName,
  onSaveProfile,
}) => {
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [saveProfileChecked, setSaveProfileChecked] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfileToggle = () => {
    const newValue = !saveProfileChecked;
    setSaveProfileChecked(newValue);
    if (newValue && onSaveProfile) {
      onSaveProfile(true);
      setProfileSaved(true);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-slate-100">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            No recent order found.
          </h2>
          <p className="text-slate-600 mb-6">
            Head back to your dashboard to create a new card.
          </p>
          <Button onClick={() => window.location.hash = '#/dashboard'} className="w-full">
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isScheduled = Boolean(order.scheduledDate);
  const arrivalDate = order.deliveryEstimate
    ? new Date(order.deliveryEstimate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : null;

  const notificationRows = notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    status: notification.status,
    label: NOTIFICATION_LABELS[notification.type],
    timeLabel: notification.status === 'sent' ? 'Sent' : 'Queued',
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-slate-100 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
          {isScheduled ? 'Scheduled perfectly.' : 'Order Confirmed!'}
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {isScheduled && arrivalDate
            ? `We'll print and mail it to arrive by ${arrivalDate}.`
            : 'Your card is being printed with love.'}
        </p>

        <div className="bg-slate-50 p-6 rounded-xl mb-8 text-left border border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BellRing size={12} /> What happens next
          </h4>
          <ul className="space-y-4 text-sm">
            {notificationRows.length === 0 && (
              <li className="text-slate-500">No updates scheduled yet.</li>
            )}
            {notificationRows.map((notification) => (
              <li key={notification.id} className="flex gap-3 items-center text-slate-700">
                <div className={`w-2 h-2 rounded-full ${notification.status === 'sent' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="flex-1">{notification.label}</span>
                <span className="text-slate-400 text-xs">{notification.timeLabel}</span>
              </li>
            ))}
          </ul>
        </div>

        {order.trackingNumber && (
          <div className="bg-white p-6 rounded-xl mb-8 text-left border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Truck size={12} /> Tracking
            </h4>
            <div className="text-sm text-slate-700">
              Tracking ID: <strong>{order.trackingNumber}</strong>
            </div>
            {order.deliveryEstimate && (
              <div className="text-xs text-slate-400 mt-2">
                Estimated arrival: {new Date(order.deliveryEstimate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        )}

        {/* Save Profile Toggle */}
        {recipientName && onSaveProfile && !profileSaved && (
          <div className="bg-brand-50 p-5 rounded-xl mb-8 text-left border border-brand-100">
            <label className="flex items-start gap-4 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={saveProfileChecked}
                  onChange={handleSaveProfileToggle}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  saveProfileChecked
                    ? 'bg-brand-500 border-brand-500'
                    : 'bg-white border-slate-300 hover:border-brand-300'
                }`}>
                  {saveProfileChecked && <CheckCircle size={12} className="text-white" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <UserCircle size={16} className="text-brand-500" />
                  Save answers for {recipientName}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Pre-fill vibe and details next time you send them a card
                </p>
              </div>
            </label>
          </div>
        )}

        {profileSaved && recipientName && (
          <div className="bg-green-50 p-4 rounded-xl mb-8 flex items-center gap-3 animate-fade-in border border-green-100">
            <Save size={18} className="text-green-600" />
            <span className="text-sm text-green-700">
              Saved! We'll remember your answers for {recipientName}.
            </span>
          </div>
        )}

        <div className="space-y-4">
          {!magicLinkSent && user?.email ? (
            <button
              onClick={() => setMagicLinkSent(true)}
              className="w-full py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
            >
              <Link size={16} /> Save this card to my history
            </button>
          ) : (
            <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle size={16} /> Magic link sent to {user?.email || order.email}
            </div>
          )}

          <Button onClick={onCreateAnother} className="w-full">
            Send another card
          </Button>
          <Button variant="outline" onClick={() => window.location.hash = '#/dashboard'} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
