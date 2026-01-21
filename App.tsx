import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { Wizard } from './components/Wizard';
import { CardPreview } from './components/CardPreview';
import { Checkout } from './components/Checkout';
import { Dashboard } from './components/Dashboard';
import { Success } from './components/Success';
import { Legal } from './components/Legal';
import { CalendarModal } from './components/CalendarModal';
import { SettingsModal } from './components/SettingsModal';
import { GeneratedCard, User, RecipientProfile, RelationshipType, Order, NotificationItem, CheckoutMeta, OrderStatus } from './types';

function AppContent() {
  const navigate = useNavigate();
  const STORAGE_KEYS = {
    user: 'anyday_user',
    recipients: 'anyday_recipients',
    cards: 'anyday_cards',
    orders: 'anyday_orders',
    notifications: 'anyday_notifications',
    lastOrderId: 'anyday_last_order_id',
  };
  
  // -- Global State --
  // Default to Anonymous state if no persisted user found
  const [user, setUser] = useState<User | null>(null);
  const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
  const [wizardInitialAnswers, setWizardInitialAnswers] = useState<Record<string, any>>({});
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, any>>({});
  
  // -- Mock Data Store --
  const [cardHistory, setCardHistory] = useState<GeneratedCard[]>([]);
  const [recipients, setRecipients] = useState<RecipientProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // -- Modal States --
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // -- Scheduling State --
  const [scheduledDatePreset, setScheduledDatePreset] = useState<string | null>(null);

  // -- Navigation State --
  const [wizardEntryPoint, setWizardEntryPoint] = useState<'/' | '/dashboard'>('/');

  // -- Hydration Logic --
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    const storedRecipients = localStorage.getItem(STORAGE_KEYS.recipients);
    const storedCards = localStorage.getItem(STORAGE_KEYS.cards);
    const storedOrders = localStorage.getItem(STORAGE_KEYS.orders);
    const storedNotifications = localStorage.getItem(STORAGE_KEYS.notifications);
    const storedLastOrderId = localStorage.getItem(STORAGE_KEYS.lastOrderId);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const storedEmail = localStorage.getItem('anyday_user_email');
      if (storedEmail) {
        setUser({ email: storedEmail, isAnonymous: false });
      } else {
        setUser({ email: '', isAnonymous: true });
      }
    }

    if (storedRecipients) {
      setRecipients(JSON.parse(storedRecipients));
    }

    if (storedCards) {
      setCardHistory(JSON.parse(storedCards));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    if (storedLastOrderId) {
      setLastOrderId(storedLastOrderId);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recipients, JSON.stringify(recipients));
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cards, JSON.stringify(cardHistory));
  }, [cardHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (lastOrderId) {
      localStorage.setItem(STORAGE_KEYS.lastOrderId, lastOrderId);
    }
  }, [lastOrderId]);

  // -- Actions --

  // Start Anonymous Flow
  const handleAnonymousStart = () => {
    if (!user) setUser({ email: '', isAnonymous: true });
    setWizardEntryPoint('/'); // Track that we came from homepage
    navigate('/create');
  };

  // Magic Link Login
  const handleMagicLinkLogin = (email: string) => {
    setUser({ email, isAnonymous: false });
    localStorage.setItem('anyday_user_email', email);
    navigate('/dashboard');
  };

  // Start New Card (Blank Slate)
  const handleCreateNew = () => {
    setWizardInitialAnswers({});
    // Determine entry point based on current user state
    setWizardEntryPoint(user && !user.isAnonymous ? '/dashboard' : '/');
    navigate('/create');
  };

  // Start Card for Known Recipient (Recipient Identity Logic)
  const handleCreateForRecipient = (recipientId: string) => {
    const recipient = recipients.find(r => r.id === recipientId);
    if (recipient) {
      // Pre-fill answers to skip initial friction
      setWizardInitialAnswers({
        name: recipient.name,
        relationshipType: recipient.relationshipType,
      });
      setWizardEntryPoint('/dashboard'); // Always from dashboard
      navigate('/create');
    }
  };

  const handleWizardComplete = (card: GeneratedCard, answers: Record<string, any>) => {
    // Save as DRAFT immediately (Consumption Logic: Abandonment Protection)
    const draftCard: GeneratedCard = {
        ...card,
        id: crypto.randomUUID(),
        status: 'draft',
        createdAt: new Date().toISOString(),
        recipientName: wizardInitialAnswers.name || 'Someone',
        price: 12.00
    };

    setWizardAnswers(answers);
    setGeneratedCard(draftCard);
    setCardHistory(prev => [draftCard, ...prev]);
    navigate('/preview');
  };

  const handleResumeDraft = (card: GeneratedCard) => {
      setGeneratedCard(card);
      navigate('/preview');
  };

  const handleRegenerate = () => {
    // Preserve answers but go back to logic
    navigate('/create');
  };

  const updateCardStatus = (cardId: string, status: GeneratedCard['status']) => {
    setCardHistory(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const markNotificationSent = (orderId: string, type: NotificationItem['type']) => {
    const sentAt = new Date().toISOString();
    setNotifications(prev => prev.map(notification => 
      notification.orderId === orderId && notification.type === type
        ? { ...notification, status: 'sent', sentAt }
        : notification
    ));
  };

  const createNotifications = (orderId: string, meta: CheckoutMeta) => {
    const nowIso = new Date().toISOString();
    const baseNotifications: NotificationItem[] = [
      { id: crypto.randomUUID(), orderId, type: 'receipt', status: 'sent', sentAt: nowIso },
      { id: crypto.randomUUID(), orderId, type: 'shipping', status: 'queued' },
      { id: crypto.randomUUID(), orderId, type: 'delivery', status: 'queued' },
    ];

    if (meta.deliveryMode === 'later' && meta.reminderEnabled && meta.scheduledDate) {
      const reminderDate = new Date(meta.scheduledDate);
      reminderDate.setDate(reminderDate.getDate() - 2);
      baseNotifications.push({
        id: crypto.randomUUID(),
        orderId,
        type: 'reminder',
        status: 'queued',
        scheduledFor: reminderDate.toISOString(),
      });
    }

    return baseNotifications;
  };

  const handleChangeVibe = () => {
    const { vibe, ...rest } = wizardAnswers;
    setWizardInitialAnswers(rest);
    navigate('/create');
  };

  const handleStartOver = () => {
    setWizardInitialAnswers({});
    setWizardAnswers({});
    setGeneratedCard(null);
    navigate('/create');
  };

  // Calendar Management
  const handleManageCalendar = () => {
    setIsCalendarModalOpen(true);
  };

  const handleEditScheduledOrder = (orderId: string, newDate: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, scheduledDate: newDate } : order
    ));
  };

  const handleCancelScheduledOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    setNotifications(prev => prev.filter(notif => notif.orderId !== orderId));
  };

  const handleCreateCardForDate = (date: string) => {
    setScheduledDatePreset(date);
    setWizardInitialAnswers({}); // Start fresh wizard
    setWizardEntryPoint('/dashboard'); // Always from dashboard via calendar
    navigate('/create');
  };

  // Settings Management
  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const handleLogout = () => {
    setUser({ email: '', isAnonymous: true });
    setCardHistory([]);
    setRecipients([]);
    setOrders([]);
    setNotifications([]);
    setLastOrderId(null);
    localStorage.clear();
    navigate('/');
  };

  // Checkout & Account Transition Logic
  const handleCheckoutComplete = (email: string, card: GeneratedCard, meta: CheckoutMeta) => {
    // 1. Capture Identity (Anonymous -> Known)
    // NOTE: This happens transparently to the user.
    if (!user || user.isAnonymous) {
      const newUser = { email, isAnonymous: false };
      setUser(newUser);
      localStorage.setItem('anyday_user_email', email);
    }

    // 2. Update Card Status (Draft -> Paid)
    setCardHistory(prev => prev.map(c => 
        c.id === card.id 
            ? { ...card, status: card.scheduledDate ? 'paid' : 'printing', recipientName: wizardInitialAnswers.name || c.recipientName } 
            : c
    ));

    if (!card.scheduledDate) {
      setTimeout(() => updateCardStatus(card.id, 'printing'), 1500);
      setTimeout(() => updateCardStatus(card.id, 'shipped'), 6000);
      setTimeout(() => updateCardStatus(card.id, 'delivered'), 12000);
    }

    // 3. Update/Save Recipient Profile
    const newRecipient: RecipientProfile = {
      id: Date.now().toString(),
      name: wizardInitialAnswers.name || card.recipientName || 'Unknown',
      relationshipType: wizardInitialAnswers.relationshipType || RelationshipType.Friend,
      lastCardDate: new Date().toISOString()
    };
    
    setRecipients(prev => {
        if (prev.some(r => r.name === newRecipient.name)) return prev;
        return [...prev, newRecipient];
    });

    // 4. Create Order + Notifications
    const orderId = crypto.randomUUID();
    const newOrder: Order = {
      id: orderId,
      cardId: card.id,
      recipientName: newRecipient.name,
      email,
      total: meta.total,
      shippingCost: meta.shippingCost,
      status: meta.deliveryMode === 'later' ? 'scheduled' : 'paid',
      createdAt: new Date().toISOString(),
      scheduledDate: meta.scheduledDate,
      shippingSpeed: meta.shippingSpeed,
      shippingAddress: meta.shippingAddress,
      trackingNumber: meta.trackingNumber,
      deliveryEstimate: meta.deliveryEstimate,
    };

    setOrders(prev => [newOrder, ...prev]);
    setNotifications(prev => [...createNotifications(orderId, meta), ...prev]);
    setLastOrderId(orderId);

    // Clear scheduled date preset after successful checkout
    setScheduledDatePreset(null);

    if (meta.deliveryMode === 'now') {
      setTimeout(() => {
        updateOrderStatus(orderId, 'printing');
      }, 1500);
      setTimeout(() => {
        updateOrderStatus(orderId, 'shipped');
        markNotificationSent(orderId, 'shipping');
      }, 6000);
      setTimeout(() => {
        updateOrderStatus(orderId, 'delivered');
        markNotificationSent(orderId, 'delivery');
      }, 12000);
    }

    // 4. Return to Dashboard is handled by the Checkout success UI calling navigate
  };

  return (
    <Routes>
      <Route path="/" element={<Landing onStart={handleAnonymousStart} onLogin={handleMagicLinkLogin} />} />
      <Route 
        path="/dashboard"
        element={
          user && !user.isAnonymous ? (
            <>
              <Dashboard
                user={user}
                recipients={recipients}
                history={cardHistory}
                orders={orders}
                notifications={notifications}
                onCreateNew={handleCreateNew}
                onSendToRecipient={handleCreateForRecipient}
                onResumeDraft={handleResumeDraft}
                onManageCalendar={handleManageCalendar}
                onOpenSettings={handleOpenSettings}
                onLogout={handleLogout}
                onEditScheduledOrder={handleEditScheduledOrder}
                onCancelScheduledOrder={handleCancelScheduledOrder}
              />
              <CalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                orders={orders}
                onEditScheduledOrder={handleEditScheduledOrder}
                onCancelScheduledOrder={handleCancelScheduledOrder}
                onCreateCardForDate={handleCreateCardForDate}
              />
              <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                user={user}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route
        path="/success"
        element={
          <Success
            user={user}
            order={orders.find(order => order.id === lastOrderId) || null}
            notifications={notifications.filter(notification => notification.orderId === lastOrderId)}
            onCreateAnother={handleCreateNew}
          />
        }
      />
      <Route path="/terms" element={<Legal variant="terms" />} />
      <Route path="/privacy" element={<Legal variant="privacy" />} />
      <Route 
        path="/create" 
        element={
          <Wizard
            initialAnswers={wizardInitialAnswers}
            onComplete={handleWizardComplete}
            onBackToHome={() => navigate(wizardEntryPoint)}
          />
        } 
      />
      <Route 
        path="/preview" 
        element={
          generatedCard ? (
            <CardPreview 
              card={generatedCard} 
              onRegenerate={handleRegenerate}
              onChangeVibe={handleChangeVibe}
              onStartOver={handleStartOver}
              onCheckout={() => navigate('/checkout')}
            />
          ) : (
            user && !user.isAnonymous ? (
              <Dashboard 
                user={user}
                recipients={recipients}
                history={cardHistory}
                orders={orders}
                notifications={notifications}
                onCreateNew={handleCreateNew}
                onSendToRecipient={handleCreateForRecipient}
              />
            ) : (
              <Navigate to="/" replace />
            )
          )
        } 
      />
      <Route
        path="/checkout"
        element={
          <Checkout
            user={user}
            card={generatedCard}
            onSuccess={handleCheckoutComplete}
            onBack={() => navigate('/preview')}
            onSuccessNavigate={() => navigate('/success')}
            scheduledDatePreset={scheduledDatePreset}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
