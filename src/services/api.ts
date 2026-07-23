import {
  User,
  Complaint,
  NotificationItem,
  ChatMessage,
  ActivityLog,
  AdminStats,
} from '../types';

export const api = {
  // Auth
  async login(email: string, role?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(userData: Partial<User>) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async verifyOtp(phone: string, otp: string) {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'OTP Verification failed');
    }
    return res.json();
  },

  // Complaints
  async getComplaints(params?: {
    userId?: string;
    role?: string;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Complaint[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/complaints?${query}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const res = await fetch(`/api/complaints/${id}`);
    if (!res.ok) throw new Error('Complaint not found');
    return res.json();
  },

  async trackComplaint(ackNumber: string) {
    const res = await fetch(`/api/complaints/track/${encodeURIComponent(ackNumber)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Complaint tracking failed');
    }
    return res.json();
  },

  async fileComplaint(complaintData: any): Promise<Complaint> {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to file complaint');
    }
    return res.json();
  },

  async updateComplaintStatus(id: string, statusData: {
    status: string;
    note?: string;
    officerId?: string;
    officerName?: string;
    isPrivate?: boolean;
  }): Promise<Complaint> {
    const res = await fetch(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData),
    });
    if (!res.ok) throw new Error('Failed to update complaint status');
    return res.json();
  },

  async assignOfficer(id: string, officerId: string, officerName?: string, adminUser?: User) {
    const res = await fetch(`/api/complaints/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId, officerName, adminUser }),
    });
    if (!res.ok) throw new Error('Failed to assign officer');
    return res.json();
  },

  // Chat
  async getChatMessages(complaintId: string): Promise<ChatMessage[]> {
    const res = await fetch(`/api/complaints/${complaintId}/chat`);
    if (!res.ok) throw new Error('Failed to fetch chat messages');
    return res.json();
  },

  async sendChatMessage(complaintId: string, messageData: Partial<ChatMessage>): Promise<ChatMessage> {
    const res = await fetch(`/api/complaints/${complaintId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const res = await fetch(`/api/notifications/${userId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async markNotificationRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  // Admin & Analytics
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async blockUser(userId: string, isBlocked: boolean, adminUser?: User) {
    const res = await fetch('/api/admin/users/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isBlocked, adminUser }),
    });
    if (!res.ok) throw new Error('Failed to block/unblock user');
    return res.json();
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/admin/logs');
    if (!res.ok) return [];
    return res.json();
  },

  // AI Assistant
  async askAIChatbot(prompt: string, context?: any): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });
    if (!res.ok) throw new Error('AI Assistant response error');
    return res.json();
  },
};
