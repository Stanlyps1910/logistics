import { motion } from "framer-motion";
import { Award, Shield, Users, Globe2 } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const timelineMilestones = [
  {
    year: "2018",
    title: "Algorithmic Foundation",
    description: "NexaFreight Logistics is founded in Bengaluru, India's tech hub. Our developers finalize the core neural routing algorithm, laying the basis for automated scheduling."
  },
  {
    year: "2020",
    title: "Autonomous Fleet Launch",
    description: "Launch of our first 24 self-driving freight trucks in interstate highways. Energy consumption decreases by 22% while cargo punctuality increases to 99.8%."
  },
  {
    year: "2023",
    title: "Global Port Integration",
    description: "Deployment of smart containers and drone delivery networks across 140 countries, enabling end-to-end telemetry mapping and tracking transparency."
  },
  {
    year: "2026",
    title: "Hypersonic & Space-corridor Delivery",
    description: "Launch of express hypersonic aerospace flight lanes connecting Bengaluru to London, Tokyo, and Silicon Valley in under 6 hours."
  }
];

const leaders = [
  {
    name: "Dr. Silas Vance",
    role: "Chief Executive Officer",
    background: "Ex-NASA Systems Architect. PhD in Computer Science from MIT.",
    tag: "Founder"
  },
  {
    name: "Lana Thorne",
    role: "Chief Operations Officer",
    background: "20+ years managing cargo shipping operations and port logistics.",
    tag: "Operations"
  },
  {
    name: "Vikram Dev",
    role: "Chief Technology Officer",
    background: "Distributed systems expert. Designed our secure route optimization systems.",
    tag: "Technology"
  },
  {
    name: "Zara Chen",
    role: "Chief of Air Freight Operations",
    background: "Former commercial aviation director, pioneering global air freight lanes.",
    tag: "Aerospace"
  }
];

export default function About() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container pt-32 pb-24 grid-lines"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <Users className="w-3.5 h-3.5" />
            <span>NexaFreight Logistics Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            OUR HISTORY
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            A look into our founders, timeline, and journey to modern logistics.
          </p>
        </div>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
          <div>
            <h2 className="text-3xl font-black text-dark font-display uppercase tracking-tight mb-6">
              OUR MISSION & VISION
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                In an era of unpredictable port delays and supply chain bottlenecks, traditional logistics models are falling behind. NexaFreight Logistics was founded to provide fast, reliable, and intelligent routing.
              </p>
              <p>
                We do not just ship containers; we actively monitor every cargo path and vehicle. By analyzing weather, customs clearance, and traffic positions in real-time, we route around delays before they happen.
              </p>
              <p>
                From our advanced truck fleets on highways to priority air freight systems, our operations are fast, secure, and environmentally sustainable.
              </p>
            </div>
            
            {/* Core Values badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 text-center">
                <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-dark">Security</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 text-center">
                <Globe2 className="w-5 h-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-dark">Precision</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 text-center">
                <Award className="w-5 h-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-dark">Integrity</span>
              </div>
            </div>
          </div>

          <div className="relative glass-card p-6 rounded-3xl border border-blue-100 bg-white/60 aspect-video flex flex-col justify-center">
            {/* Corporate facts list */}
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-primary mb-4 border-b border-slate-100 pb-2">
              Operations Overview
            </h3>
            <ul className="space-y-3.5">
              {[
                { label: "Active Logistics Hubs", val: "1,240 nodes" },
                { label: "Highway Network Coverage", val: "94.8% of highways" },
                { label: "Delay Incidence Rate", val: "0.002% annually" },
                { label: "Sustainability Rating", val: "100% Net Zero certified" }
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm font-sans">
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <span className="font-display font-bold text-dark uppercase">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Milestone Timeline Section */}
        <section className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-dark tracking-tight font-display uppercase">
              COMPANY MILESTONES
            </h2>
            <p className="mt-4 text-slate-500">
              Our evolution from a local logistics partner to a global freight network.
            </p>
          </div>

          {/* Timeline Connector Graphic */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-highlight transform md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(0,180,216,0.3)]"></div>

            <div className="space-y-12">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Circle Pinpoint indicator */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-primary transform -translate-x-1.5 md:-translate-x-2 z-10 shadow-[0_0_8px_rgba(0,71,204,0.4)]"></div>

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:order-2"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="glass-card p-6 rounded-2xl border border-blue-100 bg-white/70 hover:border-secondary/40 shadow-sm"
                    >
                      <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-xs font-black font-display text-primary uppercase tracking-widest mb-3">
                        {m.year}
                      </span>
                      <h3 className="text-lg font-bold font-display uppercase tracking-wide text-dark mb-2">
                        {m.title}
                      </h3>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                        {m.description}
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Empty spacer div for layout matching */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Grid */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-dark tracking-tight font-display uppercase">
              LEADERSHIP TEAM
            </h2>
            <p className="mt-4 text-slate-500">
              The team managing NexaFreight's global logistics network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-2xl border border-blue-100 bg-white/70 hover:border-secondary/40 flex flex-col justify-between"
              >
                <div>
                  {/* Header Frame / Initial Badge */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-display font-black text-primary text-lg mb-4">
                    {leader.name.split(" ").pop()[0]}
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-slate-400 font-display uppercase">
                    {leader.tag}
                  </span>
                  
                  <h3 className="text-lg font-bold font-display uppercase tracking-wide text-dark mt-1">
                    {leader.name}
                  </h3>
                  
                  <p className="text-primary text-xs font-bold font-display uppercase tracking-wide mt-0.5">
                    {leader.role}
                  </p>
                </div>

                <p className="text-slate-500 text-xs mt-4 pt-4 border-t border-slate-100 leading-relaxed">
                  {leader.background}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
