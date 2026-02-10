import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Cookie helper functions
const setCookie = (name: string, value: string, minutes: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (minutes * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface NotPaidProps {
  deadline: string;
  graceDays: number;
}

export function NotPaid({ deadline, graceDays }: NotPaidProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);

  useEffect(() => {
    const calculateDaysUntilDeadline = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for accurate calculation

      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(0, 0, 0, 0); // Set to start of day for accurate calculation

      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      setDaysUntilDeadline(daysDiff);

      // Check if user dismissed the notification recently
      const remindLaterCookie = getCookie('notpaid-remind-later');
      if (remindLaterCookie) {
        setIsVisible(false);
        return;
      }

      // Show notification if within grace period window (before deadline + grace days)
      const gracePeriodEnd = new Date(deadlineDate);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + graceDays);
      const graceTimeDiff = gracePeriodEnd.getTime() - today.getTime();
      const graceDaysDiff = Math.ceil(graceTimeDiff / (1000 * 3600 * 24));

      // Show notification if we're within the grace period window
      // (from 5 days before deadline until grace period ends)
      const reminderStart = new Date(deadlineDate);
      reminderStart.setDate(reminderStart.getDate() - 5); // Start reminding 5 days before deadline
      const reminderTimeDiff = today.getTime() - reminderStart.getTime();
      const reminderDaysDiff = Math.ceil(reminderTimeDiff / (1000 * 3600 * 24));

      // Debug logging
      console.log('NotPaid Debug:', {
        today: today.toDateString(),
        deadline: deadlineDate.toDateString(),
        reminderStart: reminderStart.toDateString(),
        gracePeriodEnd: gracePeriodEnd.toDateString(),
        daysUntilDeadline,
        reminderDaysDiff,
        graceDaysDiff,
        condition: reminderDaysDiff >= 0 && graceDaysDiff >= 0
      });

      if (reminderDaysDiff >= 0 && graceDaysDiff >= 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    calculateDaysUntilDeadline();

    // Check every minute to handle cookie expiration
    const interval = setInterval(calculateDaysUntilDeadline, 60 * 1000);

    return () => clearInterval(interval);
  }, [deadline, graceDays]);

  if (!isVisible) return null;

  const isOverdue = daysUntilDeadline < 0;
  const isCritical = daysUntilDeadline <= 3 && daysUntilDeadline >= 0;

  // For critical/overdue payments, show full-screen overlay
  if (isOverdue || isCritical) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
        <div className={`max-w-lg w-full mx-4 p-8 rounded-xl border-2 shadow-2xl ${isOverdue
            ? 'bg-red-50 border-red-300 text-red-900'
            : 'bg-orange-50 border-orange-300 text-orange-900'
          }`}>
          <div className="text-center">
            <AlertTriangle className={`h-16 w-16 mx-auto mb-4 ${isOverdue ? 'text-red-600' : 'text-orange-600'
              }`} />

            <h2 className={`text-2xl font-bold mb-4 ${isOverdue ? 'text-red-900' : 'text-orange-900'
              }`}>
              {isOverdue ? 'Payment Overdue' : 'Payment Due Soon'}
            </h2>

            <div className={`text-lg font-medium mb-4 p-3 rounded-lg ${isOverdue
                ? 'bg-red-100 text-red-800'
                : 'bg-orange-100 text-orange-800'
              }`}>
              {isOverdue
                ? `⚠️ Payment was due ${Math.abs(daysUntilDeadline)} days ago`
                : `⚠️ Payment due in ${daysUntilDeadline} days`
              }
            </div>

            <p className="text-gray-700 mb-6">
              {isOverdue
                ? 'Your account access has been restricted. Please make immediate payment to restore full service.'
                : 'Please make payment before the deadline to avoid service interruption.'
              }
            </p>

            <div className="space-y-3">
              {!isOverdue && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setCookie('notpaid-remind-later', 'true', 10); // 10 minutes
                    setIsVisible(false);
                  }}
                >
                  Remind Me Later
                </Button>
              )}
            </div>

            {isOverdue && (
              <p className="text-sm text-gray-600 mt-4">
                Need help? Contact support at support@bocum.local
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For standard reminders, show small notification
  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border shadow-lg ${isOverdue
        ? 'bg-red-50 border-red-200 text-red-900'
        : 'bg-yellow-50 border-yellow-200 text-yellow-900'
      }`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isOverdue ? 'text-red-600' : 'text-yellow-600'
          }`} />

        <div className="flex-1">
          <h4 className={`font-semibold ${isOverdue ? 'text-red-900' : 'text-yellow-900'
            }`}>
            {isOverdue ? 'Payment Overdue' : 'Payment Reminder'}
          </h4>

          <p className="text-sm mt-1">
            {isOverdue
              ? `Your payment was due ${Math.abs(daysUntilDeadline)} days ago. Please make payment as soon as possible.`
              : `Your payment is due in ${daysUntilDeadline} days. Please ensure payment is made before the deadline.`
            }
          </p>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCookie('notpaid-remind-later', 'true', 10); // 10 minutes
                setIsVisible(false);
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() => {
            setCookie('notpaid-remind-later', 'true', 10); // 10 minutes
            setIsVisible(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
