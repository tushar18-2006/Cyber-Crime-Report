import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ComplaintForm } from './components/ComplaintForm';
import { PublicTracker } from './components/PublicTracker';
import { AIChatbotModal } from './components/AIChatbotModal';
import { LoginRegisterModal } from './components/LoginRegisterModal';

import { User, Complaint, NotificationItem, CrimeCategory } from './types';
import { api } from './services/api';

export default function App() {
  // Default logged in user (Aarav Mehta - Citizen)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u-citizen-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 99887 76655',
    role: 'citizen',
    createdDate: '2026-03-01T14:20:00Z',
  });

  const [activeTab, setActiveTab] = useState<'home' | 'citizen' | 'officer' | 'admin'>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadComplaintsAndNotifs();
  }, [currentUser]);

  const loadComplaintsAndNotifs = async () => {
    try {
      const data = await api.getComplaints();
      setComplaints(data);

      if (currentUser?.id) {
        const notifs = await api.getNotifications(currentUser.id);
        setNotifications(notifs);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const handleRoleSelect = (role: 'citizen' | 'officer' | 'admin') => {
    // Switch user role profile accordingly for testing ease
    if (role === 'citizen') {
      setCurrentUser({
        id: 'u-citizen-1',
        name: 'Aarav Mehta',
        email: 'aarav.mehta@example.com',
        phone: '+91 99887 76655',
        role: 'citizen',
        createdDate: '2026-03-01T14:20:00Z',
      });
      setActiveTab('citizen');
    } else if (role === 'officer') {
      setCurrentUser({
        id: 'u-officer-1',
        name: 'Inspector Vikramaditya Singh',
        email: 'vikram.singh@cybercrime.gov.in',
        phone: '+91 98111 22334',
        role: 'officer',
        badgeNumber: 'CYBER-OFF-402',
        department: 'Financial Crime Cell',
        createdDate: '2026-01-15T10:30:00Z',
      });
      setActiveTab('officer');
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'u-admin-1',
        name: 'Dr. Rajesh Sharma (Director Admin)',
        email: 'admin@cybercrime.gov.in',
        phone: '+91 98765 43210',
        role: 'admin',
        department: 'National Cyber Crime Coordination Centre (I4C)',
        createdDate: '2026-01-10T09:00:00Z',
      });
      setActiveTab('admin');
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    if (currentUser?.id) {
      const notifs = await api.getNotifications(currentUser.id);
      setNotifications(notifs);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleRoleSelect}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenComplaintForm={() => setShowComplaintForm(true)}
        onOpenTrackModal={() => setShowTrackModal(true)}
        onOpenAIChatbot={() => setShowAIChatbot(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('home');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeHero
            onOpenComplaintForm={() => setShowComplaintForm(true)}
            onOpenTrackModal={() => setShowTrackModal(true)}
            onOpenAIChatbot={() => setShowAIChatbot(true)}
            onSelectCategory={() => setShowComplaintForm(true)}
            onSelectRoleView={handleRoleSelect}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenDashboard
            currentUser={
              currentUser || {
                id: 'u-citizen-guest',
                name: 'Citizen Guest',
                email: 'guest@example.com',
                phone: '+91 98765 43210',
                role: 'citizen',
                createdDate: new Date().toISOString(),
              }
            }
            complaints={complaints}
            onOpenComplaintForm={() => setShowComplaintForm(true)}
            onOpenAIChatbot={() => setShowAIChatbot(true)}
            onRefreshData={loadComplaintsAndNotifs}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            currentOfficer={
              currentUser && currentUser.role === 'officer'
                ? currentUser
                : {
                    id: 'u-officer-1',
                    name: 'Inspector Vikramaditya Singh',
                    email: 'vikram.singh@cybercrime.gov.in',
                    phone: '+91 98111 22334',
                    role: 'officer',
                    badgeNumber: 'CYBER-OFF-402',
                    department: 'Financial Crime Cell',
                    createdDate: '2026-01-15T10:30:00Z',
                  }
            }
            complaints={complaints}
            onRefreshData={loadComplaintsAndNotifs}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={
              currentUser && currentUser.role === 'admin'
                ? currentUser
                : {
                    id: 'u-admin-1',
                    name: 'Dr. Rajesh Sharma (Director Admin)',
                    email: 'admin@cybercrime.gov.in',
                    phone: '+91 98765 43210',
                    role: 'admin',
                    department: 'National Cyber Crime Coordination Centre (I4C)',
                    createdDate: '2026-01-10T09:00:00Z',
                  }
            }
            complaints={complaints}
            onRefreshData={loadComplaintsAndNotifs}
          />
        )}
      </main>

      {/* Global Modals */}
      {showComplaintForm && (
        <ComplaintForm
          currentUser={currentUser}
          onClose={() => setShowComplaintForm(false)}
          onSubmitted={(newComplaint) => {
            loadComplaintsAndNotifs();
          }}
        />
      )}

      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <PublicTracker onClose={() => setShowTrackModal(false)} />
        </div>
      )}

      {showAIChatbot && (
        <AIChatbotModal
          onClose={() => setShowAIChatbot(false)}
          onOpenComplaintForm={() => {
            setShowAIChatbot(false);
            setShowComplaintForm(true);
          }}
        />
      )}

      {showAuthModal && (
        <LoginRegisterModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setActiveTab(u.role as any);
            setShowAuthModal(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-500 py-6 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            National Cyber Crime Reporting Portal • Ministry of Home Affairs (I4C)
          </div>
          <div>
            Helpline: <strong>1930</strong> • 256-Bit Encrypted Secure Server
          </div>
        </div>
      </footer>
    </div>
  );
}
