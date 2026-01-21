import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2, Edit2, Plus } from 'lucide-react';
import { Button } from './Button';
import { Order } from '../types';
import { POPULAR_HOLIDAYS, Holiday } from '../constants/holidays';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onEditScheduledOrder?: (orderId: string, newDate: string) => void;
  onCancelScheduledOrder?: (orderId: string) => void;
  onCreateCardForDate?: (date: string) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  orders,
  onEditScheduledOrder,
  onCancelScheduledOrder,
  onCreateCardForDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newScheduledDate, setNewScheduledDate] = useState('');

  if (!isOpen) return null;

  // Get scheduled orders
  const scheduledOrders = orders.filter(order => order.status === 'scheduled' || order.scheduledDate);

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const getOrdersForDate = (date: Date) => {
    return scheduledOrders.filter(order =>
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingOrderId(null);
  };

  const handleEditOrder = (orderId: string, currentDate: string) => {
    setEditingOrderId(orderId);
    setNewScheduledDate(currentDate);
  };

  const handleSaveEdit = (orderId: string) => {
    if (onEditScheduledOrder && newScheduledDate) {
      onEditScheduledOrder(orderId, newScheduledDate);
      setEditingOrderId(null);
      setNewScheduledDate('');
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setNewScheduledDate('');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (onCancelScheduledOrder && confirm('Are you sure you want to cancel this scheduled send?')) {
      onCancelScheduledOrder(orderId);
    }
  };

  const handleCreateCardForDate = () => {
    if (selectedDate && onCreateCardForDate) {
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      onCreateCardForDate(dateString);
      onClose(); // Close modal after user clicks
    }
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const getUpcomingHolidays = (fromDate: Date, count: number = 6): Array<Holiday & { date: Date; isPast: boolean; hasScheduled: boolean }> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const holidaysWithDates = POPULAR_HOLIDAYS.flatMap(holiday => {
      const [month, day] = holiday.monthDay.split('-').map(Number);
      const thisYearDate = new Date(currentYear, month - 1, day);
      const nextYearDate = new Date(nextYear, month - 1, day);

      return [
        { ...holiday, date: thisYearDate, isPast: thisYearDate < fromDate, hasScheduled: false },
        { ...holiday, date: nextYearDate, isPast: false, hasScheduled: false }
      ];
    });

    // Filter to upcoming only, sort by date, take first N
    return holidaysWithDates
      .filter(h => !h.isPast)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, count)
      .map(h => ({
        ...h,
        hasScheduled: scheduledOrders.some(order =>
          order.scheduledDate && isSameDay(new Date(order.scheduledDate), h.date)
        )
      }));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDateOrders = selectedDate ? getOrdersForDate(selectedDate) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon size={24} />
              <h2 className="text-2xl font-serif font-semibold">Calendar Schedule</h2>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6 p-6">
            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{monthName}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="h-9 w-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold uppercase tracking-widest"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="h-9 w-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square border-r border-b border-slate-100" />;
                    }

                    const ordersForDate = getOrdersForDate(date);
                    const hasOrders = ordersForDate.length > 0;
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isTodayDate = isToday(date);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square border-r border-b border-slate-100 p-2 text-sm hover:bg-slate-50 transition-colors relative ${
                          isSelected ? 'bg-brand-50 border-brand-300' : ''
                        } ${isTodayDate ? 'font-bold' : ''}`}
                      >
                        <div className="flex flex-col h-full">
                          <span className={`text-left ${isTodayDate ? 'text-brand-600' : 'text-slate-700'}`}>
                            {date.getDate()}
                          </span>
                          {hasOrders && (
                            <div className="mt-auto flex items-center justify-center">
                              <div className="flex flex-wrap gap-1 max-w-full">
                                {ordersForDate.slice(0, 3).map((_, i) => (
                                  <div
                                    key={i}
                                    className="h-1.5 w-1.5 rounded-full bg-brand-500"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                  <span>Scheduled send</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border-2 border-brand-300 bg-brand-50" />
                  <span>Selected date</span>
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a date'}
              </h3>

              {/* Create Card Button */}
              {selectedDate && !isPastDate(selectedDate) && onCreateCardForDate && (
                <Button
                  onClick={handleCreateCardForDate}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  <Plus size={18} />
                  Create card for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </Button>
              )}

              {selectedDate && selectedDateOrders.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No cards scheduled for this date
                </div>
              )}

              {selectedDate && selectedDateOrders.length > 0 && (
                <div className="space-y-3">
                  {selectedDateOrders.map(order => (
                    <div key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      {/* Order Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">For {order.recipientName}</div>
                          <div className="text-xs text-slate-500 mt-1">{order.recipientAddress}</div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 px-2 py-1 rounded-full bg-emerald-50">
                          {order.status}
                        </span>
                      </div>

                      {/* Edit Mode */}
                      {editingOrderId === order.id ? (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <label className="text-xs font-semibold text-slate-600">Reschedule to:</label>
                          <input
                            type="date"
                            value={newScheduledDate}
                            onChange={(e) => setNewScheduledDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(order.id)}
                              className="flex-1"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditOrder(order.id, order.scheduledDate || '')}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600"
                          >
                            <Edit2 size={12} />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-xs font-semibold text-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!selectedDate && (
                <div className="space-y-4">
                  {/* Upcoming Holidays */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <CalendarIcon size={14} />
                      Upcoming Events
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getUpcomingHolidays(new Date(), 6).map((holiday, index) => (
                        <button
                          key={`${holiday.name}-${index}`}
                          onClick={() => {
                            setSelectedDate(holiday.date);
                            setCurrentDate(new Date(holiday.date.getFullYear(), holiday.date.getMonth()));
                          }}
                          className={`w-full rounded-lg border p-3 text-left hover:bg-slate-50 transition-colors ${
                            holiday.hasScheduled
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{holiday.icon}</span>
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{holiday.name}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {holiday.date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: holiday.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                  })}
                                </div>
                              </div>
                            </div>
                            {holiday.hasScheduled && (
                              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                                ✓ Scheduled
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Your Scheduled Sends Section */}
                  {scheduledOrders.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-600">Your Scheduled Sends</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {scheduledOrders.slice(0, 5).map(order => (
                          <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-3">
                            <div className="text-sm font-semibold text-slate-900">{order.recipientName}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : 'Date TBD'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
