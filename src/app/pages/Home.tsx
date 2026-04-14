import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  Leaf,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const heroImageScale = useTransform(heroProgress, [0, 1], [1.08, 1]);
  const heroImageY = useTransform(heroProgress, [0, 1], ['-5%', '8%']);
  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroTitleOpacity = useTransform(heroProgress, [0, 0.72, 1], [1, 0.8, 0]);
  const chapterAOpacity = useTransform(heroProgress, [0.05, 0.22, 0.34], [0, 1, 0]);
  const chapterBOpacity = useTransform(heroProgress, [0.34, 0.5, 0.66], [0, 1, 0]);
  const chapterCOpacity = useTransform(heroProgress, [0.66, 0.82, 0.98], [0, 1, 0]);

  const chapters = [
    {
      icon: Zap,
      title: 'Maximum Efficiency',
      text: 'Our panels deliver up to 24% efficiency with advanced PERC and bifacial technology, ensuring optimal generation in varied conditions.',
    },
    {
      icon: Shield,
      title: '30-Year Warranty',
      text: 'Industry-leading warranty coverage protects your investment with stable performance expectations over long production life cycles.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Monitoring',
      text: 'Real-time production visibility and optimization-ready telemetry support better energy decisions from anywhere.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      text: 'From consultation to installation and aftercare, certified teams keep delivery dependable and customer-centered.',
    },
    {
      icon: Award,
      title: 'Award Winning',
      text: 'Proven field performance and innovation milestones reflect a deep commitment to quality and measurable impact.',
    },
    {
      icon: Leaf,
      title: 'Carbon Neutral Impact',
      text: 'Every deployment helps offset emissions while advancing practical climate action at household and enterprise scales.',
    },
  ];

  const gallery = [
    {
      src: 'https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Field Installations',
    },
    {
      src: 'https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Rooftop Systems',
    },
    {
      src: 'https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Grid Intelligence',
    },
  ];

  return (
    <div className="min-h-screen text-white/86">
      <section ref={heroRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.img
            src="https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Solar panels"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: heroImageScale, y: heroImageY }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.2)_0%,rgba(8,8,12,0.58)_42%,rgba(8,8,12,0.9)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(73,201,255,0.24),transparent_36%),radial-gradient(circle_at_85%_70%,rgba(49,209,122,0.2),transparent_42%)]" />

          <motion.div
            className="relative mx-auto flex h-full w-full max-w-[var(--section-max-width)] flex-col justify-end px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
            style={{ y: heroTitleY, opacity: heroTitleOpacity }}
          >
            <p className="cinematic-eyebrow mb-4">Chapter 01 • The New Energy Rhythm</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-white/92 sm:text-6xl lg:text-7xl">
              Powering Tomorrow with Clean Energy Today
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/68 sm:text-lg">
              Join the solar revolution with advanced technology, sustainable
              systems, and dependable performance for homes, teams, and
              enterprises.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md border border-primary/35 bg-primary/90 px-8 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
              >
                Shop Products <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/energy-stats"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/6 px-8 py-3 font-semibold text-white/88 transition hover:bg-white/12"
              >
                View Energy Stats
              </Link>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute left-0 right-0 top-24 mx-auto hidden max-w-[var(--section-max-width)] px-8 lg:block">
            <motion.div
              style={{ opacity: chapterAOpacity }}
              className="max-w-md rounded-xl border border-white/10 bg-[#0d0f16]/72 p-4 backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">Scene A</p>
              <p className="mt-2 text-sm text-white/76">
                Efficiency, uptime, and production clarity become visible as you
                scroll through the system story.
              </p>
            </motion.div>
            <motion.div
              style={{ opacity: chapterBOpacity }}
              className="ml-[18%] mt-4 max-w-md rounded-xl border border-white/10 bg-[#0d0f16]/72 p-4 backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">Scene B</p>
              <p className="mt-2 text-sm text-white/76">
                Hardware and software operate as one operating layer from panel
                edge to insight dashboard.
              </p>
            </motion.div>
            <motion.div
              style={{ opacity: chapterCOpacity }}
              className="ml-[36%] mt-4 max-w-md rounded-xl border border-white/10 bg-[#0d0f16]/72 p-4 backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">Scene C</p>
              <p className="mt-2 text-sm text-white/76">
                Long-term reliability meets measurable sustainability outcomes
                for every deployment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cinematic-section pt-20 lg:pt-28">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Years Experience', value: '25+' },
            { label: 'Installations', value: '500K+' },
            { label: 'Customer Satisfaction', value: '98%' },
            { label: 'Total Capacity', value: '2.5GW' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="cinematic-panel p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                Metric
              </p>
              <p className="mt-3 text-4xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-white/62">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cinematic-section pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <p className="cinematic-eyebrow">Chapter 02 • Why Feraj</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white/92 lg:text-5xl">
              A system engineered for confidence at scale
            </h2>
            <p className="mt-4 max-w-md text-white/62">
              The same promise runs through each layer: resilient components,
              measurable outcomes, and support that remains present after
              installation.
            </p>
          </div>

          <div className="space-y-5">
            {chapters.map((chapter, index) => (
              <motion.article
                key={chapter.title}
                className="cinematic-panel scroll-snap-chapter p-6 md:p-8"
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.62, delay: index * 0.05 }}
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-primary">
                  <chapter.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold text-white/90">{chapter.title}</h3>
                <p className="mt-3 max-w-2xl text-white/62">{chapter.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="cinematic-section py-16">
        <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="cinematic-eyebrow">Chapter 03 • Field Frames</p>
            <h2 className="mt-3 text-3xl font-semibold text-white/92 lg:text-5xl">
              Our solutions in action
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/58">
            A curated strip of real installation contexts, from rooftop systems
            to integrated energy infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {gallery.map((item, index) => (
            <motion.figure
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${
                index === 0
                  ? 'md:col-span-7 md:row-span-2 h-[340px] md:h-[520px]'
                  : 'md:col-span-5 h-[250px]'
              }`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08)_0%,rgba(8,8,12,0.72)_88%)]" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs uppercase tracking-[0.13em] text-white/50">Scene</p>
                <p className="mt-1 text-lg font-semibold text-white/90">{item.label}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="cinematic-section pb-20">
        <motion.div
          className="cinematic-stage relative p-8 sm:p-10 lg:p-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(49,209,122,0.2),transparent_42%),radial-gradient(circle_at_86%_78%,rgba(73,201,255,0.16),transparent_46%)]" />
          <div className="relative max-w-3xl">
            <p className="cinematic-eyebrow">Final Chapter • Ready to Move</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white/92 lg:text-6xl">
              Ready to go solar?
            </h2>
            <p className="mt-4 text-base text-white/65 lg:text-lg">
              Join customers already transitioning to clean, renewable energy
              with systems built for long-term reliability and measurable value.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-md border border-primary/35 bg-primary/90 px-8 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
            >
              Browse Products <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
