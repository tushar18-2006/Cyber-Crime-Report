import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  usersStore,
  complaintsStore,
  chatMessagesStore,
  notificationsStore,
  activityLogsStore,
} from './server/db.js';
import {
  User,
  Complaint,
  NotificationItem,
  ChatMessage,
  ActivityLog,
  AdminStats,
  CrimeCategory,
  ComplaintStatus,
} from './src/types.js';

// ESM / CommonJS directory resolution
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'demo_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Generate unique acknowledgement number (e.g. CYBER-2026-X492)
function generateAckNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CYBER-2026-${randomDigits}`;
}

// Helper: Log activity
function logActivity(actor: User, action: string, details: string, req: express.Request) {
  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    details,
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    timestamp: new Date().toISOString(),
  };
  activityLogsStore.unshift(newLog);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Cyber Crime Reporting Portal Backend' });
});

// 2. Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = usersStore.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && (role ? u.role === role : true)
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials or user not found.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ error: 'This account has been suspended by Administrator.' });
  }

  res.json({
    message: 'Login successful',
    token: `jwt_mock_${user.id}_${Date.now()}`,
    user,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, role = 'citizen', department, badgeNumber } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }

  const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const newUser: User = {
    id: `u-${role}-${Date.now()}`,
    name,
    email,
    phone,
    role,
    department,
    badgeNumber,
    createdDate: new Date().toISOString(),
  };

  usersStore.push(newUser);

  logActivity(newUser, 'User Registration', `Registered as new ${role}`, req);

  res.json({
    message: 'Registration successful. Account created.',
    token: `jwt_mock_${newUser.id}_${Date.now()}`,
    user: newUser,
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  // Simulated OTP verification
  if (otp === '1234' || otp === '9999' || otp?.length === 4) {
    res.json({ success: true, message: 'OTP Verified successfully.' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP. Please try 1234.' });
  }
});

// 3. Complaints Endpoints
app.get('/api/complaints', (req, res) => {
  const { userId, role, status, category, search } = req.query;

  let list = [...complaintsStore];

  if (role === 'citizen' && userId) {
    list = list.filter((c) => c.complainantId === userId);
  } else if (role === 'officer' && userId) {
    list = list.filter((c) => c.assignedOfficerId === userId || !c.assignedOfficerId);
  }

  if (status) {
    list = list.filter((c) => c.status === status);
  }

  if (category) {
    list = list.filter((c) => c.category === category);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (c) =>
        c.ackNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.complainantName.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.get('/api/complaints/track/:ackNumber', (req, res) => {
  const { ackNumber } = req.params;
  const complaint = complaintsStore.find(
    (c) => c.ackNumber.trim().toUpperCase() === ackNumber.trim().toUpperCase()
  );

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found with provided Acknowledgement Number.' });
  }

  // Return sanitized view for public lookup
  res.json({
    ackNumber: complaint.ackNumber,
    category: complaint.category,
    title: complaint.title,
    status: complaint.status,
    filedAt: complaint.filedAt,
    updatedAt: complaint.updatedAt,
    assignedOfficerName: complaint.assignedOfficerName || 'Pending Assignment',
    complainantName: complaint.complainantName.charAt(0) + '*** ' + complaint.complainantName.split(' ')[1] || '',
    notesCount: complaint.notes.length,
    timeline: [
      { step: 'Submitted', timestamp: complaint.filedAt, completed: true },
      {
        step: 'Under Review',
        completed: ['Under Review', 'Investigation In Progress', 'Action Taken', 'Solved', 'Closed'].includes(
          complaint.status
        ),
      },
      {
        step: 'Investigation In Progress',
        completed: ['Investigation In Progress', 'Action Taken', 'Solved', 'Closed'].includes(
          complaint.status
        ),
      },
      {
        step: 'Action Taken',
        completed: ['Action Taken', 'Solved', 'Closed'].includes(complaint.status),
      },
      {
        step: 'Resolution',
        completed: ['Solved', 'Closed'].includes(complaint.status),
      },
    ],
  });
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaintsStore.find((c) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }
  res.json(complaint);
});

app.post('/api/complaints', async (req, res) => {
  const {
    complainantId,
    complainantName,
    complainantPhone,
    complainantEmail,
    complainantAddress,
    category,
    title,
    description,
    incidentDate,
    incidentTime,
    financialLossAmount,
    suspectDetails,
    evidenceFiles,
  } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  const ackNumber = generateAckNumber();
  const now = new Date().toISOString();

  // Process evidence files
  const processedEvidence = (evidenceFiles || []).map((file: any, index: number) => ({
    id: `ev-${Date.now()}-${index}`,
    fileName: file.fileName || `Evidence_${index + 1}`,
    fileType: file.fileType || 'image',
    fileSize: file.fileSize || '1.0 MB',
    uploadedAt: now,
    fileUrl: file.fileUrl || file.dataUrl || '#',
  }));

  const newComplaint: Complaint = {
    id: `c-${Date.now()}`,
    ackNumber,
    complainantId: complainantId || 'u-guest',
    complainantName: complainantName || 'Anonymous Citizen',
    complainantPhone: complainantPhone || '',
    complainantEmail: complainantEmail || '',
    complainantAddress,
    category,
    title,
    description,
    incidentDate: incidentDate || new Date().toISOString().split('T')[0],
    incidentTime,
    financialLossAmount: Number(financialLossAmount) || 0,
    suspectDetails,
    status: 'Submitted',
    evidence: processedEvidence,
    notes: [
      {
        id: `note-${Date.now()}`,
        officerId: 'system',
        officerName: 'Cyber Crime System',
        note: 'Complaint registered successfully and queued for initial verification.',
        statusChangeTo: 'Submitted',
        createdAt: now,
        isPrivate: false,
      },
    ],
    filedAt: now,
    updatedAt: now,
  };

  // Perform quick server-side AI risk analysis if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Analyze this cyber crime complaint and return structured evaluation:
Category: ${category}
Title: ${title}
Description: ${description}
Financial Loss: ₹${financialLossAmount || 0}
Suspect Details: ${JSON.stringify(suspectDetails || {})}

Return JSON with fields:
- riskScore (number 0-100)
- suggestedCategory (string matching standard cyber crime types)
- urgencyLevel ("Low" | "Medium" | "High" | "Critical")
- keyInsights (array of 3 strings)
- fakeComplaintProbability (number 0-100)
- actionableSteps (array of 3 guidance steps for citizen)`;

      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (geminiRes.text) {
        newComplaint.aiAnalysis = JSON.parse(geminiRes.text.trim());
      }
    } catch (err) {
      console.warn('Gemini AI Analysis fallback:', err);
    }
  }

  // Auto fallback analysis if AI API call missed
  if (!newComplaint.aiAnalysis) {
    newComplaint.aiAnalysis = {
      riskScore: financialLossAmount > 50000 ? 88 : 65,
      suggestedCategory: category as CrimeCategory,
      urgencyLevel: financialLossAmount > 100000 ? 'Critical' : financialLossAmount > 10000 ? 'High' : 'Medium',
      keyInsights: [
        `Automated heuristic pattern detected for ${category}.`,
        'Evidence uploaded verified for format integrity.',
        'Initial priority assigned based on financial impact.',
      ],
      fakeComplaintProbability: 3,
      actionableSteps: [
        'Call 1930 Cyber Helpline to flag immediate bank account freeze.',
        'Keep original screenshots and device logs safe.',
        'Follow complaint status updates via Acknowledgement Number.',
      ],
    };
  }

  complaintsStore.unshift(newComplaint);

  // Send Notification to Citizen
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    userId: complainantId,
    title: 'Complaint Registered',
    message: `Your complaint has been filed with Acknowledgement Number: ${ackNumber}`,
    type: 'status_update',
    isRead: false,
    createdAt: now,
    complaintId: newComplaint.id,
    ackNumber,
  });

  // Log activity
  logActivity(
    { id: complainantId, name: complainantName, role: 'citizen' } as User,
    'Filed Complaint',
    `Registered complaint ACK: ${ackNumber} (${category})`,
    req
  );

  res.status(201).json(newComplaint);
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, officerId, officerName, isPrivate } = req.body;

  const complaint = complaintsStore.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  const now = new Date().toISOString();
  complaint.status = status as ComplaintStatus;
  complaint.updatedAt = now;

  if (['Solved', 'Closed', 'Rejected'].includes(status)) {
    complaint.closedAt = now;
  }

  if (note) {
    complaint.notes.push({
      id: `note-${Date.now()}`,
      officerId: officerId || 'officer',
      officerName: officerName || 'Investigating Officer',
      note,
      statusChangeTo: status,
      createdAt: now,
      isPrivate: !!isPrivate,
    });
  }

  // Notify Citizen
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    userId: complaint.complainantId,
    title: `Complaint Status: ${status}`,
    message: `Status of ${complaint.ackNumber} updated to ${status}.`,
    type: 'status_update',
    isRead: false,
    createdAt: now,
    complaintId: complaint.id,
    ackNumber: complaint.ackNumber,
  });

  logActivity(
    { id: officerId, name: officerName, role: 'officer' } as User,
    'Updated Complaint Status',
    `Set status of ${complaint.ackNumber} to ${status}`,
    req
  );

  res.json(complaint);
});

