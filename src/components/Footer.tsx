import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whyPoints = [
    "AI-powered scam and content detection",
    "Detects phishing, fake content, and misinformation",
    "Provides clear trust scores with explanations",
    "Helps users take immediate action"
  ];

  return (
    <footer className="mt-24 border-t border-slate-200 py-12 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand & Copyright */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-50">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-900">TrustLens Protocol</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">© 2026 TrustLens Global</p>
          </div>

          {/* Why TrustLens Link */}
          <div className="flex flex-col items-center md:items-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              Why TrustLens?
              <motion.span 
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                className="inline-block"
              >
                →
              </motion.span>
            </button>
          </div>

          {/* Creators Section */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Creators</div>
            <div className="flex gap-4 text-sm font-medium text-slate-600">
              <span className="hover:text-slate-900 transition-colors">Gautham</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">Fahadh</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">S4 Cyber Security, MESCE Kuttipuram</p>
          </div>
        </div>
      </div>

      {/* Modal for Why TrustLens */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
              
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Why TrustLens?</h3>
                  <p className="text-sm text-slate-500">Empowering users with AI-driven content verification.</p>
                </div>

                <div className="space-y-4">
                  {whyPoints.map((point, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10"
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
