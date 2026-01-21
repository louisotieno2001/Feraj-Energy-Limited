export interface EnergyData {
  country: string;
  lat: number;
  lng: number;
  demand: number; // in GW
  renewable: number; // percentage
  trend: 'increasing' | 'stable' | 'decreasing';
  factors: string[];
}

export const energyData: EnergyData[] = [
  // North America
  { country: 'United States', lat: 37.09, lng: -95.71, demand: 4500, renewable: 21, trend: 'increasing', factors: ['Economic growth', 'EV adoption', 'Data centers'] },
  { country: 'Canada', lat: 56.13, lng: -106.35, demand: 650, renewable: 68, trend: 'stable', factors: ['Hydropower dominance', 'Cold climate heating'] },
  { country: 'Mexico', lat: 23.63, lng: -102.55, demand: 350, renewable: 29, trend: 'increasing', factors: ['Industrial growth', 'Solar expansion'] },
  
  // South America
  { country: 'Brazil', lat: -14.24, lng: -51.93, demand: 650, renewable: 85, trend: 'increasing', factors: ['Hydropower', 'Economic development'] },
  { country: 'Argentina', lat: -38.42, lng: -63.62, demand: 145, renewable: 14, trend: 'increasing', factors: ['Wind power growth', 'Mining sector'] },
  { country: 'Chile', lat: -35.68, lng: -71.54, demand: 85, renewable: 46, trend: 'increasing', factors: ['Solar boom', 'Copper mining'] },
  
  // Europe
  { country: 'Germany', lat: 51.17, lng: 10.45, demand: 550, renewable: 51, trend: 'stable', factors: ['Energiewende policy', 'Industrial demand'] },
  { country: 'France', lat: 46.23, lng: 2.21, demand: 470, renewable: 24, trend: 'stable', factors: ['Nuclear dominance', 'EV infrastructure'] },
  { country: 'United Kingdom', lat: 55.38, lng: -3.44, demand: 310, renewable: 43, trend: 'decreasing', factors: ['Offshore wind', 'Efficiency measures'] },
  { country: 'Spain', lat: 40.46, lng: -3.75, demand: 260, renewable: 47, trend: 'stable', factors: ['Solar growth', 'Tourism sector'] },
  { country: 'Italy', lat: 41.87, lng: 12.57, demand: 315, renewable: 41, trend: 'stable', factors: ['Solar adoption', 'Manufacturing'] },
  { country: 'Poland', lat: 51.92, lng: 19.15, demand: 180, renewable: 16, trend: 'increasing', factors: ['Coal transition', 'EU regulations'] },
  { country: 'Netherlands', lat: 52.13, lng: 5.29, demand: 115, renewable: 15, trend: 'increasing', factors: ['Offshore wind', 'Data centers'] },
  { country: 'Norway', lat: 60.47, lng: 8.47, demand: 145, renewable: 98, trend: 'increasing', factors: ['Hydropower', 'EV adoption'] },
  
  // Asia
  { country: 'China', lat: 35.86, lng: 104.2, demand: 8500, renewable: 30, trend: 'increasing', factors: ['Manufacturing', 'Urbanization', 'Green transition'] },
  { country: 'India', lat: 20.59, lng: 78.96, demand: 1800, renewable: 41, trend: 'increasing', factors: ['Population growth', 'Solar expansion', 'Electrification'] },
  { country: 'Japan', lat: 36.20, lng: 138.25, demand: 980, renewable: 22, trend: 'decreasing', factors: ['Energy efficiency', 'Aging population'] },
  { country: 'South Korea', lat: 35.91, lng: 127.77, demand: 580, renewable: 7, trend: 'stable', factors: ['Industrial sector', 'Tech industry'] },
  { country: 'Indonesia', lat: -0.79, lng: 113.92, demand: 280, renewable: 12, trend: 'increasing', factors: ['Economic growth', 'Geothermal potential'] },
  { country: 'Thailand', lat: 15.87, lng: 100.99, demand: 195, renewable: 14, trend: 'increasing', factors: ['Tourism', 'Manufacturing'] },
  { country: 'Vietnam', lat: 14.06, lng: 108.28, demand: 245, renewable: 37, trend: 'increasing', factors: ['Rapid industrialization', 'Hydropower'] },
  { country: 'Philippines', lat: 12.88, lng: 121.77, demand: 105, renewable: 33, trend: 'increasing', factors: ['Population growth', 'Geothermal'] },
  
  // Middle East
  { country: 'Saudi Arabia', lat: 23.89, lng: 45.08, demand: 395, renewable: 1, trend: 'increasing', factors: ['Cooling demand', 'Solar projects'] },
  { country: 'UAE', lat: 23.42, lng: 53.85, demand: 135, renewable: 3, trend: 'increasing', factors: ['Cooling', 'Economic diversification'] },
  { country: 'Turkey', lat: 38.96, lng: 35.24, demand: 325, renewable: 42, trend: 'increasing', factors: ['Wind power', 'Industrial growth'] },
  
  // Africa
  { country: 'South Africa', lat: -30.56, lng: 22.94, demand: 230, renewable: 7, trend: 'stable', factors: ['Mining sector', 'Load shedding'] },
  { country: 'Egypt', lat: 26.82, lng: 30.80, demand: 195, renewable: 11, trend: 'increasing', factors: ['Population growth', 'Solar potential'] },
  { country: 'Nigeria', lat: 9.08, lng: 8.68, demand: 30, renewable: 85, trend: 'increasing', factors: ['Electrification', 'Hydropower'] },
  { country: 'Kenya', lat: -0.02, lng: 37.91, demand: 12, renewable: 90, trend: 'increasing', factors: ['Geothermal', 'Off-grid solar'] },
  
  // Oceania
  { country: 'Australia', lat: -25.27, lng: 133.78, demand: 260, renewable: 32, trend: 'increasing', factors: ['Mining', 'Rooftop solar boom'] },
  { country: 'New Zealand', lat: -40.90, lng: 174.89, demand: 42, renewable: 84, trend: 'stable', factors: ['Hydropower', 'Geothermal'] },
];
