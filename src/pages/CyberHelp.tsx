import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  ExternalLink, 
  ShieldAlert, 
  MapPin, 
  ArrowLeft, 
  Info,
  ShieldCheck,
  AlertTriangle,
  MessageSquareWarning,
  FileWarning
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';

const CyberHelp: React.FC = () => {
  const cyberOffices = [
    { name: "National Cyber Crime Reporting Centre", phone: "1930", location: "New Delhi" },
    { name: "Cyber Crime Police Station - Bangalore", phone: "080-22375522", location: "Infantry Road, Bangalore" },
    { name: "Cyber Crime Cell - Mumbai", phone: "022-22640390", location: "BKC, Mumbai" },
    { name: "Cyber Crime Cell - Hyderabad", phone: "040-23261151", location: "Detective Department, Hyderabad" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ArrowLeft className="text-white w-6 h-6" />
              </Link>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cyber Help & Reporting</h1>
              <p className="text-sm text-slate-500 font-medium">Take action against scams and cybercrime</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
            <Link 
              to="/"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
            >
              Home
            </Link>
            <Link 
              to="/analyze"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
            >
              Analyze
            </Link>
            <Link 
              to="/cyber-help"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-white text-slate-900 shadow-sm"
            >
              Cyber Help
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Emergency Action Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <Phone className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Immediate Help</h2>
                <p className="text-sm text-slate-500">For financial fraud or urgent cyber incidents</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:1930"
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
              >
                <Phone className="w-5 h-5" />
                Call Cyber Helpline (1930)
              </motion.a>
            </div>
            <p className="text-xs text-slate-400 italic text-center">
              Available 24/7. Immediate reporting increases chances of financial recovery.
            </p>
          </div>
        </motion.section>

        {/* Complaint Registration Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileWarning className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Report a Cyber Crime</h2>
              <p className="text-sm text-slate-500">Official Government of India cybercrime reporting portal</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              You can file complaints related to phishing, financial fraud, online harassment, social media crimes, and more. Your report helps authorities track and stop cybercriminals.
            </p>
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              Register Complaint
            </motion.a>
          </div>
        </motion.section>

        {/* Reporting Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-3"
          >
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              What to Report
            </div>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Unauthorized bank transactions</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Phishing emails or SMS</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Social media identity theft</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Online financial scams</li>
            </ul>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md space-y-3"
          >
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider">
              <Info className="w-4 h-4" />
              Keep Ready
            </div>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Screenshots of the scam</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Transaction IDs or bank details</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Phone numbers or email IDs</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Date and time of incident</li>
            </ul>
          </motion.div>
        </div>

        {/* Nearby Cyber Offices */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Major Cyber Crime Offices
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cyberOffices.map((office) => (
              <motion.div 
                key={office.name} 
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.5)" }}
                className="p-5 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md transition-colors shadow-sm space-y-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{office.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {office.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${office.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + ' ' + office.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    Maps
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 font-medium">
            Report scams quickly to increase chances of recovery.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default CyberHelp;
