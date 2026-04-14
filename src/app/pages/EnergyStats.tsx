import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'motion/react';
import { energyData } from '@/app/data/energyData';
import { TrendingUp, TrendingDown, Minus, Activity, Zap } from 'lucide-react';

type EnergyTrend = 'increasing' | 'decreasing' | 'stable';

function getTrendIcon(trend: EnergyTrend) {
  if (trend === 'increasing') {
    return <TrendingUp className="h-4 w-4 text-red-300" />;
  }

  if (trend === 'decreasing') {
    return <TrendingDown className="h-4 w-4 text-emerald-300" />;
  }

  return <Minus className="h-4 w-4 text-sky-300" />;
}

export function EnergyStats() {
  const globeEl = useRef<any>(null);
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const resumeSpinTimerRefs = useRef<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 });

  const BASE_AUTO_ROTATE_SPEED = 0.35;
  const INTERACTION_AUTO_ROTATE_SPEED = 0.06;
  const RESUME_SPIN_DELAY_MS = 1400;
  const RESUME_SPIN_STEP_MS = 220;

  useEffect(() => {
    if (!globeWrapRef.current) {
      return;
    }

    const updateSize = () => {
      if (!globeWrapRef.current) {
        return;
      }

      const rect = globeWrapRef.current.getBoundingClientRect();
      setGlobeSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(globeWrapRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = BASE_AUTO_ROTATE_SPEED;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.85;
      controls.enablePan = false;

      if ('minDistance' in controls) {
        controls.minDistance = 160;
      }

      if ('maxDistance' in controls) {
        controls.maxDistance = 500;
      }

      // Establish a balanced initial altitude so users can rotate naturally from center.
      globeEl.current.pointOfView({ lat: 5, lng: 20, altitude: 1.85 }, 0);
    }
  }, [globeSize]);

  useEffect(() => {
    return () => {
      resumeSpinTimerRefs.current.forEach((timerId) => window.clearTimeout(timerId));
      resumeSpinTimerRefs.current = [];
    };
  }, []);

  const clearSpinTimers = () => {
    resumeSpinTimerRefs.current.forEach((timerId) => window.clearTimeout(timerId));
    resumeSpinTimerRefs.current = [];
  };

  const setSpinSpeed = (speed: number) => {
    if (!globeEl.current) {
      return;
    }

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = speed;
  };

  const handleInteractionStart = () => {
    clearSpinTimers();

    setSpinSpeed(INTERACTION_AUTO_ROTATE_SPEED);
  };

  const handleInteractionEnd = () => {
    clearSpinTimers();

    const rampSpeeds = [0.14, 0.22, 0.29, BASE_AUTO_ROTATE_SPEED];

    rampSpeeds.forEach((speed, index) => {
      const timerId = window.setTimeout(
        () => {
          setSpinSpeed(speed);
        },
        RESUME_SPIN_DELAY_MS + index * RESUME_SPIN_STEP_MS
      );

      resumeSpinTimerRefs.current.push(timerId);
    });
  };

  const points = energyData.map((country) => ({
    size: Math.max(0.2, country.demand / 5000),
    color:
      country.renewable > 50
        ? '#34d399'
        : country.renewable > 25
          ? '#f59e0b'
          : '#ef4444',
    ...country,
  }));

  const activeCountry = selectedCountry || hoveredCountry;

  const visualAssets = [
    {
      src: '/images/energy_stats/africa_lights.webp',
      title: 'Nighttime Grid Activity',
      caption: 'Urban light density reflects demand concentration across African corridors.',
    },
    {
      src: '/images/energy_stats/renewables.png',
      title: 'Renewable Transition Signal',
      caption: 'Renewables are accelerating where policy and storage adoption align.',
    },
    {
      src: '/images/energy_stats/HD_40-Years-of-Global-Energy-Production_Timeline_Fossil-1.png',
      title: '40-Year Production Timeline',
      caption: 'Historical context shows why diversification and resilience planning matter now.',
    },
  ];

  const statCards = [
    {
      icon: Activity,
      label: 'Total Global Demand',
      value: `${energyData.reduce((sum, item) => sum + item.demand, 0).toLocaleString()} GW`,
      accent: 'text-primary',
    },
    {
      icon: Zap,
      label: 'Avg. Renewable %',
      value: `${Math.round(
        energyData.reduce((sum, item) => sum + item.renewable, 0) / energyData.length
      )}%`,
      accent: 'text-amber-300',
    },
    {
      icon: TrendingUp,
      label: 'Increasing Demand',
      value: `${energyData.filter((item) => item.trend === 'increasing').length} Countries`,
      accent: 'text-red-300',
    },
    {
      icon: TrendingDown,
      label: 'Decreasing Demand',
      value: `${energyData.filter((item) => item.trend === 'decreasing').length} Countries`,
      accent: 'text-sky-300',
    },
  ];

  return (
    <div className="min-h-screen py-10 text-white/86 lg:py-14">
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,14,20,0.96),rgba(8,10,15,0.84))] p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.16),transparent_35%),radial-gradient(circle_at_84%_78%,rgba(49,209,122,0.14),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden lg:block">
            <img
              src="/images/energy_stats/africa_lights.webp"
              alt="Africa nighttime energy lights"
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,10,14,0.94)] via-[rgba(9,10,14,0.74)] to-[rgba(9,10,14,0.3)]" />
          </div>
          <div className="relative max-w-3xl">
            <p className="cinematic-eyebrow">Data Chapter • Energy Intelligence</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white/92 sm:text-5xl lg:text-6xl">
              Global Energy Demand
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/62">
              Interactive 3D visualization of real-time energy demand and renewable
              energy adoption worldwide
            </p>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {visualAssets.map((asset, idx) => (
            <motion.article
              key={asset.src}
              className="cinematic-panel overflow-hidden p-0"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <img src={asset.src} alt={asset.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/78">
                  {asset.title}
                </h3>
                <p className="mt-2 text-sm text-white/56">{asset.caption}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="cinematic-panel p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <div className="mb-2 flex items-center gap-2 text-white/68">
                <stat.icon className={`h-5 w-5 ${stat.accent}`} />
                <span className="text-sm text-white/62">{stat.label}</span>
              </div>
              <div className="text-2xl font-semibold text-white/90">{stat.value}</div>
            </motion.div>
          ))}
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.75fr)]">
          <div>
            <div
              ref={globeWrapRef}
              className="cinematic-panel h-[640px] overflow-hidden p-4 lg:sticky lg:top-24"
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={handleInteractionStart}
              onTouchEnd={handleInteractionEnd}
              onWheelCapture={handleInteractionStart}
              onWheel={handleInteractionEnd}
            >
              <Globe
                ref={globeEl}
                width={globeSize.width > 0 ? globeSize.width - 32 : undefined}
                height={globeSize.height > 0 ? globeSize.height - 32 : undefined}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointLabel={(point: any) => `
                  <div style="background: rgba(8,10,15,0.92); padding: 12px; border-radius: 10px; color: white; border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(14px);">
                    <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: rgba(255,255,255,0.92);">${point.country}</div>
                    <div style="color: rgba(255,255,255,0.72);">Demand: ${point.demand} GW</div>
                    <div style="color: rgba(255,255,255,0.72);">Renewable: ${point.renewable}%</div>
                    <div style="margin-top: 4px; color: ${point.trend === 'increasing' ? '#fca5a5' : point.trend === 'decreasing' ? '#34d399' : '#60a5fa'}">
                      Trend: ${point.trend}
                    </div>
                  </div>
                `}
                onPointClick={(point: any) => setSelectedCountry(point)}
                onPointHover={(point: any) => setHoveredCountry(point)}
              />
            </div>

            <div className="mt-4 cinematic-panel p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/45">
                Legend
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-white/68">
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                  <span>High Renewable (&gt;50%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/68">
                  <div className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                  <span>Medium (25-50%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/68">
                  <div className="h-3.5 w-3.5 rounded-full bg-red-500" />
                  <span>Low (&lt;25%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="cinematic-panel-strong p-6 lg:sticky lg:top-24">
              {activeCountry ? (
                <div>
                  <p className="cinematic-eyebrow mb-2">Selected Country</p>
                  <h2 className="mb-5 text-3xl font-semibold text-white/90">
                    {activeCountry.country}
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-[0.14em] text-white/45">
                        Energy Demand
                      </div>
                      <div className="text-3xl font-semibold text-primary">
                        {activeCountry.demand} GW
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-xs uppercase tracking-[0.14em] text-white/45">
                        Renewable Energy
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-semibold text-white/90">
                          {activeCountry.renewable}%
                        </div>
                        <div className="h-3 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${activeCountry.renewable}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs uppercase tracking-[0.14em] text-white/45">
                        Demand Trend
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white/78">
                        {getTrendIcon(activeCountry.trend)}
                        <span className="capitalize">{activeCountry.trend}</span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs uppercase tracking-[0.14em] text-white/45">
                        Key Factors
                      </div>
                      <ul className="space-y-2 text-sm text-white/68">
                        {activeCountry.factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 text-primary">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Activity className="mx-auto mb-4 h-16 w-16 text-white/30" />
                  <h3 className="mb-2 text-lg font-semibold text-white/90">
                    Select a Country
                  </h3>
                  <p className="text-sm text-white/58">
                    Click or hover over any point on the globe to view detailed energy
                    statistics
                  </p>
                </div>
              )}
            </div>

            <div className="cinematic-panel overflow-hidden">
              <img
                src="/images/energy_stats/renewables.png"
                alt="Renewable energy trend visualization"
                className="h-56 w-full object-cover"
              />
              <div className="border-t border-white/10 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/68">
                  Transition Snapshot
                </h3>
                <p className="mt-2 text-sm text-white/56">
                  Use this reference alongside the table to compare demand growth with renewable share across top countries.
                </p>
              </div>
            </div>

            <div className="cinematic-panel overflow-hidden">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-semibold text-white/90">
                  Detailed Statistics
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-white/48">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em]">
                          Country
                        </th>
                        <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em]">
                          Demand (GW)
                        </th>
                        <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em]">
                          Renewable %
                        </th>
                        <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em]">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {energyData
                        .slice()
                        .sort((a, b) => b.demand - a.demand)
                        .slice(0, 10)
                        .map((country, idx) => (
                          <tr
                            key={idx}
                            className="cursor-pointer border-b border-white/8 transition hover:bg-white/5"
                            onClick={() => setSelectedCountry(country)}
                          >
                            <td className="px-4 py-3 text-white/86">{country.country}</td>
                            <td className="px-4 py-3 text-right text-white/70">
                              {country.demand.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  country.renewable > 50
                                    ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                                    : country.renewable > 25
                                      ? 'border border-amber-500/25 bg-amber-500/10 text-amber-300'
                                      : 'border border-red-500/25 bg-red-500/10 text-red-300'
                                }`}
                              >
                                {country.renewable}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center">
                                {getTrendIcon(country.trend)}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
