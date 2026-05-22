import { motion } from "framer-motion";
import { Award, Shield, Users, Globe2, Heart, Scale, Recycle, Eye, Target, Compass } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const timelineMilestones = [
  {
    year: "2018",
    title: "Company Founding",
    description: "Sri Ranga Logistics is founded in Bengaluru with a single Tata Ace, focusing on dedicated local intra-city logistics."
  },
  {
    year: "2021",
    title: "Upcountry & FTL Expansion",
    description: "Expanded fleet capability to support Full Truckload (FTL) and upcountry movements, integrating a wider market network."
  },
  {
    year: "2024",
    title: "Green Fleet Deployment",
    description: "Pioneered sustainable green logistics by deploying eco-friendly EV and CNG vehicles to reduce CO2 emissions."
  },
  {
    year: "2026",
    title: "Premier Pan-India Partner",
    description: "Operating a diverse fleet of 30+ owned vehicles and a trusted network, offering low-emission supply chain solutions."
  }
];

const coreValues = [
  {
    title: "Collaboration",
    description: "Deeply understanding customer needs.",
    icon: Users
  },
  {
    title: "Quality & Commitment",
    description: "A passionate drive for operational excellence.",
    icon: Award
  },
  {
    title: "Trust & Integrity",
    description: "Transparent, honest, and ethical dealings.",
    icon: Shield
  },
  {
    title: "Eco-Responsibility",
    description: "Prioritizing green logistics to actively reduce CO2 emissions.",
    icon: Recycle
  },
  {
    title: "Safety & Security",
    description: "Ensuring the utmost safety of our people and cargo.",
    icon: Scale
  },
  {
    title: "Accountability",
    description: "Taking ownership of results with open communication.",
    icon: Heart
  }
];

const leaders = [
  {
    name: "Sanjay Verma",
    role: "Chief Executive Officer",
    background: "Logistics industry veteran with over 25 years of experience leading supply chain operations.",
    tag: "Founder"
  },
  {
    name: "Anjali Sen",
    role: "Chief Operations Officer",
    background: "20+ years managing cargo shipping operations, warehouse logistics, and port relations.",
    tag: "Operations"
  },
  {
    name: "Vikram Dev",
    role: "Chief Technology Officer",
    background: "Distributed systems expert. Designed our secure route optimization and tracking systems.",
    tag: "Technology"
  },
  {
    name: "Zara Khan",
    role: "Chief of Fleet Operations",
    background: "Expert in green logistics and resource management, overseeing our transition to EV & CNG fleets.",
    tag: "Fleet Management"
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <Users className="w-3.5 h-3.5" />
            <span>Sri Ranga Logistics Profile</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            OUR BRAND PROFILE
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Learn about our vision, values, milestones, and sustainable logistics solutions.
          </p>
        </div>

        {/* Vision, Mission & Philosophy */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="glass-card p-8 rounded-3xl border border-emerald-100 bg-white/70 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-primary">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-dark mb-4">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To consistently exceed customer expectations through collaborative partnerships, driving sustainable growth via exceptional quality, diversity, and integrity.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-emerald-100 bg-white/70 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-dark mb-4">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To be recognized as a leader in the Indian transportation industry by setting benchmarks in general transport, heavy machinery moving, and customized contract logistics.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-emerald-100 bg-white/70 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-primary">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-dark mb-4">Our Philosophy</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We operate on a "Service First" mentality. By treating freight management as a true partnership between our clients, employees, and drivers, we place your business at the centre of everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
          <div>
            <h2 className="text-3xl font-black text-dark font-display uppercase tracking-tight mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Founded in 2018 with a single Tata Ace, Sri Ranga Logistics (SRT) has grown into a premier, pan-India logistics partner based in Bengaluru. Today, we operate a diverse fleet of 30+ owned vehicles—including Eco-Friendly EVs and CNG models—complemented by a trusted market network.
              </p>
              <p>
                We seamlessly blend operational excellence with environmental responsibility to deliver sustainable, low-emission supply chain solutions. Outsourcing your logistics to SRT allows you to mitigate risks, eliminate hidden costs, and focus entirely on your core business.
              </p>
            </div>
          </div>

          <div className="relative glass-card p-6 rounded-3xl border border-emerald-100 bg-white/60 aspect-video flex flex-col justify-center">
            {/* Corporate facts list */}
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-primary mb-4 border-b border-slate-100 pb-2">
              Operations Overview
            </h3>
            <ul className="space-y-3.5">
              {[
                { label: "Active Fleet Vehicles", val: "30+ Owned Vehicles" },
                { label: "Green Energy Deployment", val: "EV & CNG Fleet" },
                { label: "On-Time Reliability Rate", val: "99.8% Annually" },
                { label: "HQ Location", val: "Bengaluru, Karnataka" }
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm font-sans">
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <span className="font-display font-bold text-dark uppercase">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-dark tracking-tight font-display uppercase">
              OUR 6 CORE VALUES
            </h2>
            <p className="mt-4 text-slate-500">
              The fundamental principles that guide our everyday logistics operations and client interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-emerald-100/50 shadow-[0_4px_20px_rgba(0,76,41,0.02)] hover:border-secondary/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-display uppercase tracking-wider text-dark mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Milestone Timeline Section */}
        <section className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-dark tracking-tight font-display uppercase">
              COMPANY MILESTONES
            </h2>
            <p className="mt-4 text-slate-500">
              Our journey from a single local vehicle to an eco-friendly transport fleet.
            </p>
          </div>

          {/* Timeline Connector Graphic */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-highlight transform md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>

            <div className="space-y-12">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Circle Pinpoint indicator */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-primary transform -translate-x-1.5 md:-translate-x-2 z-10 shadow-[0_0_8px_rgba(0,76,41,0.4)]"></div>

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:order-2"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="glass-card p-6 rounded-2xl border border-emerald-100 bg-white/70 hover:border-secondary/40 shadow-sm"
                    >
                      <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-xs font-black font-display text-primary uppercase tracking-widest mb-3">
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
              The professional management team driving Sri Ranga Logistics toward sustainable growth.
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
                className="glass-card p-6 rounded-2xl border border-emerald-100 bg-white/70 hover:border-secondary/40 flex flex-col justify-between"
              >
                <div>
                  {/* Header Frame / Initial Badge */}
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center font-display font-black text-primary text-lg mb-4">
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
