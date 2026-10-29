import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { NotificationItem } from '@/types';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
} from 'lucide-react';

export const StudentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications(0, 50);
      const list = res.content || res || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      // Ignored
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      // Ignored
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Notifications Desk
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Official alerts regarding your internship applications and interview updates
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1 bg-white hover:bg-[#EAF2FC] text-[#356F9D] text-xs font-bold rounded-sm border border-[#D4DCE6] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="w-12 text-center">Status</th>
                <th>Alert Title</th>
                <th>Notification Details</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#666666]">
                    Retrieving student notifications...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#666666]">
                    You have no new notifications at this time.
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className={n.isRead ? 'bg-white' : 'bg-[#FAFCFF]'}>
                    <td className="text-center">
                      {n.isRead ? (
                        <span className="text-[#888888] text-xs">•</span>
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-[#4779B8]" title="Unread" />
                      )}
                    </td>
                    <td className="font-bold text-[#356F9D] whitespace-nowrap">{n.title}</td>
                    <td className="text-xs text-[#333333]">{n.message}</td>
                    <td className="text-xs text-[#666666] whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                    <td>
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n.id)}
                          className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