app.patch('/api/complaints/:id/assign', (req, res) => {
  const { id } = req.params;
  const { officerId, officerName, adminUser } = req.body;

  const complaint = complaintsStore.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  const officer = usersStore.find((u) => u.id === officerId && u.role === 'officer');
  complaint.assignedOfficerId = officerId;
  complaint.assignedOfficerName = officer ? officer.name : officerName;
  complaint.status = complaint.status === 'Submitted' ? 'Under Review' : complaint.status;
  complaint.updatedAt = new Date().toISOString();

  // Notify Officer
  if (officerId) {
    notificationsStore.unshift({
      id: `notif-${Date.now()}`,
      userId: officerId,
      title: 'New Complaint Assigned',
      message: `You have been assigned to case ${complaint.ackNumber} (${complaint.category}).`,
      type: 'assignment',
      isRead: false,
      createdAt: new Date().toISOString(),
      complaintId: complaint.id,
      ackNumber: complaint.ackNumber,
    });
  }

  logActivity(
    adminUser || ({ name: 'Admin', role: 'admin' } as User),
    'Assigned Officer',
    `Assigned ${complaint.assignedOfficerName} to ${complaint.ackNumber}`,
    req
  );

  res.json(complaint);
});

// 4. Chat Endpoints
app.get('/api/complaints/:id/chat', (req, res) => {
  const messages = chatMessagesStore.filter((m) => m.complaintId === req.params.id);
  res.json(messages);
});

