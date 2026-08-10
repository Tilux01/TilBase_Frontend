import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, animate, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const LeftBlade = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  
  return (
    <motion.svg style={{ y }} className="absolute left-0 top-[5%] md:top-[-5%] h-[700px] md:h-[900px] w-[300px] md:w-[600px] pointer-events-none opacity-80" viewBox="0 0 600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-100 0 C 350 300, 400 600, 200 900 L-100 900 Z" fill="url(#leftGradient)" />
      <path d="M-100 0 C 350 300, 400 600, 200 900" stroke="white" strokeWidth="5" strokeOpacity="0.9" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }} />
      <defs>
        <radialGradient id="leftGradient" cx="0" cy="450" r="600" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#151922" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

const RightBlade = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <motion.svg style={{ y }} className="absolute right-0 top-[5%] md:top-[-5%] h-[700px] md:h-[900px] w-[300px] md:w-[600px] pointer-events-none opacity-80" viewBox="0 0 600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M700 0 C 250 300, 200 600, 400 900 L700 900 Z" fill="url(#rightGradient)" />
      <path d="M700 0 C 250 300, 200 600, 400 900" stroke="white" strokeWidth="5" strokeOpacity="0.9" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }} />
      <defs>
        <radialGradient id="rightGradient" cx="600" cy="450" r="600" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#151922" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// --- Restored FAQ Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white dark:bg-[#1A1F2E] border-[#E2E8F0] dark:border-[#222834] shadow-[0_8px_30px_rgba(0,0,0,0.04)]' : 'bg-[#F8FAFC]/50 dark:bg-[#151922]/50 border-transparent hover:border-[#E2E8F0] dark:hover:border-[#222834]'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 md:p-6 flex items-center justify-between text-left transition-colors gap-4"
      >
        <span className="text-sm md:text-[15px] font-semibold text-[#0F172A] dark:text-white leading-snug">{question}</span>
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#16A34A] dark:bg-[#39e03d] text-white dark:text-[#0F172A]' : 'bg-[#16A34A]/10 text-[#16A34A] dark:bg-[#39e03d]/20 dark:text-[#39e03d]'}`}>
           <span className="material-symbols-outlined text-[16px] font-bold">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-6 text-[#64748B] dark:text-[#8c93a1] text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
// --- Roadmap Component ---
const roadmapSteps = [
  { id: 1, day: "STEP 1", title: "Cluster Provisioning", icon: "dns", desc: "Deploy your high-availability cluster globally in seconds." },
  { id: 2, day: "STEP 2", title: "Define Schema", icon: "schema", desc: "Set up relational, document, or graph models visually." },
  { id: 3, day: "STEP 3", title: "Connect SDK", icon: "integration_instructions", desc: "Install the Node/Python SDK and authenticate seamlessly." },
  { id: 4, day: "STEP 4", title: "Vectorize Data", icon: "polyline", desc: "Enable auto-vectorization for instant RAG capabilities." },
  { id: 5, day: "STEP 5", title: "Auth & Roles", icon: "admin_panel_settings", desc: "Implement row-level security and user access policies." },
  { id: 6, day: "STEP 6", title: "Testing & QA", icon: "verified_user", desc: "Test query performance and ensure secure edge delivery." },
  { id: 7, day: "STEP 7", title: "Analytics & Tracking", icon: "monitoring", desc: "Set up real-time monitoring and cluster metrics." },
  { id: 8, day: "STEP 8", title: "Launch & Scale", icon: "rocket_launch", desc: "Go live with infinite auto-scaling and zero downtime." },
];

const RoadmapCard = ({ step, index, className }) => {
  return (
    <motion.div variants={fadeUpVariant} className={`bg-white dark:bg-[#151922] border border-[#E2E8F0] dark:border-[#222834] rounded-[1.5rem] p-6 relative flex flex-col h-[220px] shadow-sm hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-10 transition-all duration-300 hover:border-[#16A34A]/50 dark:hover:border-[#39e03d]/30 ${className || ''}`}>
       {/* Badge */}
       <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-[#16A34A] dark:bg-[#1A202C] border-2 border-white dark:border-[#151922] text-white dark:text-[#39e03d] font-bold text-sm flex items-center justify-center shadow-md">
         {index}
       </div>
       
       <div className="flex gap-4 items-start mb-4 mt-2">
         <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] dark:bg-[#222834] shrink-0 flex items-center justify-center border border-[#E2E8F0] dark:border-white/5">
           <span className="material-symbols-outlined text-[#475569] dark:text-[#8c93a1] text-[20px]">{step.icon}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[10px] text-[#16A34A] dark:text-[#39e03d] font-bold tracking-widest">{step.day}</span>
            <h4 className="text-[#0F172A] dark:text-white font-semibold text-[15px] leading-tight mt-1">{step.title}</h4>
         </div>
       </div>
       
       <p className="text-[#64748B] dark:text-[#8c93a1] text-[13px] leading-relaxed font-medium mt-auto">
         {step.desc}
       </p>
    </motion.div>
  );
};

const RoadmapSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  return (
    <section className="py-24 md:py-32 px-6 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative overflow-hidden" ref={containerRef}>
       <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row gap-16 relative z-10">
          
          {/* Side Panel */}
          <div className="xl:w-[280px] shrink-0">
             <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer}
               className="sticky top-32 bg-white dark:bg-[#151922] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl p-6 shadow-sm"
             >
                <h3 className="text-xs font-bold text-[#64748B] dark:text-[#8c93a1] tracking-widest uppercase mb-6 flex items-center justify-between">
                  Launch Checklist
                  <span className="text-[#16A34A] dark:text-[#39e03d] bg-[#16A34A]/10 dark:bg-[#39e03d]/10 px-2 py-0.5 rounded-full">8 / 8 READY</span>
                </h3>
                <ul className="flex flex-col gap-4">
                  {['Cluster Active', 'Schema Synced', 'Auth Configured', 'Vectors Embedded', 'Policies Enforced', 'Tests Passed', 'Monitoring On'].map((item, i) => (
                    <motion.li variants={fadeUpVariant} key={item} className="flex items-center gap-3 text-sm text-[#0F172A] dark:text-white/90 font-medium">
                      <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] text-[18px]">check_circle</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
             </motion.div>
          </div>

          {/* Snake Timeline Grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="flex-1 relative w-full pt-10">
             
             {/* SVG Path - Desktop Only */}
             <div className="absolute inset-0 hidden md:block z-0 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1000 800" preserveAspectRatio="none" className="overflow-visible">
                   {/* Faded background path for track */}
                   <path 
                     d="M 166 100 L 833 100 C 983 100, 983 400, 833 400 L 166 400 C 16 400, 16 700, 166 700 L 833 700"
                     fill="none" 
                     stroke="currentColor" 
                     className="text-[#E2E8F0] dark:text-[#222834]"
                     strokeWidth="4"
                     strokeLinecap="round"
                   />
                   
                   {/* Animated glowing path */}
                   <motion.path 
                     d="M 166 100 L 833 100 C 983 100, 983 400, 833 400 L 166 400 C 16 400, 16 700, 166 700 L 833 700"
                     fill="none" 
                     stroke="url(#glowGradient)" 
                     strokeWidth="6"
                     strokeLinecap="round"
                     style={{ 
                       pathLength,
                       filter: 'drop-shadow(0 0 12px rgba(22,163,74,0.6))'
                     }}
                   />
                   <defs>
                     <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="1">
                       <stop offset="0%" stopColor="#16A34A" />
                       <stop offset="100%" stopColor="#39e03d" />
                     </linearGradient>
                   </defs>
                </svg>
             </div>

             {/* Grid container for cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-12 relative z-10">
               
               {/* Row 1: L -> R */}
               <RoadmapCard step={roadmapSteps[0]} index={1} className="order-1" />
               <RoadmapCard step={roadmapSteps[1]} index={2} className="order-2" />
               <RoadmapCard step={roadmapSteps[2]} index={3} className="order-3" />
               
               {/* Row 2: R -> L (visually on desktop) */}
               <RoadmapCard step={roadmapSteps[5]} index={6} className="order-6 md:order-4" />
               <RoadmapCard step={roadmapSteps[4]} index={5} className="order-5 md:order-5" />
               <RoadmapCard step={roadmapSteps[3]} index={4} className="order-4 md:order-6" />

               {/* Row 3: L -> R */}
               <RoadmapCard step={roadmapSteps[6]} index={7} className="order-7" />
               <RoadmapCard step={roadmapSteps[7]} index={8} className="order-8" />
               
               {/* Final Launch Node */}
               <motion.div variants={fadeUpVariant} className="order-9 flex flex-col items-center justify-center p-6 border border-[#16A34A]/20 dark:border-[#39e03d]/30 bg-white dark:bg-[#39e03d]/5 rounded-[1.5rem] relative h-[220px] shadow-lg">
                 <div className="w-20 h-20 rounded-full border-2 border-[#16A34A] dark:border-[#39e03d] bg-[#F8FAFC] dark:bg-transparent flex items-center justify-center shadow-[0_0_25px_rgba(22,163,74,0.2)] dark:shadow-[0_0_30px_rgba(57,224,61,0.3)] mb-4">
                   <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] text-4xl">rocket_launch</span>
                 </div>
                 <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-widest">LAUNCH</h3>
               </motion.div>

             </div>
          </motion.div>
       </div>
    </section>
  );
};
// --- Editorial Services Section ---
const EditorialServicesSection = () => {
  return (
    <section className="py-24 md:py-40 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
         
         {/* Main Section Headline */}
         <div className="mb-24 md:mb-32 max-w-3xl">
           <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl md:text-6xl font-serif text-[#0F172A] dark:text-white leading-[1.1] mb-6">
             One Platform.<br/> Six Engines.<br/> <span className="text-[#16A34A] dark:text-[#39e03d] italic">Infinite Possibilities.</span>
           </motion.h2>
           <motion.p variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[#475569] dark:text-[#8c93a1] text-lg font-medium">
             TilBase unifies every database architecture you need under a single, seamless API. No more data silos. No more complex ETL pipelines. Just pure performance.
           </motion.p>
         </div>

         {/* Block 1: Core Database Engines */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 py-20 border-t border-[#E2E8F0] dark:border-[#222834]">
            {/* Left Column - Sticky */}
            <div className="md:col-span-4 relative">
               <div className="md:sticky md:top-40">
                 <span className="text-[10px] font-bold tracking-[0.2em] text-[#16A34A] dark:text-[#39e03d] uppercase mb-4 block">01 | Storage Foundations</span>
                 <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] dark:text-white mb-6 leading-tight">Core Database<br/>Engines</h2>
                 <p className="text-[#475569] dark:text-[#8c93a1] text-[13px] leading-relaxed max-w-[280px]">
                   The foundational storage systems designed to handle your everyday application data with zero latency and infinite scale.
                 </p>
               </div>
            </div>
            {/* Right Column */}
            <div className="md:col-span-7 md:col-start-6 flex flex-col gap-16 md:gap-24">
               {/* Step 01 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 01</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Document Database</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       A flexible, schema-less JSON document store perfect for unstructured data, dynamic profiles, and rapid prototyping without rigid migrations.
                    </p>
                  </div>
               </motion.div>
               {/* Step 02 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 02</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Relational (SQL)</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       ACID-compliant relational engine built for complex JOINs, strict schemas, and financial-grade transactional integrity across global regions.
                    </p>
                  </div>
               </motion.div>
               {/* Step 03 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 03</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Flat Database</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Ultra-fast key-value store optimized for caching, session management, and high-throughput logging where read/write speed is paramount.
                    </p>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* Block 2: Specialized Engines */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 py-20 border-t border-[#E2E8F0] dark:border-[#222834]">
            {/* Left Column - Sticky */}
            <div className="md:col-span-4 relative">
               <div className="md:sticky md:top-40">
                 <span className="text-[10px] font-bold tracking-[0.2em] text-[#16A34A] dark:text-[#39e03d] uppercase mb-4 block">02 | Advanced Modeling</span>
                 <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] dark:text-white mb-6 leading-tight">Specialized<br/>Engines</h2>
                 <p className="text-[#475569] dark:text-[#8c93a1] text-[13px] leading-relaxed max-w-[280px]">
                   Purpose-built database architectures for handling complex relationships, machine learning features, and live bi-directional sync.
                 </p>
               </div>
            </div>
            {/* Right Column */}
            <div className="md:col-span-7 md:col-start-6 flex flex-col gap-16 md:gap-24">
               {/* Step 01 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 04</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Vector Database</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Native storage for high-dimensional embeddings. Execute ultra-fast similarity searches and power Retrieval-Augmented Generation (RAG) at scale.
                    </p>
                  </div>
               </motion.div>
               {/* Step 02 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 05</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Graph Database</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Store and query highly connected data. Perfect for social networks, recommendation engines, and complex fraud detection systems.
                    </p>
                  </div>
               </motion.div>
               {/* Step 03 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Engine 06</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Realtime Database</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Sync data instantly across millions of clients. WebSockets native, ensuring your dashboards, chats, and multiplayer apps never lag.
                    </p>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* Block 3: AI & Agents */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 py-20 border-t border-[#E2E8F0] dark:border-[#222834]">
            {/* Left Column - Sticky */}
            <div className="md:col-span-4 relative">
               <div className="md:sticky md:top-40">
                 <span className="text-[10px] font-bold tracking-[0.2em] text-[#16A34A] dark:text-[#39e03d] uppercase mb-4 block">03 | Artificial Intelligence</span>
                 <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] dark:text-white mb-6 leading-tight">ChatBase & AI</h2>
                 <p className="text-[#475569] dark:text-[#8c93a1] text-[13px] leading-relaxed max-w-[280px]">
                   Seamlessly integrate intelligent agents directly alongside your data, leveraging native embedding pipelines without external services.
                 </p>
               </div>
            </div>
            {/* Right Column */}
            <div className="md:col-span-7 md:col-start-6 flex flex-col gap-16 md:gap-24">
               {/* Step 01 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Feature 01</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">ChatBase Agents</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Deploy autonomous AI agents that can directly query your databases, execute SQL, and formulate conversational responses to users.
                    </p>
                  </div>
               </motion.div>
               {/* Step 02 */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <span className="text-[10px] font-semibold text-[#94a3b8] dark:text-[#565e6d] tracking-widest uppercase md:mt-2 shrink-0 md:w-20">Feature 02</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#0F172A] dark:text-white mb-4">Native Embeddings</h3>
                    <p className="text-[#64748B] dark:text-[#8c93a1] text-[14px] leading-relaxed">
                       Automatically generate and sync vector embeddings every time a document is created or updated. Zero complex ETL pipelines required.
                    </p>
                  </div>
               </motion.div>
            </div>
         </div>

      </div>
    </section>
  );
};

// --- How We Compare Section ---
const ComparisonSection = () => {
  const checkIcon = <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] text-[20px] font-bold">check_circle</span>;
  const crossIcon = <span className="material-symbols-outlined text-[#94A3B8] dark:text-[#475569] text-[20px]">close</span>;
  const warningIcon = <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">warning</span>;

  const features = [
    { name: "6-in-1 Database Engines", tilbase: checkIcon, firebase: crossIcon, supabase: crossIcon, aws: <span className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">{warningIcon} Complex ETL</span> },
    { name: "Relational (SQL) Support", tilbase: checkIcon, firebase: crossIcon, supabase: checkIcon, aws: <span className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#8c93a1] font-medium">{checkIcon} RDS</span> },
    { name: "Document (NoSQL) Support", tilbase: checkIcon, firebase: checkIcon, supabase: crossIcon, aws: <span className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#8c93a1] font-medium">{checkIcon} DynamoDB</span> },
    { name: "Native Vector/Graph Search", tilbase: checkIcon, firebase: crossIcon, supabase: <span className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">{warningIcon} Vector Only</span>, aws: <span className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">{warningIcon} Separate DBs</span> },
    { name: "Built-in AI Agents (ChatBase)", tilbase: checkIcon, firebase: crossIcon, supabase: crossIcon, aws: crossIcon },
    { name: "Native Zero-ETL", tilbase: checkIcon, firebase: crossIcon, supabase: crossIcon, aws: crossIcon },
    { name: "Single Unified API", tilbase: checkIcon, firebase: crossIcon, supabase: crossIcon, aws: crossIcon },
  ];

  return (
    <section className="py-24 md:py-40 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative overflow-hidden border-t border-[#E2E8F0] dark:border-[#222834]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[10px] text-[#16A34A] dark:text-[#39e03d] font-bold tracking-[0.2em] uppercase mb-4 inline-block">
            Industry Comparison
          </motion.div>
          <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl md:text-5xl font-serif text-[#0F172A] dark:text-white mb-6 leading-tight">
            Why teams migrate to <span className="text-[#16A34A] dark:text-[#39e03d] italic">TilBase</span>.
          </motion.h2>
          <motion.p variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[#475569] dark:text-[#8c93a1] text-base md:text-lg max-w-2xl mx-auto font-medium">
            Stop stitching together five different services just to build a modern app. See how we stack up against the alternatives.
          </motion.p>
        </div>

        {/* The Grid Table */}
        <motion.div 
          variants={fadeUpVariant} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="w-full overflow-x-auto pb-8"
        >
          <div className="min-w-[900px] w-full grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-b border-[#E2E8F0] dark:border-[#222834]">
            
            {/* Headers */}
            <div className="py-6 px-4 font-bold text-[#64748B] dark:text-[#8c93a1] text-xs uppercase tracking-widest flex items-end">
              Platform Features
            </div>
            
            {/* TilBase Hero Column */}
            <div className="relative py-6 px-4 flex flex-col items-center justify-end bg-white dark:bg-[#151922] rounded-t-2xl border-t border-l border-r border-[#16A34A]/30 dark:border-[#39e03d]/30 shadow-[0_-10px_30px_rgba(22,163,74,0.05)] dark:shadow-[0_-10px_30px_rgba(57,224,61,0.05)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#16A34A] dark:bg-[#39e03d] rounded-t-2xl"></div>
               <span className="font-bold text-lg text-[#0F172A] dark:text-white tracking-wide">Til<span className="text-[#16A34A] dark:text-[#39e03d]">Base</span></span>
            </div>

            {/* Competitors */}
            <div className="py-6 px-4 flex items-end justify-center font-semibold text-[#64748B] dark:text-[#8c93a1] text-[15px]">Firebase</div>
            <div className="py-6 px-4 flex items-end justify-center font-semibold text-[#64748B] dark:text-[#8c93a1] text-[15px]">Supabase</div>
            <div className="py-6 px-4 flex items-end justify-center font-semibold text-[#64748B] dark:text-[#8c93a1] text-[15px]">AWS (Multi)</div>

            {/* Rows */}
            {features.map((row, idx) => (
              <React.Fragment key={idx}>
                {/* Feature Name */}
                <div className="py-5 px-4 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center font-semibold text-[#0F172A] dark:text-white text-[14px]">
                  {row.name}
                </div>
                
                {/* TilBase Cell */}
                <div className="py-5 px-4 border-t border-l border-r border-[#E2E8F0] dark:border-[#222834] flex items-center justify-center bg-white dark:bg-[#151922]">
                  {row.tilbase}
                </div>

                {/* Firebase Cell */}
                <div className="py-5 px-4 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-center">
                  {row.firebase}
                </div>

                {/* Supabase Cell */}
                <div className="py-5 px-4 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-center">
                  {row.supabase}
                </div>

                {/* AWS Cell */}
                <div className="py-5 px-4 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-center">
                  {row.aws}
                </div>
              </React.Fragment>
            ))}

            {/* Bottom Radius for TilBase Column (Empty Row just for visual closure) */}
            <div className="col-start-2 border-b border-l border-r border-[#16A34A]/30 dark:border-[#39e03d]/30 h-4 bg-white dark:bg-[#151922] rounded-b-2xl"></div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

// --- Performance Benchmarks Section ---
const PerformanceBenchmarksSection = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0");
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, 100000, { duration: 2.5, ease: "easeOut" });
      const unsubscribe = rounded.on("change", (latest) => {
        setDisplayValue(latest.toLocaleString());
      });
      return () => {
        controls.stop();
        unsubscribe();
      };
    } else {
      count.set(0);
      setDisplayValue("0");
    }
  }, [isInView, count, rounded]);

  return (
    <section className="py-24 md:py-32 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative border-t border-[#E2E8F0] dark:border-[#222834] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-16 md:mb-20">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[10px] text-[#16A34A] dark:text-[#39e03d] font-bold tracking-[0.2em] uppercase mb-4 inline-block">
            Performance Metrics
          </motion.div>
          <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl md:text-5xl font-serif text-[#0F172A] dark:text-white mb-6 leading-tight">
            Built for Speed.<br/>Engineered for <span className="text-[#16A34A] dark:text-[#39e03d] italic">Scale.</span>
          </motion.h2>
        </div>

        {/* Speedometer UI */}
        <div ref={ref} className="w-full max-w-[800px] relative flex flex-col items-center justify-end min-h-[300px] md:min-h-[400px]">
          
          {/* Background Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#16A34A]/20 dark:bg-[#39e03d]/10 blur-[80px] rounded-t-full pointer-events-none"></div>

          {/* SVG Arc */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[5%]">
            <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-[0_0_15px_rgba(22,163,74,0.3)] dark:drop-shadow-[0_0_20px_rgba(57,224,61,0.3)]">
              {/* Background Track Arc */}
              <path 
                d="M 20 180 A 180 180 0 0 1 380 180" 
                fill="none" 
                stroke="currentColor" 
                className="text-[#E2E8F0] dark:text-[#1E293B]" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
              {/* Filled Animated Arc */}
              <motion.path 
                d="M 20 180 A 180 180 0 0 1 380 180" 
                fill="none" 
                stroke="url(#speedGradient)" 
                strokeWidth="10" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 0.95 : 0 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#39e03d" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Central Counter Display */}
          <div className="relative z-10 flex flex-col items-center pb-8 md:pb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl md:text-[6rem] font-bold text-[#0F172A] dark:text-white tracking-tighter leading-none flex items-baseline gap-2"
            >
              {displayValue}<span className="text-3xl md:text-5xl text-[#16A34A] dark:text-[#39e03d]">+</span>
            </motion.div>
            <div className="text-xs md:text-sm text-[#64748B] dark:text-[#8c93a1] font-semibold tracking-widest uppercase mt-4">
              Queries Per Second
            </div>
          </div>

          {/* Dashboard Side Indicators */}
          <div className="w-full flex justify-between absolute bottom-4 md:bottom-8 px-4 md:px-10 pointer-events-none">
            {/* Left Indicator (Latency) */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: isInView ? 0 : -20, opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#16A34A] dark:bg-[#39e03d] animate-pulse"></div>
                <span className="text-[10px] md:text-xs text-[#64748B] dark:text-[#8c93a1] font-bold uppercase tracking-widest">Latency</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white">&lt; 1ms</div>
              {/* Fake Progress Bar */}
              <div className="w-16 md:w-24 h-1 bg-[#E2E8F0] dark:bg-[#1E293B] mt-2 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: isInView ? "95%" : 0 }} transition={{ duration: 1.5, delay: 1 }} className="h-full bg-[#16A34A] dark:bg-[#39e03d] rounded-full"></motion.div>
              </div>
            </motion.div>

            {/* Right Indicator (Uptime) */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: isInView ? 0 : 20, opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-end"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] md:text-xs text-[#64748B] dark:text-[#8c93a1] font-bold uppercase tracking-widest">Uptime</span>
                <span className="material-symbols-outlined text-[14px] text-[#16A34A] dark:text-[#39e03d]">cloud_done</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white">99.999%</div>
              {/* Fake Progress Bar */}
              <div className="w-16 md:w-24 h-1 bg-[#E2E8F0] dark:bg-[#1E293B] mt-2 rounded-full overflow-hidden flex justify-end">
                 <motion.div initial={{ width: 0 }} animate={{ width: isInView ? "100%" : 0 }} transition={{ duration: 1.5, delay: 1 }} className="h-full bg-[#16A34A] dark:bg-[#39e03d] rounded-full"></motion.div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

// --- Code Meets UI Section ---
const CodeMeetsUISection = () => {
  return (
    <section className="py-24 md:py-32 px-6 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative overflow-hidden flex flex-col items-center">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#16A34A] opacity-5 dark:opacity-10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="text-center mb-16 relative z-10">
        <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-4 tracking-tight">
          Code Meets UI
        </motion.h2>
        <motion.p variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[#475569] dark:text-[#8c93a1] font-medium text-lg max-w-lg mx-auto">
          Connect in seconds using the Node SDK. See changes instantly.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1100px] bg-[#F8FAFC] dark:bg-[#0A0F1C] border border-[#E2E8F0] dark:border-[#222834] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col relative z-10"
      >
        {/* Mock Navbar */}
        <div className="w-full px-8 py-5 border-b border-[#E2E8F0] dark:border-[#222834]/50 flex items-center justify-between bg-white dark:bg-[#0A0F1C]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#0F172A] dark:text-white tracking-wide">Til<span className="text-[#16A34A] dark:text-[#39e03d]">Base</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1]">
            <span className="hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors">How it Works</span>
            <span className="hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors">Features</span>
            <span className="hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors">ChatBase</span>
            <span className="hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors">Pricing</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-semibold text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors">Log In</span>
            <button className="bg-[#16A34A]/10 dark:bg-[#86efac] text-[#16A34A] dark:text-[#064e3b] font-bold text-[13px] px-5 py-2 rounded-md hover:bg-[#16A34A]/20 dark:hover:bg-[#4ade80] transition-colors">Sign Up</button>
          </div>
        </div>

        {/* Split Content */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px]">
          {/* Code Editor */}
          <div className="w-full md:w-1/2 p-8 font-mono text-[13px] leading-loose text-white/90 bg-[#0F172A] dark:bg-[#070A11] border-b md:border-b-0 md:border-r border-[#E2E8F0] dark:border-[#222834]/50 overflow-x-auto relative">
             {/* Left glow */}
             <div className="absolute top-1/2 left-0 w-[200px] h-[300px] bg-[#16A34A] opacity-10 dark:opacity-10 blur-[80px] pointer-events-none rounded-full -translate-y-1/2"></div>
             
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer} className="relative z-10">
               <motion.div variants={fadeUpVariant}><span className="text-pink-400">import</span> {'{ TilBase }'} <span className="text-pink-400">from</span> <span className="text-orange-300">'tilbase-node'</span>;</motion.div>
               <br/>
               <motion.div variants={fadeUpVariant}><span className="text-pink-400">const</span> db <span className="text-pink-400">=</span> <span className="text-pink-400">new</span> <span className="text-[#a78bfa]">TilBase</span>({'{'}</motion.div>
               <motion.div variants={fadeUpVariant} className="pl-4">clusterKey: <span className="text-blue-300">process</span>.<span className="text-blue-300">env</span>.<span className="text-white">CLUSTER_KEY</span>,</motion.div>
               <motion.div variants={fadeUpVariant} className="pl-4">dbUser: <span className="text-orange-300">'admin'</span>,</motion.div>
               <motion.div variants={fadeUpVariant} className="pl-4">dbPassword: <span className="text-blue-300">process</span>.<span className="text-blue-300">env</span>.<span className="text-white">DB_PASSWORD</span>,</motion.div>
               <motion.div variants={fadeUpVariant} className="pl-4">clusterType: <span className="text-orange-300">'Document'</span></motion.div>
               <motion.div variants={fadeUpVariant}>{'});'}</motion.div>
               <br/>
               <br/>
               <motion.div variants={fadeUpVariant}><span className="text-pink-400">await</span> db.<span className="text-[#a78bfa]">connect</span>();</motion.div>
               <motion.div variants={fadeUpVariant}><span className="text-blue-300">console</span>.<span className="text-[#a78bfa]">log</span>(<span className="text-orange-300">'Connected via DBAuth   '</span>);</motion.div>
             </motion.div>
          </div>

          {/* UI Mockup */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B101A] dark:to-[#0A1A12] flex items-center justify-center p-12 relative min-h-[300px] md:min-h-0">
             <motion.div 
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E2E8F0]"
             >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-[#16A34A]/20 dark:bg-[#86efac] rounded-xl flex items-center justify-center shadow-sm border border-[#16A34A]/20 dark:border-[#4ade80]/20"></div>
                   <div className="flex flex-col">
                      <span className="text-[#0F172A] font-bold text-base leading-tight">Cluster Active</span>
                      <span className="text-[#64748b] text-[11px] font-medium mt-1">prj_xg902 • eu-west-1</span>
                   </div>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-3 relative">
                   <div className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full w-4/5 animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="text-center text-[9px] font-bold text-[#94a3b8] tracking-widest uppercase">Syncing Data...</div>
             </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const PlatformCapabilities = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  const trackRotate = useTransform(
    smoothProgress, 
    [0, 0.18, 0.25, 0.43, 0.5, 0.68, 0.75, 1], 
    [0, 0,    90,   90,   180, 180,  270, 270]
  );
  const nodeRotate = useTransform(
    smoothProgress, 
    [0, 0.18, 0.25, 0.43, 0.5,  0.68, 0.75, 1], 
    [0, 0,    -90,  -90,  -180, -180, -270, -270]
  );

  const features = [
    { 
      icon: <span className="material-symbols-outlined text-[#0F172A] dark:text-white text-[32px]">security</span>, 
      title: "Military-Grade Security",
      desc: "AES-256 encryption at rest and in transit. Your data is protected by the same cryptographic standards used by top-tier intelligence agencies.",
      stat1: { value: "256-bit", label: "AES Encryption" },
      stat2: { value: "Zero", label: "Data Breaches" }
    },
    { 
      icon: <span className="material-symbols-outlined text-[#0F172A] dark:text-white text-[32px]">public</span>, 
      title: "Global Edge Sync",
      desc: "Queries are automatically routed to the nearest active cluster. Experience sub-millisecond latency no matter where your users are located.",
      stat1: { value: "100%", label: "Cluster Sync Rate" },
      stat2: { value: "<1ms", label: "Edge Latency" }
    },
    { 
      icon: <span className="material-symbols-outlined text-[#0F172A] dark:text-white text-[32px]">database</span>, 
      title: "Multi-Engine",
      desc: "Run Document, Flat, Graph, and Relational workloads concurrently. No need to manage separate databases for different data models.",
      stat1: { value: "4-in-1", label: "Database Engines" },
      stat2: { value: "120x", label: "Query ROI" }
    },
    { 
      icon: <span className="material-symbols-outlined text-[#0F172A] dark:text-white text-[32px]">lock</span>, 
      title: "Strict RBAC",
      desc: "Role-based access baked natively into the SDK. Ensure every query is authenticated and authorized before it ever touches the engine.",
      stat1: { value: "100%", label: "Query Auth" },
      stat2: { value: "Native", label: "SDK Integration" }
    },
  ];

  // The text fades out completely while the wheel is resting.
  // The wheel ONLY rotates during the empty space between text blocks.
  const opacities = [
    useTransform(smoothProgress, [0, 0.15, 0.18, 1], [1, 1, 0, 0]),
    useTransform(smoothProgress, [0, 0.24, 0.25, 0.28, 0.4, 0.43, 1], [0, 0, 0, 1, 1, 0, 0]),
    useTransform(smoothProgress, [0, 0.49, 0.5, 0.53, 0.65, 0.68, 1], [0, 0, 0, 1, 1, 0, 0]),
    useTransform(smoothProgress, [0, 0.74, 0.75, 0.78, 1], [0, 0, 0, 1, 1])
  ];

  const xTransforms = [
    useTransform(smoothProgress, [0, 0.15, 0.18, 1], [0, 0, 30, 30]),
    useTransform(smoothProgress, [0, 0.24, 0.25, 0.28, 0.4, 0.43, 1], [-30, -30, -30, 0, 0, 30, 30]),
    useTransform(smoothProgress, [0, 0.49, 0.5, 0.53, 0.65, 0.68, 1], [-30, -30, -30, 0, 0, 30, 30]),
    useTransform(smoothProgress, [0, 0.74, 0.75, 0.78, 1], [-30, -30, -30, 0, 0])
  ];

  return (
    <section ref={containerRef} id="features" className="w-full relative bg-[#F8FAFC] dark:bg-[#0B101A] border-t border-[#E2E8F0] dark:border-[#222834]">
      {/* Mobile Grid Fallback (Static) */}
      <div className="md:hidden flex flex-col gap-8 px-6 py-24">
        <div className="mb-4">
          <div className="text-[10px] text-[#16A34A] dark:text-[#39e03d] font-bold tracking-widest uppercase mb-4">Platform Capabilities</div>
          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-4">AI Workforce.<br/>Built for Data Teams.</h2>
          <p className="text-sm text-[#475569] dark:text-[#8c93a1]">They read, write and act across clusters, edges, and logs so your ops staff don't have to.</p>
        </div>
        {features.map((feature, i) => (
          <div key={i} className="bg-white dark:bg-[#0d1117] border border-[#E2E8F0] dark:border-[#222834] p-6 rounded-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F8FAFC] dark:bg-[#151922] flex items-center justify-center shadow-inner border border-[#E2E8F0] dark:border-[#222834]">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#475569] dark:text-[#8c93a1] leading-relaxed mb-4">{feature.desc}</p>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <div className="text-xl font-black text-[#0F172A] dark:text-white mb-1">{feature.stat1.value}</div>
                    <div className="text-[10px] text-[#475569] dark:text-[#8c93a1]">{feature.stat1.label}</div>
                 </div>
                 <div>
                    <div className="text-xl font-black text-[#0F172A] dark:text-white mb-1">{feature.stat2.value}</div>
                    <div className="text-[10px] text-[#475569] dark:text-[#8c93a1]">{feature.stat2.label}</div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Sticky Scroll Area */}
      <div className="hidden md:block h-[400vh] w-full relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden max-w-[1400px] mx-auto flex items-center">
          
          {/* Left Text Block */}
          <div className="w-1/2 pl-20 flex flex-col justify-center z-20 relative h-screen">
            <div className="text-xs text-[#16A34A] dark:text-[#39e03d] font-black tracking-[0.2em] uppercase mb-16">
              Platform Capabilities
            </div>
            
            <div className="relative w-full">
              {features.map((feature, i) => {
                return (
                  <motion.div 
                    key={i} 
                    className="absolute inset-0 flex flex-col pointer-events-none"
                    style={{ opacity: opacities[i], x: xTransforms[i] }}
                  >
                    <h2 className="text-5xl lg:text-6xl font-bold text-[#0F172A] dark:text-white mb-10 leading-[1.1] tracking-tighter">
                      {feature.title}
                    </h2>
                    <p className="text-base lg:text-lg text-[#475569] dark:text-[#8c93a1] max-w-md mb-10 leading-[1.7] font-medium min-h-[96px]">
                      {feature.desc}
                    </p>
                    
                    {/* High-End Editorial Stats Block */}
                    <div className="flex gap-12 pt-6 border-t border-[#0F172A]/10 dark:border-white/5 w-max">
                       <div className="pr-12 border-r border-[#0F172A]/10 dark:border-white/5">
                          <div className="text-4xl font-medium text-[#0F172A] dark:text-white mb-2 tracking-tight">{feature.stat1.value}</div>
                          <div className="text-[10px] text-[#475569] dark:text-[#8c93a1] uppercase tracking-[0.2em] font-medium">{feature.stat1.label}</div>
                       </div>
                       <div>
                          <div className="text-4xl font-medium text-[#0F172A] dark:text-white mb-2 tracking-tight">{feature.stat2.value}</div>
                          <div className="text-[10px] text-[#475569] dark:text-[#8c93a1] uppercase tracking-[0.2em] font-medium">{feature.stat2.label}</div>
                       </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Ghost Layer to lock height and prevent jumping */}
              <div className="flex flex-col opacity-0 pointer-events-none">
                 <h2 className="text-5xl lg:text-6xl font-bold mb-10 leading-[1.1] tracking-tighter">Ghost Layer</h2>
                 <p className="text-base lg:text-lg max-w-md mb-10 leading-[1.7] font-medium min-h-[96px]">Ghost Layer</p>
                 <div className="flex gap-12 pt-6 border-t border-transparent w-max">
                    <div className="pr-12 border-r border-transparent">
                       <div className="text-4xl font-medium mb-2 tracking-tight">000</div>
                       <div className="text-[10px] uppercase tracking-[0.2em] font-medium">Ghost</div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Static Premium CTA Button - Locked to the bottom */}
            <div className="mt-20">
              <button className="group relative inline-flex items-center gap-4 bg-[#16A34A] dark:bg-[#39e03d] text-white dark:text-[#050505] pl-6 pr-2 py-2 rounded-full font-semibold text-[11px] uppercase tracking-widest hover:bg-[#0F172A] dark:hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] pointer-events-auto">
                <span>Explore Capability</span>
                <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-black/5 dark:bg-black/10 flex items-center justify-center transition-transform duration-500 group-hover:bg-black/10 dark:bg-black/5 group-hover:translate-x-1">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Spinner Area with Vertical Fade Mask */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none z-10"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 15%, black 45%, black 55%, transparent 85%)',
              maskImage: 'linear-gradient(to bottom, transparent 15%, black 45%, black 55%, transparent 85%)'
            }}
          >
            {/* The Massive Track Wrapper to handle Y centering */}
            <div className="absolute top-1/2 right-[-400px] w-[800px] h-[800px] pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
              
              {/* Perfectly centered background glow (Core/Hub) */}
              <div className="absolute inset-0 m-auto w-[600px] h-[600px] bg-[#16A34A] dark:bg-[#39e03d] opacity-[0.03] blur-[120px]" style={{ borderRadius: '50%' }}></div>
              
              {/* The physical track line (static, pure CSS border) */}
              <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '50%', border: '60px solid #1a1f2b', boxSizing: 'border-box' }}></div>

              {/* The rotating container for the nodes (NO border, exact 800x800 bounds) */}
              <motion.div 
                className="absolute inset-0 z-10"
                style={{ rotate: trackRotate }}
              >
                 {/* The 4 Nodes */}
                 {features.map((feature, i) => {
                   // Remapped so Index 0 is Left (the active, visible position)
                   const posStyles = [
                     { top: '50%', left: '-26px', marginTop: '-56px' }, // Left (Index 0)
                     { bottom: '-26px', left: '50%', marginLeft: '-56px' }, // Bottom (Index 1)
                     { top: '50%', right: '-26px', marginTop: '-56px' }, // Right (Index 2)
                     { top: '-26px', left: '50%', marginLeft: '-56px' }, // Top (Index 3)
                   ][i];

                   return (
                     <div key={i} className="absolute" style={{...posStyles, width: '112px', height: '112px'}}>
                       <motion.div 
                         className="bg-[#F8FAFC] dark:bg-[#151922] flex items-center justify-center pointer-events-auto relative w-full h-full"
                         style={{
                           borderRadius: '50%',
                           border: '2px solid rgba(57,224,61,0.3)',
                           boxShadow: '0 0 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(57,224,61,0.1)',
                           rotate: nodeRotate
                         }}
                       >
                          <div className="relative z-10 flex flex-col items-center">
                            {feature.icon}
                          </div>
                       </motion.div>
                     </div>
                   )
                 })}
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  const navigate = useNavigate();

  return (
    <div className={`w-full`}>
      <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#0B101A] text-[#0F172A] dark:text-white font-sans relative flex flex-col">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between z-50 relative"
      >
        
        {/* Left Side: Logo + Nav */}
        <div className="flex items-center gap-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-bold text-sm tracking-wide text-[#0F172A] dark:text-white">TilBase</span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#334155] dark:text-[#e2e8f0]">
            <a href="#features" className="hover:text-[#0F172A] dark:text-white transition-colors">Platform</a>
            <a href="#chatbase" className="hover:text-[#0F172A] dark:text-white transition-colors">ChatBase</a>
            <a href="/docs" className="flex items-center gap-1 hover:text-[#0F172A] dark:text-white transition-colors">Docs <span className="material-symbols-outlined text-[14px]">expand_more</span></a>
            <a href="#pricing" className="hover:text-[#0F172A] dark:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#0F172A] dark:text-white transition-colors">Company</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 text-[12px] font-semibold text-[#475569] dark:text-[#8c93a1]">
          <a href="/signin" className="hover:text-[#0F172A] dark:text-white transition-colors">Log in</a>
          <button onClick={() => navigate('/signup')} className="text-[#0F172A] dark:text-white bg-[#0F172A]/5 dark:bg-[#ffffff10] border border-[#0F172A]/10 dark:border-[#ffffff15] px-5 py-1.5 rounded-full hover:bg-[#0F172A]/10 dark:bg-[#ffffff20] transition-colors">
            Sign Up
          </button>
          <button onClick={handleToggleTheme} className="text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white transition-colors">
            <span className="material-symbols-outlined text-[16px]">{isDarkMode ? "light_mode" : "dark_mode"}</span>
          </button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col relative pt-8">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center w-full min-h-[85vh]">
          {/* Background Blades with parallax */}
          <LeftBlade />
          <RightBlade />

          {/* Hero Text */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl pt-0"
          >
            <motion.div variants={fadeUpVariant} className="text-[10px] text-[#475569] dark:text-[#8c93a1] font-semibold tracking-widest uppercase mb-6">
              Trade Complexity For Simplicity.
            </motion.div>
            <motion.h1 className="text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.1] mb-6 text-[#0F172A] dark:text-[#f8f9fa] max-w-[900px]">
              {"Unlock the Full Potential".split(" ").map((word, i) => (
                <motion.span key={`line1-${i}`} variants={fadeUpVariant} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <br className="hidden md:block" />
              {"of Your Data Journey".split(" ").map((word, i) => (
                <motion.span key={`line2-${i}`} variants={fadeUpVariant} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-[14px] text-[#475569] dark:text-[#8c93a1] max-w-lg mb-8 leading-relaxed font-medium">
              Stay ahead of the market with real-time sync, powerful vector search, <br className="hidden md:block" /> and next-level scaling-all from one unified platform.
            </motion.p>
            <motion.button 
              variants={fadeUpVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-[#16A34A] dark:bg-[#39e03d] text-white dark:text-black font-bold text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#15803d] dark:bg-[#2fc433] transition-colors shadow-[0_0_20px_rgba(57,224,61,0.3)]"
            >
              DEPLOY NOW
            </motion.button>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[80%] lg:max-w-[1200px] mx-auto mt-12 px-4 pb-12"
          >
            <div className="w-full min-h-[550px] bg-white dark:bg-[#0d1117] rounded-2xl border border-[#E2E8F0] dark:border-[#222834] shadow-2xl p-6 md:p-8 relative overflow-hidden ring-1 ring-[#0F172A]/5 dark:ring-white/5 flex flex-col md:flex-row gap-8">

              {/* Sidebar (Aside) */}
              <div className="hidden md:flex flex-col gap-8 w-64 border-r border-[#E2E8F0] dark:border-[#222834] pr-6 relative z-10">
                 {/* Logo in Sidebar */}
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#16A34A] dark:bg-[#39e03d] rounded-lg flex items-center justify-center text-white dark:text-black font-bold text-xs">Tb</div>
                   <span className="font-bold text-base text-[#0F172A] dark:text-white tracking-wide">TilBase Analytics</span>
                 </div>
                 
                 {/* Navigation */}
                 <div className="flex flex-col gap-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                   <div className="flex items-center gap-3 text-[13px] font-semibold text-[#0F172A] dark:text-white bg-[#F8FAFC] dark:bg-[#151922] px-3 py-2.5 rounded-xl cursor-pointer shadow-inner border border-[#E2E8F0] dark:border-[#222834]">
                     <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] text-[18px]">storage</span> Dashboard
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">dashboard</span> Clusters
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">key</span> Database Access
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">lan</span> Network Access
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">security</span> Security
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span> Backups
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">monitoring</span> Monitoring
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">speed</span> Performance
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">public</span> Global
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">payments</span> Billing
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                   </div>
                   <div className="flex items-center gap-3 text-[13px] font-medium text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">contact_support</span> Support
                   </div>
                 </div>
              </div>

              {/* Main Panel */}
              <div className="flex-1 flex flex-col relative z-10">
                {/* Topbar */}
                <div className="flex items-center justify-between mb-12">
                   <div className="flex-1 max-w-md relative hidden md:block">
                     <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#565e6d] text-[18px]">search</span>
                     <input type="text" placeholder="Search Clusters..." className="w-full bg-[#F8FAFC] dark:bg-[#151922] border border-[#E2E8F0] dark:border-[#222834] rounded-full py-2.5 pl-12 pr-4 text-sm text-[#0F172A] dark:text-white placeholder-[#565e6d] focus:outline-none focus:border-[#39e03d]/50 transition-colors" />
                   </div>

                   <div className="flex items-center gap-6 ml-auto">
                     <div className="w-10 h-10 rounded-full bg-[#F8FAFC] dark:bg-[#151922] flex items-center justify-center text-[#475569] dark:text-[#8c93a1] hover:text-[#0F172A] dark:text-white transition-colors cursor-pointer border border-[#E2E8F0] dark:border-[#222834]">
                       <span className="material-symbols-outlined text-[18px]">notifications</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#39e03d] to-blue-500 p-[1.5px]">
                         <div className="w-full h-full bg-white dark:bg-[#222834] text-[#0F172A] dark:text-white flex items-center justify-center text-sm font-bold">T</div>
                       </div>
                       <div className="hidden sm:flex flex-col">
                         <span className="text-xs font-bold text-[#0F172A] dark:text-white">Tilux</span>
                         <span className="text-[10px] text-[#565e6d]">Pro Member</span>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Dashboard Widgets (Real App Clone) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#F8FAFC] dark:bg-[#151922] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] bg-[#39e03d]/10 p-2 rounded-lg">storage</span>
                        </div>
                        <p className="text-xs font-semibold text-[#475569] dark:text-[#8c93a1] mb-1">Total Clusters</p>
                        <p className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">8</p>
                    </div>
                    <div className="bg-[#F8FAFC] dark:bg-[#151922] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-blue-400 bg-blue-400/10 p-2 rounded-lg">database</span>
                        </div>
                        <p className="text-xs font-semibold text-[#475569] dark:text-[#8c93a1] mb-1">Total Projects</p>
                        <p className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">14</p>
                    </div>
                    <div className="bg-[#F8FAFC] dark:bg-[#151922] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-purple-400 bg-purple-400/10 p-2 rounded-lg">description</span>
                        </div>
                        <p className="text-xs font-semibold text-[#475569] dark:text-[#8c93a1] mb-1">Max Allowed Projects</p>
                        <p className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">50</p>
                    </div>
                    <div className="bg-[#F8FAFC] dark:bg-[#151922] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-orange-400 bg-orange-400/10 p-2 rounded-lg">hard_drive</span>
                            <span className="text-[10px] font-bold text-[#475569] dark:text-[#8c93a1]">42%</span>
                        </div>
                        <p className="text-xs font-semibold text-[#475569] dark:text-[#8c93a1] mb-2">Storage Used</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#222834] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#39e03d] to-emerald-400 w-[42%]"></div>
                            </div>
                            <span className="text-[9px] font-bold text-[#475569] dark:text-[#8c93a1]">420gb / 1tb</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2 bg-[#F8FAFC] dark:bg-[#151922] rounded-xl shadow-sm overflow-hidden border border-[#E2E8F0] dark:border-[#222834]">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#222834] flex justify-between items-center">
                            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Recent Activity</h3>
                            <button className="text-[10px] font-bold text-[#16A34A] dark:text-[#39e03d] hover:underline uppercase tracking-wider">View All</button>
                        </div>
                        <div className="divide-y divide-[#222834]">
                            <div className="px-5 py-4 flex items-start gap-4 hover:bg-[#222834]/30 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-[#39e03d]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[#16A34A] dark:text-[#39e03d] text-[16px]">add_box</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white">New Cluster Provisioned</p>
                                    <p className="text-[11px] text-[#475569] dark:text-[#8c93a1] mb-1">Vector DB cluster deployed in US-East</p>
                                    <span className="text-[9px] text-[#565e6d]">Aug 9, 2026 • 03:45 PM</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#16A34A] dark:text-[#39e03d] bg-[#39e03d]/10 px-2 py-0.5 rounded">SUCCESS</span>
                            </div>
                            <div className="px-5 py-4 flex items-start gap-4 hover:bg-[#222834]/30 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-blue-500 text-[16px]">vpn_key</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white">API Key Rotated</p>
                                    <p className="text-[11px] text-[#475569] dark:text-[#8c93a1] mb-1">Production access key was rotated successfully.</p>
                                    <span className="text-[9px] text-[#565e6d]">Aug 8, 2026 • 11:20 AM</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#16A34A] dark:text-[#39e03d] bg-[#39e03d]/10 px-2 py-0.5 rounded">SUCCESS</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F8FAFC] dark:bg-[#151922] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full bg-[#16A34A] dark:bg-[#39e03d] text-white dark:text-black py-2.5 px-3 rounded-lg flex items-center justify-between font-bold text-xs transition-all hover:bg-[#15803d] dark:bg-[#2fc433]">
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                        Create New Cluster
                                    </span>
                                    <span className="material-symbols-outlined text-[16px] opacity-60">chevron_right</span>
                                </button>
                                <button className="w-full bg-[#F1F5F9] dark:bg-[#222834] text-[#0F172A] dark:text-white py-2.5 px-3 rounded-lg flex items-center justify-between font-bold text-xs transition-all hover:bg-[#E2E8F0] dark:hover:bg-[#2d3545]">
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                                        Add Database User
                                    </span>
                                    <span className="material-symbols-outlined text-[16px] opacity-30">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* --- RESTORED SECTIONS (Animated) --- */}

        {/* New: Code Meets UI Section */}
        <CodeMeetsUISection />

        {/* Restored: Features Section (Sticky Scroll) */}
        <PlatformCapabilities />

        {/* Restored: ChatBase / AI Section */}
        <motion.section 
          id="chatbase" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="min-h-screen flex items-center py-24 px-6 w-full bg-[#F8FAFC] dark:bg-[#0B101A] relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#16A34A] opacity-5 dark:opacity-10 blur-[120px] pointer-events-none rounded-full"></div>

          <div className="max-w-[1300px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            {/* Left Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
               <motion.div variants={fadeUpVariant} className="text-xs text-[#16A34A] dark:text-[#39e03d] font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#16A34A] dark:bg-[#39e03d] animate-pulse"></span>
                 Native Vector Search
               </motion.div>
               <motion.h2 variants={fadeUpVariant} className="text-5xl lg:text-[4rem] font-bold text-[#0F172A] dark:text-white mb-8 leading-[1.1] tracking-tight">
                 Data, made <br/> conversational.
               </motion.h2>
               <motion.p variants={fadeUpVariant} className="text-base lg:text-lg text-[#475569] dark:text-[#8c93a1] leading-relaxed mb-10 font-medium max-w-lg">
                 Stop building fragile ETL pipelines. TilBase auto-vectorizes your NoSQL/SQL data at the edge, offering Zero-ETL Retrieval-Augmented Generation out of the box.
               </motion.p>
               <motion.div variants={fadeUpVariant}>
                 <button 
                   onClick={() => navigate('/docs')} 
                   className="bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] px-8 py-4 rounded-full text-sm font-semibold hover:bg-black dark:hover:bg-[#E2E8F0] transition-colors shadow-lg hover:shadow-xl w-fit flex items-center gap-2"
                 >
                   Read AI Docs
                   <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                 </button>
               </motion.div>
            </div>
            
            {/* Right Side (Chat Interface) */}
            <motion.div 
              variants={fadeUpVariant}
              className="w-full lg:w-1/2 flex justify-end"
            >
               <div className="w-full max-w-[600px] bg-white/60 dark:bg-[#151922]/60 backdrop-blur-2xl border border-[#E2E8F0] dark:border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                  {/* User message */}
                  <div className="flex gap-4 items-start mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#0d1117] border border-[#E2E8F0] dark:border-[#222834] shrink-0 flex items-center justify-center text-xs font-bold text-[#0F172A] dark:text-white">U</div>
                    <div className="text-[15px] text-[#334155] dark:text-[#cbd5e1] font-medium leading-relaxed pt-2">
                      "How many enterprise users signed up from the EU today?"
                    </div>
                  </div>
                  {/* Bot message */}
                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#16A34A] shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.4)]"><span className="material-symbols-outlined text-white text-[18px]">smart_toy</span></div>
                    <div className="w-full">
                      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-[15px] text-[#0F172A] dark:text-white font-medium leading-relaxed pt-2">
                        I found 1,423 enterprise signups from the EU region today.
                      </motion.div>
                      {/* Code Block */}
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 1, duration: 0.5 }}
                        className="mt-6 bg-[#0F172A] dark:bg-[#0A0F1C] p-6 rounded-2xl border border-[#1E293B] dark:border-white/5 font-mono text-[13px] leading-loose text-[#94a3b8]"
                      >
                        <span className="text-[#39e03d]">SELECT</span> count(*) <span className="text-[#39e03d]">FROM</span> users<br/>
                        <span className="text-[#39e03d]">WHERE</span> region='EU' <span className="text-[#39e03d]">AND</span> tier='enterprise';
                      </motion.div>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </motion.section>

        {/* The New Roadmap Section */}
        <RoadmapSection />

        {/* New: Editorial Services Section */}
        <EditorialServicesSection />

        {/* New: Comparison Section */}
        <ComparisonSection />

        {/* New: Performance Benchmarks Section */}
        <PerformanceBenchmarksSection />

        {/* Restored: Pricing */}
        <motion.section 
          id="pricing" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="py-24 px-6 w-full max-w-[1200px] mx-auto border-b border-[#E2E8F0] dark:border-[#222834]"
        >
           <div className="text-center mb-16">
             <motion.h2 variants={fadeUpVariant} className="text-3xl font-bold text-[#0F172A] dark:text-white mb-4">Choose your best plan</motion.h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { name: "Small Plan", price: "$39", features: ["Free domain", "Monthly Bandwidth 1GB", "SSD Storage 1TB", "SSL Certificate", "Website SEO", "Google Analytics", "Messenger Live Chat", "Full Support"] },
               { name: "Medium Plan", price: "$69", recommended: true, features: ["Free domain", "Monthly Bandwidth 1GB", "SSD Storage 1TB", "SSL Certificate", "Website SEO", "Google Analytics", "Messenger Live Chat", "Full Support"] },
               { name: "Large Plan", price: "$99", features: ["Free domain", "Monthly Bandwidth 1GB", "SSD Storage 1TB", "SSL Certificate", "Website SEO", "Google Analytics", "Messenger Live Chat", "Full Support"] }
             ].map((tier, i) => (
               <motion.div 
                 variants={fadeUpVariant}
                 whileHover={{ y: -10 }}
                 key={i} 
                 className={`overflow-hidden rounded-[2rem] ${tier.recommended ? 'bg-gradient-to-br from-[#16A34A] to-emerald-600 dark:from-[#39e03d] dark:to-[#16A34A] text-white dark:text-black shadow-[0_20px_50px_rgba(22,163,74,0.15)] dark:shadow-[0_20px_50px_rgba(57,224,61,0.15)]' : 'bg-white dark:bg-[#151922] text-[#0F172A] dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]'} relative flex flex-col transition-all duration-300 min-h-[500px] p-8`}
               >
                 {/* Decorative background glow mimicking the wave */}
                 <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3 ${tier.recommended ? 'bg-white/10 dark:bg-black/10' : 'bg-[#E2E8F0]/30 dark:bg-white/5'}`}></div>
                 
                 <h3 className="text-center text-xl font-bold mb-10 z-10">{tier.name}</h3>
                 
                 <ul className="space-y-3 mb-16 flex-1 z-10">
                   {tier.features.map((f, j) => (
                     <li key={j} className="flex items-center gap-3 text-xs font-medium opacity-90">
                       <span className="material-symbols-outlined text-[14px] font-bold">check</span> {f}
                     </li>
                   ))}
                 </ul>

                 <div className="flex flex-col mb-2 z-10">
                   <div className="text-4xl font-bold tracking-tight">{tier.price}</div>
                   <span className="text-[11px] opacity-70 mt-1 font-medium">permonth</span>
                 </div>

                 {/* The Cutout Button Wrapper */}
                 <div className="absolute -bottom-[2px] -right-[2px] pb-[2px] pr-[2px] pt-4 pl-4 rounded-tl-[2.5rem] rounded-br-[2rem] z-20 bg-[#F8FAFC] dark:bg-[#0B101A]">
                   
                   {/* Top Inverted Corner (Masking the right edge) */}
                   <div className="absolute bottom-full right-0 w-6 h-6 dark:hidden" style={{ background: 'radial-gradient(circle at top left, transparent 24px, #F8FAFC 0)' }} />
                   <div className="absolute bottom-full right-0 w-6 h-6 hidden dark:block" style={{ background: 'radial-gradient(circle at top left, transparent 24px, #0B101A 0)' }} />

                   {/* Left Inverted Corner (Masking the bottom edge) */}
                   <div className="absolute bottom-0 right-full w-6 h-6 dark:hidden" style={{ background: 'radial-gradient(circle at top left, transparent 24px, #F8FAFC 0)' }} />
                   <div className="absolute bottom-0 right-full w-6 h-6 hidden dark:block" style={{ background: 'radial-gradient(circle at top left, transparent 24px, #0B101A 0)' }} />

                   {/* The Button */}
                   <button className={`px-8 py-5 rounded-tl-[1.5rem] rounded-br-[2rem] rounded-tr-xl rounded-bl-xl font-semibold text-xs flex items-center gap-2 transition-colors ${tier.recommended ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-[#E2E8F0]' : 'bg-white dark:bg-[#222834] text-[#0F172A] dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#2d3545] shadow-sm dark:shadow-none'}`}>
                     Sign up <span className="text-[10px] ml-1">&#9658;</span>
                   </button>
                 </div>
               </motion.div>
             ))}
           </div>
        </motion.section>

        {/* Restored: FAQ */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="py-24 md:py-32 px-6 w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start"
        >
           <div className="md:col-span-5 flex flex-col text-left">
             <motion.div variants={fadeUpVariant} className="text-[#16A34A] dark:text-[#39e03d] text-sm font-bold mb-4">
               Frequently asked questions
             </motion.div>
             <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-[2.75rem] font-bold tracking-tight text-[#0F172A] dark:text-white mb-6 leading-[1.15]">
               Frequently asked <br className="hidden md:block"/><span className="text-[#16A34A] dark:text-[#39e03d]">questions</span>
             </motion.h2>
             <motion.p variants={fadeUpVariant} className="text-[#64748B] dark:text-[#8c93a1] text-sm md:text-[15px] leading-relaxed max-w-[90%]">
               Choose a plan that fits your business needs and budget. No hidden fees, no surprises—just straightforward database pricing for powerful data management.
             </motion.p>
           </div>
           
           <motion.div variants={fadeUpVariant} className="md:col-span-7 flex flex-col gap-3">
             <FAQItem 
               question="What is TilBase?" 
               answer="TilBase is an all-in-one data management platform designed to simplify edge databases, automate vectors, track performance in real-time, and ensure secure transactions for businesses of all sizes." 
             />
             <FAQItem 
               question="How does TilBase work?" 
               answer="TilBase uses a unique multi-engine architecture at the edge, allowing you to use Document, Vector, and Relational databases concurrently within the same cluster without ETL pipelines." 
             />
             <FAQItem 
               question="Is TilBase secure?" 
               answer="Yes, we employ industry-standard encryption, role-based access control, and strict compliance measures to ensure your data is always safe." 
             />
             <FAQItem 
               question="Can TilBase integrate with other tools?" 
               answer="Absolutely. TilBase offers a comprehensive REST API and native SDKs that allow seamless integration with your existing infrastructure and accounting software." 
             />
           </motion.div>
        </motion.section>
        
      </main>

      {/* Premium Full-Width Themed Footer */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="w-full bg-white dark:bg-[#0d1117] border-t border-[#E2E8F0] dark:border-[#222834]"
      >
        <div className="max-w-[1300px] mx-auto p-10 md:p-16 flex flex-col justify-between min-h-[450px]">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            {/* Logo */}
            <motion.div variants={fadeUpVariant} className="md:col-span-4 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 bg-[#16A34A] dark:bg-[#39e03d] rounded-md flex items-center justify-center font-bold text-white dark:text-black text-xs">Tb</div>
                 <span className="font-bold text-2xl text-[#0F172A] dark:text-white tracking-tight">tilbase</span>
              </div>
              <span className="text-[#64748b] dark:text-[#8c93a1] text-sm font-medium">A database platform that delivers</span>
            </motion.div>

            {/* Links 1 */}
            <motion.div variants={fadeUpVariant} className="md:col-span-2 flex flex-col gap-4">
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Process</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Services</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Showcase</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Pricing</a>
            </motion.div>

            {/* Links 2 */}
            <motion.div variants={fadeUpVariant} className="md:col-span-2 flex flex-col gap-4">
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">X</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Dribbble</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Pinterest</a>
              <a href="#" className="text-[15px] font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Linkedin</a>
            </motion.div>

            {/* Links 3 */}
            <motion.div variants={fadeUpVariant} className="md:col-span-4 flex flex-col gap-4 text-left md:text-right">
              <a href="#" className="text-[14px] text-[#64748b] dark:text-[#8c93a1] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Terms & Conditions</a>
              <a href="#" className="text-[14px] text-[#64748b] dark:text-[#8c93a1] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[14px] text-[#64748b] dark:text-[#8c93a1] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">Cookie Policy</a>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mt-auto pt-10 border-t border-[#E2E8F0] dark:border-[#222834]/60">
            {/* Back to top */}
            <motion.div variants={fadeUpVariant} className="flex justify-start">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-[#F1F5F9] dark:bg-white/10 hover:bg-[#E2E8F0] dark:hover:bg-white/20 transition-colors rounded-full pl-5 pr-1.5 py-1.5 flex items-center gap-4 text-sm text-[#0F172A] dark:text-white font-medium group">
                Back to top 
                <span className="w-8 h-8 rounded-full bg-[#0F172A] text-white dark:bg-white dark:text-black flex items-center justify-center material-symbols-outlined text-[16px] group-hover:-translate-y-0.5 transition-transform">arrow_upward</span>
              </button>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-4 md:items-center">
              <div className="w-full max-w-[280px]">
                <h3 className="text-[1.35rem] font-medium text-[#0F172A] dark:text-white tracking-tight leading-[1.25] mb-4">TilBase<br/>in your mailbox</h3>
                <div className="relative">
                  <input type="email" placeholder="name@example.com" className="w-full bg-[#F8FAFC] dark:bg-white border border-[#E2E8F0] dark:border-transparent rounded-full py-[14px] pl-5 pr-12 text-sm text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#16A34A]" />
                  <button className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-[#0F172A] dark:bg-[#0A0F1C] text-white flex items-center justify-center hover:bg-[#16A34A] dark:hover:bg-[#16A34A] transition-colors material-symbols-outlined text-[18px]">arrow_forward</button>
                </div>
              </div>
            </motion.div>

            {/* Contact & Copyright */}
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-6 md:items-end text-left md:text-right">
              <a href="mailto:hello@tilbase.io" className="text-sm font-medium text-[#475569] dark:text-[#e2e8f0] hover:text-[#16A34A] dark:hover:text-[#39e03d] transition-colors">hello@tilbase.io</a>
              <div className="text-[13px] text-[#64748b] dark:text-[#8c93a1] flex flex-col gap-0.5">
                <span>TilBase</span>
                <span>{new Date().getFullYear()} © All rights reserved</span>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.footer>

    </div>
    </div>
  );
};

export default LandingPage;
