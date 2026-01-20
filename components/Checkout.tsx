import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircle, Truck, Clock, Mail } from 'lucide-react';
import { User, GeneratedCard, CheckoutMeta } from '../types';
import { createCheckoutSession, confirmPayment } from '../services/paymentService';
import { createPostcardOrder } from '../services/fulfillmentService';

interface CheckoutProps {
  user: User | null;
  card: GeneratedCard | null;
  onSuccess: (email: string, card: GeneratedCard, meta: CheckoutMeta) => void;
  onBack: () => void;
  onSuccessNavigate: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ user, card, onSuccess, onBack, onSuccessNavigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Scheduling State
  const [deliveryMode, setDeliveryMode] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'expedited' | 'byDate'>('standard');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Identity State
  const [email, setEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [address, setAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const isAnonymous = !user || user.isAnonymous;

  const handlePay = async () => {
    if (!email.includes('@')) {
      alert("Please enter a valid email address for your receipt.");
      return;
    }

    const errors: Record<string, string> = {};
    if (!address.name.trim()) errors.name = 'Recipient name is required.';
    if (!address.line1.trim()) errors.line1 = 'Street address is required.';
    if (!address.city.trim()) errors.city = 'City is required.';
    if (!address.postalCode.trim()) errors.postalCode = 'Postal code is required.';
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(address.postalCode.trim())) {
      errors.postalCode = 'Enter a valid ZIP code.';
    }
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
      errors.card = 'Complete payment details to continue.';
    }
    if (deliveryMode === 'later' && !scheduledDate) {
      errors.scheduledDate = 'Choose a target arrival date.';
    }

    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsProcessing(true);

    try {
      const session = await createCheckoutSession(email, totalCost);
      const payment = await confirmPayment(session.id);
      if (payment.status !== 'succeeded') {
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (card) {
        const fulfillment = await createPostcardOrder({
          deliveryMode,
          shippingSpeed: deliveryMode === 'later' ? 'byDate' : shippingSpeed,
          scheduledDate: deliveryMode === 'later' ? scheduledDate : undefined,
        });

        const meta: CheckoutMeta = {
          shippingCost,
          total: totalCost,
          deliveryMode,
          scheduledDate: deliveryMode === 'later' ? scheduledDate : undefined,
          reminderEnabled,
          shippingSpeed: deliveryMode === 'later' ? 'byDate' : shippingSpeed,
          trackingNumber: fulfillment.trackingNumber,
          deliveryEstimate: fulfillment.deliveryEstimate,
          shippingAddress: address,
        };

        onSuccess(email, { 
          ...card, 
          scheduledDate: deliveryMode === 'later' ? scheduledDate : undefined,
          shippingSpeed: deliveryMode === 'later' ? 'byDate' : shippingSpeed,
          shippingAddress: address,
          trackingNumber: fulfillment.trackingNumber,
          deliveryEstimate: fulfillment.deliveryEstimate,
          reminderDate: reminderEnabled && scheduledDate ? scheduledDate : undefined,
        }, meta);
        onSuccessNavigate();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate generic arrival estimates
  const today = new Date();
  const arrivalDateNow = new Date(today);
  arrivalDateNow.setDate(today.getDate() + (shippingSpeed === 'expedited' ? 3 : 5));
  const arrivalStringNow = arrivalDateNow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const shippingCost = deliveryMode === 'later'
    ? 8
    : shippingSpeed === 'expedited'
    ? 6
    : 0;
  const totalCost = 12 + shippingCost;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium text-sm">← Back</button>
           <h2 className="text-2xl font-bold font-serif text-slate-900">Final Details</h2>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          
          {/* Identity Capture (Anonymous -> Known) */}
          {(!user || user.isAnonymous) && (
             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-2">
                   <Mail size={16} /> Contact Info
                </h3>
                <p className="text-xs text-indigo-700 mb-3">
                  Where should we send your receipt?
                </p>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-indigo-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                />
             </div>
          )}

          {/* Delivery Timing Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Clock size={16} /> Delivery Timing
            </h3>
            
            <div className="space-y-3">
              {/* Send Now Option */}
              <label 
                className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all
                ${deliveryMode === 'now' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <input 
                  type="radio" 
                  name="delivery" 
                  className="sr-only" 
                  checked={deliveryMode === 'now'} 
                  onChange={() => {
                    setDeliveryMode('now');
                    setShippingSpeed('standard');
                  }} 
                />
                <div className={`mt-0.5 mr-3 w-5 h-5 rounded-full border flex items-center justify-center
                  ${deliveryMode === 'now' ? 'border-brand-600' : 'border-slate-300'}`}>
                  {deliveryMode === 'now' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                </div>
                <div>
                  <span className="block font-bold text-slate-900">Send Immediately</span>
                  <span className="block text-sm text-slate-500 mt-1">
                    Est. arrival <span className="text-slate-700 font-medium">{arrivalStringNow}</span>
                  </span>
                </div>
              </label>

              {/* Schedule Option */}
              <label 
                className={`relative flex flex-col p-4 rounded-xl border-2 transition-all
                ${isAnonymous ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                ${deliveryMode === 'later' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-start">
                  <input 
                    type="radio" 
                  name="delivery" 
                  className="sr-only" 
                  checked={deliveryMode === 'later'} 
                  onChange={() => {
                    if (isAnonymous) return;
                    setDeliveryMode('later');
                    setShippingSpeed('byDate');
                  }}
                  disabled={isAnonymous}
                />
                  <div className={`mt-0.5 mr-3 w-5 h-5 rounded-full border flex items-center justify-center
                    ${deliveryMode === 'later' ? 'border-brand-600' : 'border-slate-300'}`}>
                    {deliveryMode === 'later' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Schedule for Later</span>
                    <span className="block text-sm text-slate-500 mt-1">
                      Write it now. We'll mail it later.
                    </span>
                    {isAnonymous && (
                      <span className="block text-xs text-slate-400 mt-2">
                        Create an account to schedule a future send.
                      </span>
                    )}
                  </div>
                </div>

                {/* Date Picker Expansion */}
                {deliveryMode === 'later' && !isAnonymous && (
                  <div className="mt-4 ml-8 animate-fade-in">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Arrival Date</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                    />
                    {addressErrors.scheduledDate && (
                      <p className="text-xs text-red-500 mt-2">{addressErrors.scheduledDate}</p>
                    )}
                    <p className="text-xs text-brand-600 mt-2 flex items-center gap-1">
                      <CheckCircle size={12} /> We'll time the shipping to arrive around this date.
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Shipping Options */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
               <Truck size={16} /> Shipping Options
            </h3>
            {deliveryMode === 'later' ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                We'll time shipping so it arrives by your selected date.
              </div>
            ) : (
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingSpeed === 'standard' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="sr-only" 
                      checked={shippingSpeed === 'standard'}
                      onChange={() => setShippingSpeed('standard')}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingSpeed === 'standard' ? 'border-brand-600' : 'border-slate-300'}`}>
                      {shippingSpeed === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Standard (Free)</div>
                      <div className="text-xs text-slate-500">Arrives ~{arrivalStringNow}</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">$0</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingSpeed === 'expedited' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="sr-only" 
                      checked={shippingSpeed === 'expedited'}
                      onChange={() => setShippingSpeed('expedited')}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingSpeed === 'expedited' ? 'border-brand-600' : 'border-slate-300'}`}>
                      {shippingSpeed === 'expedited' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Expedited</div>
                      <div className="text-xs text-slate-500">Arrives in ~3 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">$6</span>
                </label>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
               <Truck size={16} /> Shipping Address
            </h3>
            <div className="grid gap-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Recipient Name" 
                  value={address.name}
                  onChange={(e) => setAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                />
                {addressErrors.name && <p className="text-xs text-red-500 mt-1">{addressErrors.name}</p>}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  value={address.line1}
                  onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
                  className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                />
                {addressErrors.line1 && <p className="text-xs text-red-500 mt-1">{addressErrors.line1}</p>}
              </div>
              <input 
                type="text" 
                placeholder="Apt, suite, etc (optional)" 
                value={address.line2}
                onChange={(e) => setAddress(prev => ({ ...prev, line2: e.target.value }))}
                className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                  />
                  {addressErrors.city && <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>}
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Zip Code" 
                    value={address.postalCode}
                    onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                  />
                  {addressErrors.postalCode && <p className="text-xs text-red-500 mt-1">{addressErrors.postalCode}</p>}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
               <CheckCircle size={16} /> Payment
            </h3>
            <div className="grid gap-4">
              <input 
                type="text" 
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="CVC" 
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-brand-400 transition-colors" 
                />
              </div>
              {addressErrors.card && <p className="text-xs text-red-500">{addressErrors.card}</p>}
            </div>
          </div>

          {/* Reminder */}
          {deliveryMode === 'later' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input 
                  type="checkbox" 
                  checked={reminderEnabled}
                  onChange={() => setReminderEnabled(prev => !prev)}
                />
                Email me a reminder 2 days before it ships.
              </label>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
             <div className="flex justify-between mb-2 text-slate-600">
               <span>Subtotal</span>
               <span>$12.00</span>
             </div>
             <div className="flex justify-between mb-4 text-slate-600">
               <span>Shipping</span>
               <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-slate-700 font-medium"}>
                 {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
               </span>
             </div>
             <div className="flex justify-between font-bold text-xl text-slate-900 mb-6">
               <span>Total</span>
               <span>${totalCost.toFixed(2)}</span>
             </div>
             
             <div className="flex gap-4">
                <Button className="w-full" size="lg" onClick={handlePay} isLoading={isProcessing} disabled={deliveryMode === 'later' && !scheduledDate}>
                   {deliveryMode === 'later' && scheduledDate 
                      ? `Schedule Send` 
                      : `Pay $${totalCost.toFixed(2)}`}
                </Button>
             </div>
             <p className="text-center text-xs text-slate-400 mt-4">
                {deliveryMode === 'later' 
                  ? "You will be charged now to reserve the printing slot." 
                  : "Secure payment via Stripe. Satisfaction guaranteed."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