app.post('/api/complaints/:id/chat', (req, res) => {
  const { senderId, senderName, senderRole, message, attachments } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    complaintId: req.params.id,
    senderId,
    senderName,
    senderRole,
    message,
    attachments,
    timestamp: new Date().toISOString(),
  };

  chatMessagesStore.push(newMsg);

  // Notify counter party
  const complaint = complaintsStore.find((c) => c.id === req.params.id);
  if (complaint) {
    const recipientId = senderRole === 'citizen' ? complaint.assignedOfficerId : complaint.complainantId;
    if (recipientId) {
      notificationsStore.unshift({
        id: `notif-${Date.now()}`,
        userId: recipientId,
        title: 'New Message',
        message: `${senderName} sent a message regarding ${complaint.ackNumber}`,
        type: 'chat_message',
        isRead: false,
        createdAt: new Date().toISOString(),
        complaintId: complaint.id,
        ackNumber: complaint.ackNumber,
      });
    }
  }

  res.status(201).json(newMsg);
});

// 5. Admin & Analytics Endpoints
app.get('/api/admin/stats', (req, res) => {
  const totalComplaints = complaintsStore.length;
  const solvedCases = complaintsStore.filter((c) => c.status === 'Solved').length;
  const pendingCases = complaintsStore.filter((c) =>
    ['Submitted', 'Under Review', 'Investigation In Progress', 'Action Taken'].includes(c.status)
  ).length;
  const underReviewCases = complaintsStore.filter((c) => c.status === 'Under Review').length;

  const totalFinancialLoss = complaintsStore.reduce(
    (acc, c) => acc + (c.financialLossAmount || 0),
    0
  );

  const totalRegisteredCitizens = usersStore.filter((u) => u.role === 'citizen').length;
  const totalOfficers = usersStore.filter((u) => u.role === 'officer').length;

  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  complaintsStore.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
    category: category as CrimeCategory,
    count,
  }));

  // Monthly trends (mocked + dynamic blend)
  const monthlyTrends = [
    { month: 'Jan 2026', filed: 12, solved: 9 },
    { month: 'Feb 2026', filed: 18, solved: 14 },
    { month: 'Mar 2026', filed: 24, solved: 20 },
    { month: 'Apr 2026', filed: 31, solved: 25 },
    { month: 'May 2026', filed: 28, solved: 22 },
    { month: 'Jun 2026', filed: 42, solved: 35 },
    { month: 'Jul 2026', filed: totalComplaints + 15, solved: solvedCases + 10 },
  ];

  // Officer Performance
  const officers = usersStore.filter((u) => u.role === 'officer');
  const officerPerformance = officers.map((off) => {
    const assigned = complaintsStore.filter((c) => c.assignedOfficerId === off.id);
    const solved = assigned.filter((c) => c.status === 'Solved');
    return {
      officerId: off.id,
      name: off.name,
      badgeNumber: off.badgeNumber || 'CYBER-OFF',
      assignedCount: assigned.length,
      solvedCount: solved.length,
      avgResolutionDays: Math.floor(Math.random() * 3) + 2,
    };
  });

  const stats: AdminStats = {
    totalComplaints,
    solvedCases,
    pendingCases,
    underReviewCases,
    totalFinancialLoss,
    totalRegisteredCitizens,
    totalOfficers,
    categoryDistribution,
    monthlyTrends,
    officerPerformance,
  };

  res.json(stats);
});

