import React, { useState } from 'react';
import { CheckCircle, Truck, BellRing, Link } from 'lucide-react';
import { Button } from './Button';
import { User, Order, NotificationItem } from '../types';

interface SuccessProps {
  user: User | null;
  order: Order | null;
  notifications: NotificationItem[];
  onCreateAnother: () => void;
}

const NOTIFICATION_LABELS: Record<NotificationItem['type'], string> = {
  receipt: 'Order receipt sent',
  reminder: '"We got this" reminder email',
  shipping: 'Shipping confirmation email',
  delivery: 'Delivery confirmation email',
};

export const Success: React.FC<SuccessProps> = ({ user, order, notifications, onCreateAnother }) => {
  const [magicLinkSent, setMagicLinkSent] = useState(false);

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
