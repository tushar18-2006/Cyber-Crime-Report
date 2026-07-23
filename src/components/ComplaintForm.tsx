import React, { useState } from 'react';
import {
  FileText,
  Upload,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Shield,
  HelpCircle,
  X,
  FileCheck,
  Building,
  DollarSign,
  User,
  Calendar,
  Clock,
  Sparkles,
  Printer,
  Download,
} from 'lucide-react';
import { CrimeCategory, User as UserType, Complaint } from '../types';
import { api } from '../services/api';

const CRIME_CATEGORIES: CrimeCategory[] = [
  'UPI Scam',
  'Online Fraud',
  'Credit Card Fraud',
  'Identity Theft',
  'Social Media Abuse',
  'Cyber Bullying',
  'Hacking',
  'Phishing',
  'Fake Websites',
  'Mobile App Fraud',
  'Cryptocurrency Scam',
  'OTP Fraud',
  'Email Scam',
  'Others',
];

interface ComplaintFormProps {
  currentUser: UserType | null;
  onClose: () => void;
  onSubmitted: (newComplaint: Complaint) => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  currentUser,
  onClose,
  onSubmitted,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [complainantName, setComplainantName] = useState(currentUser?.name || '');
  const [complainantPhone, setComplainantPhone] = useState(currentUser?.phone || '');
  const [complainantEmail, setComplainantEmail] = useState(currentUser?.email || '');
  const [complainantAddress, setComplainantAddress] = useState('');

  const [category, setCategory] = useState<CrimeCategory>('UPI Scam');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [incidentTime, setIncidentTime] = useState('14:00');
  const [financialLossAmount, setFinancialLossAmount] = useState<number | ''>('');

  // Suspect Details
  const [suspectName, setSuspectName] = useState('');
  const [suspectPhoneUpi, setSuspectPhoneUpi] = useState('');
  const [suspectBankAccount, setSuspectBankAccount] = useState('');
  const [suspectWebsite, setSuspectWebsite] = useState('');
  const [suspectHandle, setSuspectHandle] = useState('');

  // Evidence Files
  const [evidenceFiles, setEvidenceFiles] = useState<
    { fileName: string; fileType: 'image' | 'pdf' | 'video' | 'document'; fileSize: string; dataUrl: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // Validate file size (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        alert(`File ${file.name} exceeds maximum 15MB size limit.`);
        return;
      }

      let type: 'image' | 'pdf' | 'video' | 'document' = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'pdf';
      else if (file.type.startsWith('video/')) type = 'video';

