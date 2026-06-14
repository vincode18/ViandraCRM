/* ─────────────────────────────────────────────────────────────────────────
   Push Notification Service
   Manages push notification subscription and handling for Field Service PWA
   ───────────────────────────────────────────────────────────────────────── */

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY || '';

// Check if push notifications are supported
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[Push] Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  if (!isPushSupported()) {
    console.warn('[Push] Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to server
    await sendSubscriptionToServer(subscription);
    
    // Save subscription locally
    localStorage.setItem('ut-push-subscription', JSON.stringify(subscription));
    
    console.log('[Push] Successfully subscribed to push notifications');
    return subscription;
  } catch (error) {
    console.error('[Push] Failed to subscribe:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications() {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscriptionFromServer(subscription);
      localStorage.removeItem('ut-push-subscription');
      
      console.log('[Push] Successfully unsubscribed');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Push] Failed to unsubscribe:', error);
    return false;
  }
}

// Get current subscription
export async function getCurrentSubscription() {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('[Push] Failed to get subscription:', error);
    return null;
  }
}

// Send subscription to server
async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('/api/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Push] Failed to send subscription to server:', error);
    throw error;
  }
}

// Remove subscription from server
async function removeSubscriptionFromServer(subscription) {
  try {
    const response = await fetch('/api/push-subscription', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      console.warn('[Push] Failed to remove subscription from server');
    }
  } catch (error) {
    console.error('[Push] Failed to remove subscription from server:', error);
  }
}

// Show local notification (fallback when push not available)
export function showLocalNotification(title, options = {}) {
  if (!('Notification' in window)) {
    console.warn('[Push] Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      ...options,
    });
  }
}

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Notification types for Field Service
export const NOTIFICATION_TYPES = {
  WORK_ORDER_ASSIGNED: 'work_order_assigned',
  APPOINTMENT_SCHEDULED: 'appointment_scheduled',
  APPOINTMENT_RESCHEDULED: 'appointment_rescheduled',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  WORK_ORDER_UPDATED: 'work_order_updated',
  TIMESHEET_DUE: 'timesheet_due',
};

// Get notification message based on type
export function getNotificationMessage(type, data) {
  switch (type) {
    case NOTIFICATION_TYPES.WORK_ORDER_ASSIGNED:
      return {
        title: 'New Work Order Assigned',
        body: `WO-${data.woNumber} — ${data.title}`,
        data: {
          type: 'work_order',
          id: data.woId,
          url: `/field/jobs/${data.woId}`,
        },
      };
    
    case NOTIFICATION_TYPES.APPOINTMENT_SCHEDULED:
      return {
        title: 'New Appointment Scheduled',
        body: `${data.title} at ${data.location}`,
        data: {
          type: 'appointment',
          id: data.appointmentId,
          url: `/field/appointments/${data.appointmentId}`,
        },
      };
    
    case NOTIFICATION_TYPES.APPOINTMENT_RESCHEDULED:
      return {
        title: 'Appointment Rescheduled',
        body: `Your appointment has been rescheduled to ${data.newTime}`,
        data: {
          type: 'appointment',
          id: data.appointmentId,
          url: `/field/appointments/${data.appointmentId}`,
        },
      };
    
    case NOTIFICATION_TYPES.APPOINTMENT_CANCELLED:
      return {
        title: 'Appointment Cancelled',
        body: `Your appointment for ${data.title} has been cancelled`,
        data: {
          type: 'appointment',
          id: data.appointmentId,
          url: `/field/appointments/${data.appointmentId}`,
        },
      };
    
    case NOTIFICATION_TYPES.WORK_ORDER_UPDATED:
      return {
        title: 'Work Order Updated',
        body: `${data.field} changed for WO-${data.woNumber}`,
        data: {
          type: 'work_order',
          id: data.woId,
          url: `/field/jobs/${data.woId}`,
        },
      };
    
    case NOTIFICATION_TYPES.TIMESHEET_DUE:
      return {
        title: 'Timesheet Due',
        body: 'Reminder: Submit your timesheet for this week',
        data: {
          type: 'timesheet',
          url: '/timesheet',
        },
      };
    
    default:
      return {
        title: 'UT Field Service',
        body: 'You have a new notification',
        data: {},
      };
  }
}
