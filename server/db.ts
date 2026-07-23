import {
  User,
  Complaint,
  NotificationItem,
  ChatMessage,
  ActivityLog,
  AdminStats,
  CrimeCategory,
} from '../src/types.js';

// Initial pre-populated Seed Users
export const usersStore: User[] = [
  {
    id: 'u-admin-1',
    name: 'Dr. Rajesh Sharma (Director Admin)',
    email: 'admin@cybercrime.gov.in',
    phone: '+91 98765 43210',
    role: 'admin',
    department: 'National Cyber Crime Coordination Centre (I4C)',
    createdDate: '2026-01-10T09:00:00Z',
  },
  {
    id: 'u-officer-1',
    name: 'Inspector Vikramaditya Singh',
    email: 'vikram.singh@cybercrime.gov.in',
    phone: '+91 98111 22334',
    role: 'officer',
    badgeNumber: 'CYBER-OFF-402',
    department: 'Financial Crime Cell',
    createdDate: '2026-01-15T10:30:00Z',
  },
  {
    id: 'u-officer-2',
    name: 'Sub-Inspector Ananya Roy',
    email: 'ananya.roy@cybercrime.gov.in',
    phone: '+91 98222 33445',
    role: 'officer',
    badgeNumber: 'CYBER-OFF-815',
    department: 'Identity & Cyber Bullying Squad',
    createdDate: '2026-02-01T11:15:00Z',
  },
  {
    id: 'u-citizen-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 99887 76655',
    role: 'citizen',
    createdDate: '2026-03-01T14:20:00Z',
  },
  {
    id: 'u-citizen-2',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 97766 55443',
    role: 'citizen',
    createdDate: '2026-03-05T16:45:00Z',
  },
];

// Seed Complaints
export const complaintsStore: Complaint[] = [
  {
    id: 'c-1001',
    ackNumber: 'CYBER-2026-8912',
    complainantId: 'u-citizen-1',
    complainantName: 'Aarav Mehta',
    complainantPhone: '+91 99887 76655',
    complainantEmail: 'aarav.mehta@example.com',
    complainantAddress: 'Flat 402, Green Valley Apartments, Cyberabad',
    category: 'UPI Scam',
    title: 'Fraudulent UPI debit of ₹45,000 via fake QR code asking for refund payment',
    description:
      'I posted an item for sale on OLX. A buyer claiming to be an army officer sent me a QR code stating that scanning it would credit ₹45,000 into my Google Pay account. Immediately upon entering PIN, ₹45,000 was deducted from my HDFC bank account.',
    incidentDate: '2026-07-20',
    incidentTime: '15:30',
    financialLossAmount: 45000,
    suspectDetails: {
      name: 'Ramesh Kumar (Fraudulent Alias)',
      phoneOrUpiId: 'army.pay89@okicici',
      bankAccountNo: '5010048291039',
    },
    status: 'Investigation In Progress',
    assignedOfficerId: 'u-officer-1',
    assignedOfficerName: 'Inspector Vikramaditya Singh',
    evidence: [
      {
        id: 'e-1',
        fileName: 'GPay_Transaction_Receipt.png',
        fileType: 'image',
        fileSize: '1.2 MB',
        uploadedAt: '2026-07-20T16:00:00Z',
        fileUrl:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'e-2',
        fileName: 'WhatsApp_Chat_Screenshots.pdf',
        fileType: 'pdf',
        fileSize: '3.4 MB',
        uploadedAt: '2026-07-20T16:02:00Z',
        fileUrl: '#',
      },
    ],
    notes: [
      {
        id: 'n-1',
        officerId: 'u-officer-1',
        officerName: 'Inspector Vikramaditya Singh',
        note: 'Sent formal notice under Sec 91 CrPC to ICICI Bank to freeze beneficiary account 5010048291039.',
        statusChangeTo: 'Investigation In Progress',
        createdAt: '2026-07-21T10:15:00Z',
        isPrivate: false,
      },
    ],
    aiAnalysis: {
      riskScore: 92,
      suggestedCategory: 'UPI Scam',
      urgencyLevel: 'High',
      keyInsights: [
        'Classic Army Officer OLX QR code scam pattern identified.',
        'High probability of mule account usage.',
        'Immediate freeze order recommended for ICICI beneficiary account.',
      ],
      fakeComplaintProbability: 4,
      actionableSteps: [
        'Call 1930 Cyber Helpline immediately to report transaction ID.',
        'Lodge formal dispute with HDFC Bank cyber branch.',
        'Preserve WhatsApp chat logs and QR code images.',
      ],
    },
    filedAt: '2026-07-20T16:05:00Z',
    updatedAt: '2026-07-21T10:15:00Z',
  },
  {
    id: 'c-1002',
    ackNumber: 'CYBER-2026-9043',
    complainantId: 'u-citizen-2',
    complainantName: 'Priya Verma',
    complainantPhone: '+91 97766 55443',
    complainantEmail: 'priya.verma@example.com',
    complainantAddress: 'B-12, Sector 62, Noida',
    category: 'Identity Theft',
    title: 'Creation of fake Instagram profile using personal photographs for extortion',
    description:
      'An unknown person downloaded my personal photos from Facebook and opened a fake Instagram account (@priya_v_official_fake). They are sending harassing messages to my colleagues and demanding ₹10,000 to delete the account.',
    incidentDate: '2026-07-18',
    incidentTime: '20:00',
    financialLossAmount: 0,
    suspectDetails: {
      socialMediaHandle: '@priya_v_official_fake',
    },
    status: 'Action Taken',
    assignedOfficerId: 'u-officer-2',
    assignedOfficerName: 'Sub-Inspector Ananya Roy',
    evidence: [
      {
        id: 'e-3',
        fileName: 'Fake_Profile_Screenshot.png',
        fileType: 'image',
        fileSize: '850 KB',
        uploadedAt: '2026-07-19T09:10:00Z',
        fileUrl:
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
      },
    ],
    notes: [
      {
        id: 'n-2',
        officerId: 'u-officer-2',
        officerName: 'Sub-Inspector Ananya Roy',
        note: 'Escalated to Instagram/Meta Grievance Officer India. Account has been taken down and IP logs requested.',
        statusChangeTo: 'Action Taken',
        createdAt: '2026-07-21T16:30:00Z',
        isPrivate: false,
      },
    ],
    aiAnalysis: {
      riskScore: 78,
      suggestedCategory: 'Identity Theft',
      urgencyLevel: 'Medium',
      keyInsights: [
        'Impersonation & cyber stalking detected.',
        'Requires immediate takedown notice to Meta Trust & Safety.',
      ],
      fakeComplaintProbability: 2,
      actionableSteps: [
        'Report profile via Instagram in-app impersonation reporting tool.',
        'Do not pay any extortion demands.',
      ],
    },
    filedAt: '2026-07-19T09:15:00Z',
    updatedAt: '2026-07-21T16:30:00Z',
  },
  {
    id: 'c-1003',
    ackNumber: 'CYBER-2026-7782',
    complainantId: 'u-citizen-1',
    complainantName: 'Aarav Mehta',
    complainantPhone: '+91 99887 76655',
    complainantEmail: 'aarav.mehta@example.com',
    category: 'Phishing',
    title: 'Phishing SMS received pretending to be Electricity Bill disconnection notice',
    description:
      'Received an SMS claiming electricity will be disconnected tonight unless I update my bill via APK link provided in SMS. App was flagged as malware.',
    incidentDate: '2026-07-10',
    financialLossAmount: 0,
    status: 'Solved',
    assignedOfficerId: 'u-officer-1',
    assignedOfficerName: 'Inspector Vikramaditya Singh',
    evidence: [],
    notes: [
      {
        id: 'n-3',
        officerId: 'u-officer-1',
        officerName: 'Inspector Vikramaditya Singh',
        note: 'Malicious domain blocked at ISP level via CERT-In. Case resolved.',
        statusChangeTo: 'Solved',
        createdAt: '2026-07-12T11:00:00Z',
        isPrivate: false,
      },
    ],
    filedAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-07-12T11:00:00Z',
    closedAt: '2026-07-12T11:00:00Z',
  },
];