      const reader = new FileReader();
      reader.onload = () => {
        setEvidenceFiles((prev) => [
          ...prev,
          {
            fileName: file.name,
            fileType: type,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            dataUrl: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidence = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComplaint = async () => {
    if (!title || !description || !complainantName || !complainantPhone) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        complainantId: currentUser?.id || 'u-citizen-guest',
        complainantName,
        complainantPhone,
        complainantEmail,
        complainantAddress,
        category,
        title,
        description,
        incidentDate,
        incidentTime,
        financialLossAmount: Number(financialLossAmount) || 0,
        suspectDetails: {
          name: suspectName,
          phoneOrUpiId: suspectPhoneUpi,
          bankAccountNo: suspectBankAccount,
          websiteUrl: suspectWebsite,
          socialMediaHandle: suspectHandle,
        },
        evidenceFiles,
      };

      const result = await api.fileComplaint(payload);
      setSubmittedComplaint(result);
      onSubmitted(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to file complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Lodge Cyber Crime Complaint</h2>
              <p className="text-xs text-slate-400">
                Official Cyber Incident Registration Portal • Form 1930 Notice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!submittedComplaint && (
          <div className="bg-slate-950 border-b border-slate-800/80 px-6 py-3 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1</span>
              <span>Complainant & Crime Type</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-800"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2</span>
              <span>Details & Suspect</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-800"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>3</span>
              <span>Evidence Upload</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-800"></div>
            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>4</span>
              <span>Review & Submit</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {submittedComplaint ? (
            /* Complaint Submission Receipt / Acknowledgement */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                  Complaint Filed Successfully
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-3">
                  Acknowledgement Ref No:
                </h3>
                <div className="mt-2 text-3xl font-mono font-bold text-indigo-400 tracking-wider bg-slate-950 py-3 px-6 rounded-xl border border-indigo-500/30 inline-block select-all">
                  {submittedComplaint.ackNumber}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Save this number to track your investigation status online.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 text-left text-xs space-y-3 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Complainant Name:</span>
                  <span className="text-white font-semibold">{submittedComplaint.complainantName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Crime Category:</span>
                  <span className="text-indigo-300 font-semibold">{submittedComplaint.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Financial Loss Claimed:</span>
                  <span className="text-rose-400 font-bold">₹{submittedComplaint.financialLossAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date & Time Filed:</span>
                  <span className="text-slate-300">{new Date(submittedComplaint.filedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Evidence Attached:</span>
                  <span className="text-slate-300">{submittedComplaint.evidence.length} Files</span>
                </div>
              </div>

              {submittedComplaint.aiAnalysis && (
                <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-xl p-4 text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                    <Sparkles className="w-4 h-4" /> AI Cyber Risk Assessment Summary
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Scam Risk Severity Score:</span>
                    <span className="font-bold text-amber-400">{submittedComplaint.aiAnalysis.riskScore}/100 ({submittedComplaint.aiAnalysis.urgencyLevel})</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {submittedComplaint.aiAnalysis.actionableSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg border border-slate-700 text-xs font-semibold transition"
                >
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-lg transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Personal Details & Crime Category */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Complainant & Category Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        value={complainantName}
                        onChange={(e) => setComplainantName(e.target.value)}
                        placeholder="e.g. Aarav Mehta"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Number (OTP Verified) *
                      </label>
                      <input
                        type="text"
                        value={complainantPhone}
                        onChange={(e) => setComplainantPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={complainantEmail}
                        onChange={(e) => setComplainantEmail(e.target.value)}
                        placeholder="aarav.mehta@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Residential Address
                      </label>
                      <input
                        type="text"
                        value={complainantAddress}
                        onChange={(e) => setComplainantAddress(e.target.value)}
                        placeholder="House / City Address"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-800 my-2" />

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Select Cyber Crime Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CrimeCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {CRIME_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Incident Date *
                      </label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Approx Incident Time
                      </label>
                      <input
                        type="time"
                        value={incidentTime}
                        onChange={(e) => setIncidentTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Financial Loss Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={financialLossAmount}
                        onChange={(e) =>
                          setFinancialLossAmount(
                            e.target.value ? Number(e.target.value) : ''
                          )
                        }
                        placeholder="e.g. 45000 (Enter 0 if none)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Incident Description & Suspect Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Incident Details & Suspect Info
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Brief Incident Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Money debited via fake QR code asking for OLX refund"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Detailed Incident Description *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain chronologically what occurred, messages received, website links visited, banking apps used, or demands made..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" /> Suspect / Offender Details (If known)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Suspect Name / Alias
                        </label>
                        <input
                          type="text"
                          value={suspectName}
                          onChange={(e) => setSuspectName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Suspect Mobile No / UPI ID
                        </label>
                        <input
                          type="text"
                          value={suspectPhoneUpi}
                          onChange={(e) => setSuspectPhoneUpi(e.target.value)}
                          placeholder="e.g. army.pay89@okicici"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Suspect Bank Account No
                        </label>
                        <input
                          type="text"
                          value={suspectBankAccount}
                          onChange={(e) => setSuspectBankAccount(e.target.value)}
                          placeholder="Beneficiary Account Number"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Phishing Website / App URL
                        </label>
                        <input
                          type="text"
                          value={suspectWebsite}
                          onChange={(e) => setSuspectWebsite(e.target.value)}
                          placeholder="https://fake-bank-login.xyz"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Evidence File Upload */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Evidence & Screenshot Attachments
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload screenshots of bank SMS, payment receipts, chat history, or PDF documents.
                    Maximum 15MB per file.
                  </p>

                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 p-6 rounded-xl text-center cursor-pointer transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-input"
                    />
                    <label htmlFor="evidence-input" className="cursor-pointer space-y-2 block">
                      <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                      <div className="text-xs font-semibold text-slate-200">
                        Click to upload evidence files
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports PNG, JPG, PDF, MP4
                      </p>
                    </label>
                  </div>

                  {/* List of uploaded files */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-300">
                      Uploaded Evidence ({evidenceFiles.length}):
                    </h4>
                    {evidenceFiles.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No files attached yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evidenceFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-slate-200 truncate">{file.fileName}</p>
                                <span className="text-[10px] text-slate-400">{file.fileSize} • {file.fileType}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeEvidence(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Legal Confirmation */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Final Review & Verification
                  </h3>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Complainant Name:</span>
                      <span className="text-slate-200 font-semibold">{complainantName} ({complainantPhone})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Category & Date:</span>
                      <span className="text-indigo-400 font-semibold">{category} ({incidentDate})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Financial Loss:</span>
                      <span className="text-rose-400 font-bold">₹{Number(financialLossAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-slate-400">Evidence Count:</span>
                      <span className="text-slate-200 font-semibold">{evidenceFiles.length} File(s)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Legal Declaration under IT Act 2000:</strong> I hereby certify that the information provided in this complaint is true and accurate to the best of my knowledge. Filing false complaints is punishable under Section 182 IPC.
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => (s - 1) as any)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && (!complainantName || !complainantPhone)) {
                        setErrorMessage('Name and Phone are required.');
                        return;
                      }
                      if (step === 2 && (!title || !description)) {
                        setErrorMessage('Title and description are required.');
                        return;
                      }
                      setErrorMessage('');
                      setStep((s) => (s + 1) as any);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-lg transition"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitComplaint}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Registering Cyber Complaint...
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" /> Submit Official Complaint
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
