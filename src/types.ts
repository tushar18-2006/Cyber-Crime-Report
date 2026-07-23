export type Role = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  badgeNumber?: string; // For officers
  department?: string; // For officers
  isBlocked?: boolean;
  avatar?: string;
  createdDate: string;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Investigation In Progress'
  | 'Action Taken'
  | 'Solved'
  | 'Closed'
  | 'Rejected';

export type CrimeCategory =
  | 'Online Fraud'
  | 'UPI Scam'
  | 'Credit Card Fraud'
  | 'Identity Theft'
  | 'Social Media Abuse'
  | 'Cyber Bullying'
  | 'Hacking'
  | 'Phishing'
  | 'Fake Websites'
  | 'Mobile App Fraud'
  | 'Cryptocurrency Scam'
  | 'OTP Fraud'
  | 'Email Scam'
  | 'Others';

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'video' | 'document';
  fileSize: string;
  uploadedAt: string;
  fileUrl: string; // base64 or mock URL
  thumbnail?: string;
}

export interface InvestigationNote {
  id: string;
  officerId: string;
  officerName: string;
  note: string;
  statusChangeTo?: ComplaintStatus;
  createdAt: string;
  isPrivate: boolean; // Private notes only visible to officers & admins
}

export interface ChatMessage {
  id: string;
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status_update' | 'chat_message' | 'assignment' | 'system';
  isRead: boolean;
  createdAt: string;
  complaintId?: string;
  ackNumber?: string;
}

export interface AIAnalysisResult {
  riskScore: number; // 0-100 (higher means probable scam/fraud pattern)
  suggestedCategory: CrimeCategory;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  keyInsights: string[];
  fakeComplaintProbability: number; // 0-100%
  actionableSteps: string[];
}

export interface Complaint {
  id: string;
  ackNumber: string; // e.g., CYBER-2026-1042
  complainantId: string;
  complainantName: string;
  complainantPhone: string;
  complainantEmail: string;
  complainantAddress?: string;
  
  category: CrimeCategory;
  title: string;
  description: string;
  incidentDate: string;
  incidentTime?: string;
  financialLossAmount?: number;
  suspectDetails?: {
    name?: string;
    phoneOrUpiId?: string;
    websiteUrl?: string;
    bankAccountNo?: string;
    ipAddress?: string;
    socialMediaHandle?: string;
  };

  status: ComplaintStatus;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  
  evidence: EvidenceFile[];
  notes: InvestigationNote[];
  aiAnalysis?: AIAnalysisResult;
  
  filedAt: string;
  updatedAt: string;
  closedAt?: string;
  closureReason?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminStats {
  totalComplaints: number;
  solvedCases: number;
  pendingCases: number;
  underReviewCases: number;
  totalFinancialLoss: number;
  totalRegisteredCitizens: number;
  totalOfficers: number;
  categoryDistribution: { category: CrimeCategory; count: number }[];
  monthlyTrends: { month: string; filed: number; solved: number }[];
  officerPerformance: {
    officerId: string;
    name: string;
    badgeNumber: string;
    assignedCount: number;
    solvedCount: number;
    avgResolutionDays: number;
  }[];
}