// Seed Chat Messages
export const chatMessagesStore: ChatMessage[] = [
  {
    id: 'm-1',
    complaintId: 'c-1001',
    senderId: 'u-citizen-1',
    senderName: 'Aarav Mehta',
    senderRole: 'citizen',
    message:
      'Hello Inspector, I have uploaded the bank statement showing the ₹45,000 deduction. Has the beneficiary account been frozen?',
    timestamp: '2026-07-21T10:30:00Z',
  },
  {
    id: 'm-2',
    complaintId: 'c-1001',
    senderId: 'u-officer-1',
    senderName: 'Inspector Vikramaditya Singh',
    senderRole: 'officer',
    message:
      'Yes Mr. Mehta, we have issued a formal freeze order under Section 91 CrPC to ICICI Bank. Please do not answer any further calls from the suspect.',
    timestamp: '2026-07-21T10:45:00Z',
  },
];

// Seed Notifications
export const notificationsStore: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u-citizen-1',
    title: 'Case Status Updated',
    message:
      'Complaint CYBER-2026-8912 is now Investigation In Progress under Inspector Vikramaditya Singh.',
    type: 'status_update',
    isRead: false,
    createdAt: '2026-07-21T10:15:00Z',
    complaintId: 'c-1001',
    ackNumber: 'CYBER-2026-8912',
  },
  {
    id: 'notif-2',
    userId: 'u-officer-1',
    title: 'New Message from Complainant',
    message: 'Aarav Mehta sent a message on CYBER-2026-8912.',
    type: 'chat_message',
    isRead: true,
    createdAt: '2026-07-21T10:30:00Z',
    complaintId: 'c-1001',
    ackNumber: 'CYBER-2026-8912',
  },
];

// Seed Activity Audit Logs
export const activityLogsStore: ActivityLog[] = [
  {
    id: 'act-1',
    actorId: 'u-citizen-1',
    actorName: 'Aarav Mehta',
    actorRole: 'citizen',
    action: 'Filed Cyber Complaint',
    details: 'New complaint filed: CYBER-2026-8912 (UPI Scam - ₹45,000)',
    ipAddress: '49.207.192.11',
    timestamp: '2026-07-20T16:05:00Z',
  },
  {
    id: 'act-2',
    actorId: 'u-admin-1',
    actorName: 'Dr. Rajesh Sharma',
    actorRole: 'admin',
    action: 'Assigned Officer',
    details: 'Assigned Inspector Vikramaditya Singh to CYBER-2026-8912',
    ipAddress: '10.240.12.5',
    timestamp: '2026-07-20T17:00:00Z',
  },
  {
    id: 'act-3',
    actorId: 'u-officer-1',
    actorName: 'Inspector Vikramaditya Singh',
    actorRole: 'officer',
    action: 'Status Update & Note',
    details: 'Updated status to Investigation In Progress and added bank freeze note.',
    ipAddress: '10.240.18.22',
    timestamp: '2026-07-21T10:15:00Z',
  },
];