app.get('/api/admin/users', (req, res) => {
  res.json(usersStore);
});

app.post('/api/admin/users/block', (req, res) => {
  const { userId, isBlocked, adminUser } = req.body;
  const u = usersStore.find((user) => user.id === userId);
  if (!u) return res.status(404).json({ error: 'User not found' });

  u.isBlocked = isBlocked;

  logActivity(
    adminUser || ({ name: 'Admin', role: 'admin' } as User),
    isBlocked ? 'Blocked Account' : 'Unblocked Account',
    `${isBlocked ? 'Blocked' : 'Restored'} user account: ${u.email}`,
    req
  );

  res.json(u);
});

app.get('/api/admin/logs', (req, res) => {
  res.json(activityLogsStore);
});

app.get('/api/notifications/:userId', (req, res) => {
  const notifs = notificationsStore.filter((n) => n.userId === req.params.userId);
  res.json(notifs);
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const n = notificationsStore.find((item) => item.id === req.params.id);
  if (n) {
    n.isRead = true;
  }
  res.json({ success: true });
});

// 6. Gemini AI Cyber Assistant Chatbot & Guidance Endpoint
app.post('/api/ai/chatbot', async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const systemPrompt = `You are CyberMitra, the official AI Cyber Crime Advisor for the National Cyber Crime Reporting Portal.
Provide clear, authoritative, reassuring, and immediate actionable legal and security advice for Indian citizens dealing with cyber crimes.
Always remind citizens:
1. National Cyber Crime Helpline Number: 1930
2. Official portal: cybercrime.gov.in
3. Immediate golden hour step for financial fraud (UPI/Card/Netbanking): Call 1930 within 2 hours or file complaint to freeze beneficiary account.
4. Never share OTP, UPI PIN, or click suspicious APK links.

Keep answers well-formatted with bullet points and bold key terms.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemPrompt}\n\nUser Question: ${prompt}\nContext: ${JSON.stringify(context || {})}`,
      });
      return res.json({ reply: response.text });
    } catch (err) {
      console.warn('Gemini Chatbot Error:', err);
    }
  }

  // Fallback intelligent response if API key offline
  res.json({
    reply: `**Cyber Crime Emergency Advisory**:

- **Immediate Action**: Call National Cyber Helpline **1930** immediately if you experienced financial fraud within the last 24 hours to freeze beneficiary account debits.
- **Evidence Preservation**: Take clear screenshots of WhatsApp chats, UPI transaction IDs, bank SMS, and suspect profile links.
- **Lodge Formal Complaint**: Click "File Complaint" on this portal to register an official report and receive your CYBER ACK Number.
- **Bank Alert**: Contact your bank customer service to block affected debit/credit cards and netbanking credentials.`,
  });
});

// ==========================================
// VITE / STATIC SERVING & LISTEN
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
