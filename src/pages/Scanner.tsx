/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  AlertTriangle, 
  Search, 
  Info, 
  Copy, 
  RefreshCw,
  CheckCircle2,
  BrainCircuit,
  Fingerprint,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Lightbulb,
  Phone,
  ExternalLink,
  MessageSquareWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// Types based on the requested output format
interface AnalysisResult {
  overall_score: number;
  risk_level: "Low" | "Medium" | "High";
  trust_score: number;
  authenticity_label: "Safe" | "Suspicious" | "Unsafe";
  phishing_detection: {
    is_phishing: boolean;
    confidence: number;
    reasons: string[];
  };
  ai_generated_detection: {
    is_ai_generated: boolean;
    confidence: number;
    reasons: string[];
  };
  risk_breakdown: {
    url_risk: number;
    language_risk: number;
    social_engineering_risk: number;
  };
  attack_intent: "Credential Theft" | "Financial Fraud" | "Misinformation" | "Malware" | "Unknown";
  psychological_triggers: string[];
  highlighted_suspicious_parts: {
    text: string;
    reason: string;
  }[];
  detected_claim: string | null;
  claim_verdict: "Likely True" | "Likely False" | "Misleading" | "Unverified";
  claim_confidence: number;
  real_news_context: string | null;
  final_verdict: string;
  safe_rewrite: string | null;
}

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overall_score: { type: Type.NUMBER },
    risk_level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    trust_score: { type: Type.NUMBER },
    authenticity_label: { type: Type.STRING, enum: ["Safe", "Suspicious", "Unsafe"] },
    phishing_detection: {
      type: Type.OBJECT,
      properties: {
        is_phishing: { type: Type.BOOLEAN },
        confidence: { type: Type.NUMBER },
        reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["is_phishing", "confidence", "reasons"]
    },
    ai_generated_detection: {
      type: Type.OBJECT,
      properties: {
        is_ai_generated: { type: Type.BOOLEAN },
        confidence: { type: Type.NUMBER },
        reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["is_ai_generated", "confidence", "reasons"]
    },
    risk_breakdown: {
      type: Type.OBJECT,
      properties: {
        url_risk: { type: Type.NUMBER },
        language_risk: { type: Type.NUMBER },
        social_engineering_risk: { type: Type.NUMBER }
      },
      required: ["url_risk", "language_risk", "social_engineering_risk"]
    },
    attack_intent: { type: Type.STRING, enum: ["Credential Theft", "Financial Fraud", "Misinformation", "Malware", "Unknown"] },
    psychological_triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
    highlighted_suspicious_parts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["text", "reason"]
      }
    },
    detected_claim: { type: Type.STRING, nullable: true },
    claim_verdict: { type: Type.STRING, enum: ["Likely True", "Likely False", "Misleading", "Unverified"] },
    claim_confidence: { type: Type.NUMBER },
    real_news_context: { type: Type.STRING, nullable: true },
    final_verdict: { type: Type.STRING },
    safe_rewrite: { type: Type.STRING, nullable: true }
  },
  required: [
    "overall_score", "risk_level", "trust_score", "authenticity_label",
    "phishing_detection", "ai_generated_detection", "risk_breakdown",
    "attack_intent", "psychological_triggers", "highlighted_suspicious_parts",
    "claim_verdict", "claim_confidence", "final_verdict"
  ]
};

import Footer from '../components/Footer';

const Scanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'media'>('text');
  const [input, setInput] = useState('');
  const [mediaFile, setMediaFile] = useState<{ file: File; preview: string; type: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Checking language patterns...",
    "Detecting social engineering...",
    "Evaluating risk score...",
    "Analyzing DNA..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile({
          file,
          preview: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeContent = async () => {
    if (activeTab === 'text' && !input.trim()) return;
    if (activeTab === 'media' && !mediaFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      let contents: any[] = [];
      let systemInstruction = "";

      if (activeTab === 'text') {
        contents = [{ parts: [{ text: `Analyze the following input for phishing, AI generation, and claim credibility: \n\n${input}` }] }];
        systemInstruction = "You are an advanced cybersecurity and content authenticity analysis AI. Analyze user input (URL, text, or email) and detect phishing risk, AI-generated likelihood, and claim credibility. Follow the strict JSON schema provided. Keep reasons short (max 8 words). Be confident. If URL, analyze structure only. If text, analyze language and intent.";
      } else {
        const base64Data = mediaFile!.preview.split(',')[1];
        contents = [{
          parts: [
            { inlineData: { data: base64Data, mimeType: mediaFile!.type } },
            { text: "Analyze this media (image/video) to detect if it is AI-generated, a deepfake, or manipulated. Look for visual artifacts, unnatural movements, lighting inconsistencies, and metadata anomalies." }
          ]
        }];
        systemInstruction = "You are an advanced forensic media analysis AI. Analyze the provided image or video to detect AI generation, deepfakes, or digital manipulation. Follow the strict JSON schema provided. Focus on visual artifacts, skin texture, lighting, and background consistency. Provide a clear trust score and risk breakdown.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA as any,
          systemInstruction
        },
      });

      const data = JSON.parse(response.text);
      setResult(data);

      // Increment total searches in localStorage
      const currentSearches = parseInt(localStorage.getItem('totalSearches') || '0');
      localStorage.setItem('totalSearches', (currentSearches + 1).toString());
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getAuthenticityIcon = (label: string) => {
    switch (label) {
      case 'Safe': return <ShieldCheck className="w-8 h-8 text-emerald-500" />;
      case 'Suspicious': return <ShieldQuestion className="w-8 h-8 text-amber-500" />;
      case 'Unsafe': return <ShieldAlert className="w-8 h-8 text-rose-500" />;
      default: return <Info className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">TrustLens</h1>
              <p className="text-sm text-slate-500 font-medium">See what others miss</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center bg-black rounded-xl p-1 border border-slate-800">
            <Link 
              to="/"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
            >
              Home
            </Link>
            <Link 
              to="/analyze"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-white text-black shadow-sm"
            >
              Analyze
            </Link>
            <Link 
              to="/cyber-help"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
            >
              Cyber Help
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/cyber-help"
                className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Get Help / Report Scam
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'text' ? 'Analyze Content' : 'Media Forensic Scan'}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {activeTab === 'text' 
                  ? 'Paste a URL, email content, or a suspicious text message to evaluate its authenticity and security risk.'
                  : 'Upload an image or video to detect AI generation, deepfakes, or digital manipulation artifacts.'}
              </p>
              
              <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-xl w-fit backdrop-blur-sm">
                <button 
                  onClick={() => { setActiveTab('text'); setResult(null); }}
                  disabled={isAnalyzing}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'} disabled:opacity-50`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Text & URL
                </button>
                <button 
                  onClick={() => { setActiveTab('media'); setResult(null); }}
                  disabled={isAnalyzing}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'media' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'} disabled:opacity-50`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Media Forensic
                </button>
              </div>
            </div>

            {activeTab === 'text' ? (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
                <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste URL, text, or email here..."
                    className="w-full h-64 bg-transparent p-6 text-white placeholder:text-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                  />
                  <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setInput('')}
                        className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
                        title="Clear input"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={analyzeContent}
                      disabled={isAnalyzing || !input.trim()}
                      className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Run Analysis
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!mediaFile ? (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-800 rounded-2xl bg-black hover:bg-slate-950 transition-all cursor-pointer group shadow-xl">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-indigo-400" />
                        </div>
                        <p className="mb-2 text-sm text-white font-bold">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Image or Video (Max 10MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 transition duration-1000"></div>
                    <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="h-64 bg-black flex items-center justify-center overflow-hidden">
                        {mediaFile.type.startsWith('image/') ? (
                          <img src={mediaFile.preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <video src={mediaFile.preview} className="max-w-full max-h-full object-contain" controls />
                        )}
                      </div>
                      <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            {mediaFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-slate-400" /> : <Video className="w-4 h-4 text-slate-400" />}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate max-w-[150px]">{mediaFile.file.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">{(mediaFile.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setMediaFile(null)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={analyzeContent}
                            disabled={isAnalyzing}
                            className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Scanning...
                              </>
                            ) : (
                              <>
                                <Fingerprint className="w-4 h-4" />
                                Forensic Scan
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-600 text-sm backdrop-blur-sm"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[500px] border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4 bg-white/70 backdrop-blur-md shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShieldQuestion className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-slate-500">Awaiting Input</h3>
                    <p className="text-sm text-slate-400 max-w-xs">Enter content on the left to begin the deep-scan authenticity analysis.</p>
                  </div>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[500px] border border-slate-200 bg-white/70 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12 space-y-8 shadow-sm"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                    <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-indigo-500 animate-pulse" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold text-slate-900">Analyzing content...</h3>
                    <p className="text-sm text-slate-500">{loadingSteps[loadingStep]}</p>
                  </div>
                  <div className="w-full max-w-xs bg-slate-100 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Top Score Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                      whileHover={{ y: -2 }}
                      className="md:col-span-2 p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md relative overflow-hidden shadow-sm transition-all"
                    >
                      <div className="absolute top-0 right-0 p-6">
                        {getAuthenticityIcon(result!.authenticity_label)}
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Final Verdict</h3>
                          <p className="text-2xl font-bold text-slate-900 leading-tight">{result!.final_verdict}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            result!.risk_level === 'Low' ? 'bg-emerald-500 text-white' :
                            result!.risk_level === 'Medium' ? 'bg-amber-500 text-white' :
                            'bg-rose-500 text-white'
                          }`}>
                            {result!.risk_level} Risk
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <ArrowRight className="w-4 h-4 text-indigo-500" />
                            {result!.attack_intent}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -2 }}
                      className="p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-2 shadow-sm transition-all"
                    >
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                          <motion.circle 
                            cx="48" 
                            cy="48" 
                            r="40" 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            strokeDasharray={251.2} 
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * result!.trust_score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${result!.trust_score > 70 ? 'text-emerald-500' : result!.trust_score > 40 ? 'text-amber-500' : 'text-rose-500'}`}
                          />
                        </svg>
                        <span className="absolute text-2xl font-black text-slate-900">{result!.trust_score}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trust Score</h3>
                    </motion.div>
                  </div>

                  {/* Risk Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      whileHover={{ y: -2 }}
                      className="p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-6 shadow-sm transition-all"
                    >
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Risk Vectors
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'URL Structure', value: result!.risk_breakdown.url_risk },
                          { label: 'Linguistic Patterns', value: result!.risk_breakdown.language_risk },
                          { label: 'Social Engineering', value: result!.risk_breakdown.social_engineering_risk }
                        ].map((risk) => (
                          <div key={risk.label} className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                              <span className="text-slate-500">{risk.label}</span>
                              <span className={risk.value > 70 ? 'text-rose-500' : risk.value > 30 ? 'text-amber-500' : 'text-emerald-500'}>{risk.value}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${risk.value}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${risk.value > 70 ? 'bg-rose-500' : risk.value > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -2 }}
                      className="p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-6 shadow-sm transition-all"
                    >
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-indigo-400" />
                        Psychological Triggers
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result!.psychological_triggers.length > 0 ? result!.psychological_triggers.map((trigger) => (
                          <span key={trigger} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            {trigger}
                          </span>
                        )) : (
                          <span className="text-slate-500 text-xs italic">No triggers detected</span>
                        )}
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                          <span className="text-slate-500">AI Likelihood</span>
                          <span className="text-indigo-500">{result!.ai_generated_detection.confidence}%</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1.5 flex-1 rounded-full ${i < result!.ai_generated_detection.confidence / 10 ? 'bg-indigo-500' : 'bg-slate-100'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Suspicious Parts & Claim */}
                  <div className="space-y-6">
                    {result!.highlighted_suspicious_parts.length > 0 && (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-4 shadow-sm transition-all"
                      >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suspicious Elements</h3>
                        <div className="space-y-3">
                          {result!.highlighted_suspicious_parts.map((part, i) => (
                            <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-100 space-y-1">
                              <p className="text-sm font-mono text-rose-600">"{part.text}"</p>
                              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{part.reason}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {result!.detected_claim && (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-4 shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Claim Verification</h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            result!.claim_verdict === 'Likely True' ? 'bg-emerald-500 text-white' :
                            result!.claim_verdict === 'Likely False' ? 'bg-rose-500 text-white' :
                            'bg-amber-500 text-white'
                          }`}>
                            {result!.claim_verdict}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-900 font-medium italic">"{result!.detected_claim}"</p>
                          {result!.real_news_context && (
                            <p className="text-xs text-slate-500 leading-relaxed">{result!.real_news_context}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Advice & Rewrite */}
                  <div className="grid grid-cols-1 gap-6">
                    {result!.safe_rewrite && (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-4 shadow-sm transition-all"
                      >
                        <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Safe Alternative
                        </h3>
                        <div className="relative group">
                          <p className="text-xs text-slate-500 leading-relaxed italic">"{result!.safe_rewrite}"</p>
                          <button 
                            onClick={() => navigator.clipboard.writeText(result!.safe_rewrite!)}
                            className="absolute -top-1 -right-1 p-1.5 rounded-lg bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Report Scam Action Box - ONLY for Medium/High Risk */}
                  {(result!.risk_level === 'Medium' || result!.risk_level === 'High') && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="p-6 rounded-3xl border-2 border-rose-100 bg-rose-50/50 backdrop-blur-md space-y-6 shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            ⚠️ Detected Scam? Report Here
                          </h3>
                          <p className="text-sm text-slate-600">
                            If this content looks suspicious or you've been targeted, report it immediately to protect yourself and others.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.a 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          href="tel:1930"
                          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                        >
                          <Phone className="w-5 h-5" />
                          Call Helpline (1930)
                        </motion.a>
                        <motion.a 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          href="https://cybercrime.gov.in"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
                        >
                          <MessageSquareWarning className="w-5 h-5" />
                          Report on Cybercrime Portal
                        </motion.a>
                      </div>
                      
                      <div className="pt-4 border-t border-rose-100 flex justify-center">
                        <Link 
                          to="/cyber-help"
                          className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-2 group"
                        >
                          Need more help? Visit our Cyber Help Page
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Scanner;
