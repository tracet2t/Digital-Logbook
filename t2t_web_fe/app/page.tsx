import React from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Menu,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  PenTool,
  AlertTriangle,
  XCircle,
  BrainCircuit,
  MessageSquare,
  Trophy,
  Laptop,
  TrendingUp,
  Film,
  Lightbulb,
  Building2,
  ChevronRight,
  Sparkles,
  User,
  Clock,
} from "lucide-react";

export default function Home() {
  const programs = [
    {
      icon: Laptop,
      color: "blue",
      title: "Technology & IT",
      subtitle: "CRISP Foundation / Practitioner / Elite",
      features: [
        "AI Integration",
        "Systems Architecture",
        "QA Automation",
        "Modern Dev Practices",
      ],
    },
    {
      icon: TrendingUp,
      color: "orange",
      title: "Management & Leadership",
      subtitle: "Lead-X Acceleration",
      features: [
        "Problem Solving",
        "Strategic Communication",
        "Value Creation",
        "Team Dynamics",
      ],
    },
    {
      icon: Film,
      color: "purple",
      title: "Creative & Media",
      subtitle: "IFAP (Filmmaker Accelerator)",
      features: [
        "Visual Storytelling",
        "Production Workflows",
        "Global Alignment",
        "Pitching & Strategy",
      ],
    },
    {
      icon: Lightbulb,
      color: "green",
      title: "Professional & Future Skills",
      subtitle: "Future-Proof Capabilities",
      features: [
        "AI Readiness",
        "Professional Communication",
        "Career Acceleration",
        "Research Excellence",
      ],
    },
  ];

  const partnerLogos = [
    "99x",
    "Nagarro",
    "TRACE",
    "WSO2",
    "Virtusa",
    "Sysco LABS",
    "Open University",
    "IIBA",
    "SLIIT",
    "IFS",
    "Dialog",
    "IIT",
  ];

  const upcomingEvents = [
    {
      title: "AI in Product Management",
      desc: "Learn how to leverage LLMs to automate product backlogs and user research synthesis.",
      date: "Nov 12, 2026",
      time: "10:00 AM",
      host: "Sarah Jenkins",
      hostTitle: "Sr. Product Manager",
      img: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "The Future of Fintech",
      desc: "Deep dive into execution protocols and high-frequency trading infrastructure architecture.",
      date: "Nov 15, 2026",
      time: "02:00 PM",
      host: "David Chen",
      hostTitle: "Fintech Lead @ TRACE",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Directing for Digital",
      desc: "A masterclass on visual storytelling workflows for global streaming platforms.",
      date: "Nov 18, 2026",
      time: "09:00 AM",
      host: "Marcus Thorne",
      hostTitle: "Film Director",
      img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Strategic Leadership",
      desc: "Mastering the art of communication and team dynamics in hyper-growth startups.",
      date: "Nov 22, 2026",
      time: "04:00 PM",
      host: "Elena Rodriguez",
      hostTitle: "Operations Director",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- Header --- */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-xl leading-none">
                T
              </span>
            </div>
            <span className="font-extrabold text-xl tracking-tight uppercase">
              THEORY TO TRADE
            </span>
          </div>

          <nav className="hidden lg:flex gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Programs
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Mentorship
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Resources
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-bold text-slate-600 hover:text-slate-900"
            >
              Login
            </a>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
              Apply Now
            </button>
          </div>

          <button className="lg:hidden text-slate-900">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase mb-8 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Enrollment Open for 2026
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6 text-slate-900">
              Build Industry-Ready Skills.
              <br />
              <span className="text-blue-600">Across Any Industry.</span>
              <br />
              At Any Stage.
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg">
              T2T by TRACE is a skill and talent bridging platform that helps
              students, graduates, and professionals gain real-world capability
              through mentorship, guided projects, and industry-driven learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="bg-[#FF6B00] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e66000] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 group">
                Apply Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center">
                Explore Programs
              </button>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              Work With Us / Become a Mentor <ChevronRight size={16} />
            </a>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[2rem] transform translate-x-4 translate-y-4 border border-blue-600/10"></div>

            <div className="relative rounded-[2rem] bg-white shadow-2xl border border-slate-100 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="relative rounded-2xl overflow-hidden mb-6 group">
                <img
                  src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Live Workshop"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Live Workshop
                </div>
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Coming Up
                </div>
              </div>

              <div className="px-6 pb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                  Market Infrastructure &<br />
                  Execution Protocols
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                  An intensive 2-day technical workshop for aspiring developers
                  bridging the gap to fintech.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                        Date & Time
                      </p>
                      <p>October 24-25, 2026 • 09:00 AM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                        Location
                      </p>
                      <p>Hybrid: Innovation Lab & Remote Sync</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                        alt="Instructor"
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                        alt="Instructor"
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Lead Instructors
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        Dr. Turing & M. Chen
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full inline-block">
                      4 Seats Left
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK STATS --- */}
      <section className="bg-[#0a0f1d] text-white py-16 px-6 relative overflow-hidden border-y border-white/5">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 divide-x divide-white/10">
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-6xl font-black mb-2 text-blue-400 tracking-tighter">
                300<span className="text-white">+</span>
              </h3>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Participants Trained
              </p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-6xl font-black mb-2 text-orange-500 tracking-tighter">
                20<span className="text-white">+</span>
              </h3>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Programs Conducted
              </p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-6xl font-black mb-2 text-blue-400 tracking-tighter">
                50<span className="text-white">+</span>
              </h3>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Mentors Engaged
              </p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-6xl font-black mb-2 text-orange-500 tracking-tighter">
                150<span className="text-white">+</span>
              </h3>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Projects Completed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHO IS THIS FOR --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
            Who Is This For
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Built for Anyone Who Wants to
            <br />
            Grow Beyond Theory
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: GraduationCap,
              color: "blue",
              title: "Students",
              desc: "Turn classroom knowledge into real-world skills.",
            },
            {
              icon: Award,
              color: "orange",
              title: "Graduates",
              desc: "Build portfolios and confidence to enter industry.",
            },
            {
              icon: Briefcase,
              color: "slate",
              title: "Young Professionals",
              desc: "Upskill, pivot, and accelerate your career trajectory.",
            },
            {
              icon: PenTool,
              color: "red",
              title: "Creators & Specialists",
              desc: "Learn from industry experts in your specific domain.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${item.color === "orange" ? "[#FFF0E5]" : item.color + "-50"} text-${item.color === "orange" ? "[#FF6B00]" : item.color === "slate" ? "slate-800" : item.color + "-600"}`}
              >
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- THE PROBLEM --- */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-widest uppercase mb-6">
              The Industry Gap
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Why Most Learning Does not Translate to Success.
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-8">
              Traditional education provides the theory, but modern industries
              demand execution.
            </p>
            <div className="p-6 bg-blue-600 text-white rounded-2xl font-bold text-xl inline-block shadow-lg shadow-blue-600/20">
              T2T is built to fix this gap.
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-1 gap-6">
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-red-50/50 border border-red-100">
              <AlertTriangle className="text-red-500 shrink-0 mt-1" size={28} />
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Learning without application
                </h4>
                <p className="text-slate-600 font-medium">
                  Watching tutorials and passing multiple-choice exams does not
                  prepare you for production environments.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-orange-50/50 border border-orange-100">
              <XCircle className="text-[#FF6B00] shrink-0 mt-1" size={28} />
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Lack of real mentorship
                </h4>
                <p className="text-slate-600 font-medium">
                  Without feedback from practitioners who have actually done the
                  job, growth stagnates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <Briefcase className="text-slate-500 shrink-0 mt-1" size={28} />
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  No portfolio or proof of work
                </h4>
                <p className="text-slate-600 font-medium">
                  Resumes tell, portfolios show. Most learners graduate without
                  tangible proof of their capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE T2T MODEL --- */}
      <section className="py-24 px-6 bg-[#0f172a] text-white overflow-hidden relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              Our Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              How T2T Builds Real Skills
            </h2>
            <p className="text-blue-300 text-xl font-medium max-w-2xl mx-auto italic opacity-90">
              "At T2T, learning is not complete until you can demonstrate it."
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 z-0"></div>

            {[
              {
                num: "01",
                icon: BrainCircuit,
                title: "Learn",
                desc: "Industry-relevant concepts across multiple domains.",
              },
              {
                num: "02",
                icon: Laptop,
                title: "Apply",
                desc: "Hands-on projects and real-world scenarios.",
              },
              {
                num: "03",
                icon: MessageSquare,
                title: "Get Coached",
                desc: "Mentor guidance, expert feedback, and iteration.",
              },
              {
                num: "04",
                icon: Trophy,
                title: "Build Proof",
                desc: "Concrete portfolio, real outcomes, and confidence.",
              },
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-[#1e293b] rounded-3xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                  <step.icon
                    size={32}
                    className="text-blue-400 group-hover:text-blue-300 transition-colors"
                  />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-sm font-black shadow-lg border-2 border-[#0f172a]">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 font-medium px-4 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROGRAM ECOSYSTEM (WITH MARQUEE) --- */}
      <section className="py-24 px-6 bg-slate-50 overflow-hidden relative">
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-scroll-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-scroll {
            animation: marquee-scroll 35s linear infinite;
          }
          .animate-marquee-scroll-reverse {
            animation: marquee-scroll-reverse 35s linear infinite;
          }
          .pause-on-hover:hover .animate-marquee-scroll,
          .pause-on-hover:hover .animate-marquee-scroll-reverse {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto relative z-10 pointer-events-none">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Programs Across Multiple Domains
            </h2>
            <p className="text-slate-500 text-lg font-bold">
              Different paths. Same outcome: Industry-ready capability.
            </p>
          </div>
        </div>

        {/* Row 1: Left to Right */}
        <div className="mb-12 flex pause-on-hover">
          <div className="flex w-max animate-marquee-scroll gap-8 pr-8">
            {[...programs, ...programs].map((prog, idx) => (
              <div
                key={idx}
                className="w-[450px] shrink-0 bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-600 transition-all group shadow-sm hover:shadow-xl"
              >
                <div
                  className={`mb-6 p-4 rounded-2xl inline-block bg-${prog.color}-50 text-${prog.color === "orange" ? "[#FF6B00]" : prog.color + "-600"}`}
                >
                  <prog.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {prog.title}
                </h3>
                <p className="text-slate-500 font-bold text-sm mb-6 uppercase tracking-wider">
                  {prog.subtitle}
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-50 pt-6">
                  {prog.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-xs font-bold text-slate-600"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${prog.color === "orange" ? "[#FF6B00]" : prog.color + "-600"}`}
                      ></div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left (reverse) */}
        <div className="flex pause-on-hover">
          <div className="flex w-max animate-marquee-scroll-reverse gap-8 pr-8">
            {[...programs, ...programs].map((prog, idx) => (
              <div
                key={idx}
                className="w-[450px] shrink-0 bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-orange-500 transition-all group shadow-sm hover:shadow-xl"
              >
                <div
                  className={`mb-6 p-4 rounded-2xl inline-block bg-${prog.color}-50 text-${prog.color === "orange" ? "[#FF6B00]" : prog.color + "-600"}`}
                >
                  <prog.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {prog.title}
                </h3>
                <p className="text-slate-500 font-bold text-sm mb-6 uppercase tracking-wider">
                  {prog.subtitle}
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-50 pt-6">
                  {prog.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-xs font-bold text-slate-600"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${prog.color === "orange" ? "[#FF6B00]" : prog.color + "-600"}`}
                      ></div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* --- FOR ORGANIZATIONS (UPDATED B2B SOLUTIONS) --- */}
      <section className="py-32 px-6 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Side: Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black tracking-[0.3em] uppercase mb-8 border border-blue-400 shadow-inner">
                <Building2 size={14} /> B2B Solutions
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">
                Partner <br />
                With T2T
              </h2>
              <p className="text-blue-100 text-xl font-medium mb-12 leading-relaxed opacity-90">
                Whether you are a university looking to bridge the gap for
                students, or a company needing to upskill teams, we build the
                pipelines you need.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "Build industry-ready talent pipelines",
                  "Upskill existing teams rapidly",
                  "Run tailored corporate programs",
                ].map((txt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-5 p-4 bg-blue-700/30 backdrop-blur rounded-2xl border border-blue-400/20 group hover:bg-blue-700/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/50 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <p className="font-black text-lg md:text-xl tracking-tight">
                      {txt}
                    </p>
                  </div>
                ))}
              </div>

              <button className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/40">
                Get in Touch
              </button>
            </div>

            {/* Right Side: Clean Logos Grid (Popping out on hover) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {partnerLogos.map((partner, idx) => (
                <div
                  key={idx}
                  className="aspect-video flex items-center justify-center px-4 transition-all duration-500 group relative"
                >
                  {/* Invisible base text for alignment */}
                  <span className="font-black text-lg md:text-xl tracking-tighter text-center uppercase text-white/40">
                    {partner}
                  </span>

                  {/* Popping Card Overlay */}
                  <div className="absolute inset-0 bg-white scale-90 opacity-0 group-hover:scale-110 group-hover:opacity-100 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 pointer-events-none z-10">
                    <span className="font-black text-lg md:text-xl tracking-tighter text-center uppercase text-blue-600 px-4">
                      {partner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- UPCOMING EVENTS SECTION --- */}
      <section className="py-32 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
                Masterclasses & Workshops
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
                Events
              </h2>
              <p className="text-slate-500 text-lg font-medium">
                Join live sessions hosted by industry leaders and refine your
                execution skills.
              </p>
            </div>
            <button className="group flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest pb-2 border-b-2 border-slate-900 hover:text-blue-600 hover:border-blue-600 transition-all">
              View All Events{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                      {event.date}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Clock size={14} className="text-slate-300" />
                    {event.time} EST
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 flex-grow">
                    {event.desc}
                  </p>

                  {/* Host Info */}
                  <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Hosted By
                      </p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {event.host}
                      </p>
                      <p className="text-[10px] font-bold text-blue-600 mt-1">
                        {event.hostTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative py-32 px-6 bg-[#0a0f1d] text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600 rounded-full blur-[160px]"></div>
          <div className="absolute top-full left-1/4 w-[600px] h-[600px] bg-orange-600 rounded-full blur-[140px] opacity-30"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-10 mx-auto">
              <Sparkles size={14} className="animate-pulse" /> Your Future
              Starts Here
            </div>

            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95]">
              Ready to Move <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-orange-400">
                Beyond Learning?
              </span>
            </h2>

            <p className="text-slate-400 text-xl md:text-2xl font-medium mb-16 max-w-3xl mx-auto leading-relaxed">
              Join a program, work on real projects, and build skills that
              actually matter in the real world.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-24">
              <button className="w-full sm:w-auto bg-[#FF6B00] text-white px-14 py-6 rounded-2xl font-black text-2xl hover:bg-[#e66000] transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,107,0,0.3)] flex items-center justify-center gap-3 group">
                Apply for 2026
                <ArrowRight
                  size={28}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
              <button className="w-full sm:w-auto bg-white/5 backdrop-blur-xl text-white border border-white/10 px-14 py-6 rounded-2xl font-black text-2xl hover:bg-white/10 transition-all border-b-4 border-white/5">
                Browse All Paths
              </button>
            </div>

            <div className="mt-24">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em] opacity-60 italic">
                Built by practitioners for future practitioners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0a0f1d] text-slate-400 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">
                  T
                </span>
              </div>
              <span className="font-extrabold text-white tracking-tight uppercase">
                T2T
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-medium">
              Bridging the gap between theory and industry execution for
              students and professionals across the globe.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-red-500">
              Programs
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  CRISP Foundation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  IFAP Fellowship
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Lead-X Acceleration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Corporate Training
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-blue-500">
              Resources
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mentorship Network
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Apply as Mentor
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-orange-500">
              Legal
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <p>&copy; 2026 TRACE_PROTOCOL_FOUNDATION.</p>
          <div className="flex items-center gap-2 text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            System Status: Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
