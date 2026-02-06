import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { energyData } from '@/app/data/energyData';
import { TrendingUp, TrendingDown, Minus, Activity, Zap } from 'lucide-react';

export function EnergyStats() {
  const globeEl = useRef<any>();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);

  useEffect(() => {
    // Auto-rotate globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const points = energyData.map((d) => ({
    lat: d.lat,
    lng: d.lng,
    size: Math.log(d.demand + 1) * 0.5,
    color:
      d.renewable > 50 ? '#10b981' : d.renewable > 25 ? '#f59e0b' : '#ef4444',
    country: d.country,
    ...d,
  }));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-5 w-5 text-primary" />;
      default:
        return <Minus className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Global Energy Demand</h1>
          <p className="text-xl text-gray-300">
            Interactive 3D visualization of real-time energy demand and
            renewable energy adoption worldwide
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-accent" />
                <span className="text-sm text-gray-300">
                  Total Global Demand
                </span>
              </div>
              <div className="text-2xl font-bold">
                {energyData
                  .reduce((sum, d) => sum + d.demand, 0)
                  .toLocaleString()}{' '}
                GW
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Avg. Renewable %</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(
                  energyData.reduce((sum, d) => sum + d.renewable, 0) /
                    energyData.length
                )}
                %
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <span className="text-sm text-gray-300">Increasing Demand</span>
              </div>
              <div className="text-2xl font-bold">
                {energyData.filter((d) => d.trend === 'increasing').length}{' '}
                Countries
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-accent" />
                <span className="text-sm text-gray-300">Decreasing Demand</span>
              </div>
              <div className="text-2xl font-bold">
                {energyData.filter((d) => d.trend === 'decreasing').length}{' '}
                Countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Globe and Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Globe */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 h-[600px]">
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointLabel={(d: any) => `
                  <div style="background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px; color: white;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${d.country}</div>
                    <div>Demand: ${d.demand} GW</div>
                    <div>Renewable: ${d.renewable}%</div>
                    <div style="margin-top: 4px; color: ${d.trend === 'increasing' ? '#ef4444' : d.trend === 'decreasing' ? '#10b981' : '#3b82f6'}">
                      Trend: ${d.trend}
                    </div>
                  </div>
                `}
                onPointClick={(point: any) => setSelectedCountry(point)}
                onPointHover={(point: any) => setHoveredCountry(point)}
              />
            </div>
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Legend</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary0"></div>
                  <span className="text-sm">High Renewable (&gt;50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Medium (25-50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">Low (&lt;25%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              {selectedCountry || hoveredCountry ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    {(selectedCountry || hoveredCountry).country}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Energy Demand
                      </div>
                      <div className="text-3xl font-bold text-accent">
                        {(selectedCountry || hoveredCountry).demand} GW
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Renewable Energy
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold">
                          {(selectedCountry || hoveredCountry).renewable}%
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-secondary0 h-3 rounded-full transition-all"
                            style={{
                              width: `${(selectedCountry || hoveredCountry).renewable}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Demand Trend
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-md">
                        {getTrendIcon(
                          (selectedCountry || hoveredCountry).trend
                        )}
                        <span className="capitalize">
                          {(selectedCountry || hoveredCountry).trend}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Key Factors
                      </div>
                      <ul className="space-y-2">
                        {(selectedCountry || hoveredCountry).factors.map(
                          (factor: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="text-accent">•</span>
                              <span>{factor}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a Country
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Click or hover over any point on the globe to view detailed
                    energy statistics
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Country</th>
                    <th className="text-right py-3 px-4">Demand (GW)</th>
                    <th className="text-right py-3 px-4">Renewable %</th>
                    <th className="text-center py-3 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {energyData
                    .sort((a, b) => b.demand - a.demand)
                    .slice(0, 10)
                    .map((country, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <td className="py-3 px-4">{country.country}</td>
                        <td className="py-3 px-4 text-right">
                          {country.demand.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              country.renewable > 50
                                ? 'bg-accent/20 text-accent'
                                : country.renewable > 25
                                  ? 'bg-yellow-900 text-yellow-300'
                                  : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {country.renewable}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
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
  );
}
