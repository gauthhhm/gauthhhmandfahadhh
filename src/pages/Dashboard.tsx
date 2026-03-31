import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Upload, 
  Newspaper, 
  LifeBuoy,
  ArrowRight,
  History,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedNumber = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span>{displayValue.toLocaleString()}</span>;
};

import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  const { scrollY } = useScroll();
  const [totalAnalyses, setTotalAnalyses] = useState(0);

  useEffect(() => {
    const searches = localStorage.getItem('totalSearches');
    if (searches) {
      setTotalAnalyses(parseInt(searches));
    }
  }, []);
  
  // Animation values based on scroll
  const headerHeight = useTransform(scrollY, [0, 200], [400, 64]);
  const logoScale = useTransform(scrollY, [0, 200], [2, 1]);
  const logoLeft = useTransform(scrollY, [0, 200], ['50%', '0%']);
  const logoTranslateX = useTransform(scrollY, [0, 200], ['-50%', '0%']);
  const taglineOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const navOpacity = useTransform(scrollY, [150, 200], [0, 1]);
  const headerBg = useTransform(scrollY, [150, 200], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)']);
  const headerBorder = useTransform(scrollY, [150, 200], ['rgba(226, 232, 240, 0)', 'rgba(226, 232, 240, 1)']);

  const chartData = [
    { name: 'Safe', value: 45, color: '#22c55e' },
    { name: 'Suspicious', value: 30, color: '#eab308' },
    { name: 'Unsafe', value: 25, color: '#ef4444' },
  ];

  const recentActivity = [
    { id: 1, type: 'URL Scan', input: 'https://secure-bank-login.com', risk: 'High', score: 85, date: '2 mins ago' },
    { id: 2, type: 'Text Analysis', input: 'Your package is ready for pickup...', risk: 'Medium', score: 45, date: '15 mins ago' },
    { id: 3, type: 'Deepfake Scan', input: 'ceo_announcement.mp4', risk: 'Low', score: 12, date: '1 hour ago' },
  ];

  const quickActions = [
    { 
      title: 'Analyze Content', 
      desc: 'Scan URLs, emails, or messages', 
      icon: <Search className="w-6 h-6" />, 
      link: '/analyze',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Upload Image/Video', 
      desc: 'Detect deepfakes & manipulation', 
      icon: <Upload className="w-6 h-6" />, 
      link: '/analyze',
      color: 'bg-indigo-50 text-indigo-600'
    },
    { 
      title: 'Reality Check', 
      desc: 'Verify news & factual claims', 
      icon: <Newspaper className="w-6 h-6" />, 
      link: '/analyze',
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      title: 'Cyber Help', 
      desc: 'Report scams & get assistance', 
      icon: <LifeBuoy className="w-6 h-6" />, 
      link: '/cyber-help',
      color: 'bg-rose-50 text-rose-600'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30"
    >
      {/* Animated Hero Header */}
      <motion.header 
        style={{ 
          height: headerHeight,
          backgroundColor: headerBg,
          borderBottomColor: headerBorder
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center border-b backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between relative">
          {/* Logo & Name Container */}
          <motion.div 
            style={{ 
              scale: logoScale,
              left: logoLeft,
              translateX: logoTranslateX,
              position: 'absolute'
            }}
            className="flex items-center gap-3 origin-left"
          >
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">TrustLens</h1>
              <motion.p 
                style={{ opacity: taglineOpacity }}
                className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 whitespace-nowrap"
              >
                See what others miss
              </motion.p>
            </div>
          </motion.div>

          {/* Navigation - Fades in as we scroll */}
          <motion.nav 
            style={{ opacity: navOpacity }}
            className="hidden md:flex items-center bg-black rounded-xl p-1 border border-slate-800 ml-auto"
          >
            <Link 
              to="/"
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-white text-black shadow-sm"
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
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
            >
              Cyber Help
            </Link>
          </motion.nav>

          <motion.div 
            style={{ opacity: navOpacity }}
            className="flex items-center gap-4 ml-4"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Security Status</span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                System Protected
              </span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Spacer to push content below the hero header */}
      <div className="h-[400px]" />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Security Dashboard</h2>
            <p className="text-slate-500">Welcome back. Here is your content analysis overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/analyze"
                className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                New Analysis
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Graph Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="lg:col-span-8 p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm space-y-6 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Analysis Overview
                </h3>
                <p className="text-sm text-slate-500">Distribution of scanned content risk levels</p>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Total Analyses Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-xl flex flex-col justify-center items-center text-center space-y-4 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Analyses</h3>
              <p className="text-6xl font-black tracking-tighter text-slate-900">
                <AnimatedNumber value={totalAnalyses} />
              </p>
            </div>
            <p className="text-xs text-slate-500 font-medium">Scans performed across all content types</p>
            <div className="pt-4 w-full">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats / Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm space-y-8 transition-all"
          >
            <h3 className="text-xl font-bold text-slate-900">Security Insights</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">45% Safe Content</p>
                  <p className="text-xs text-slate-500">Content verified as authentic and safe from phishing.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">30% Suspicious</p>
                  <p className="text-xs text-slate-500">Potential AI generation or social engineering detected.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">25% Unsafe</p>
                  <p className="text-xs text-slate-500">Confirmed phishing attempts or malicious content.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link to="/analyze" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                Run a new scan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  to={action.link}
                  className="group block p-6 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all space-y-4"
                >
                  <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{action.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Activity
            </h3>
            <Link to="/analyze" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">View All</Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-md hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.risk === 'High' ? 'bg-red-50 text-red-600' : 
                    item.risk === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 
                    'bg-green-50 text-green-600'
                  }`}>
                    {item.risk === 'High' ? <ShieldAlert className="w-5 h-5" /> : 
                     item.risk === 'Medium' ? <AlertTriangle className="w-5 h-5" /> : 
                     <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{item.input}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{item.type}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.risk === 'High' ? 'bg-red-600 text-white' : 
                    item.risk === 'Medium' ? 'bg-yellow-500 text-white' : 
                    'bg-green-500 text-white'
                  }`}>
                    {item.risk}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Score: {item.score}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
