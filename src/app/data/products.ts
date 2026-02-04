export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  specs: string[];
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'SolarMax Pro 400W Panel',
    description:
      'High-efficiency monocrystalline solar panel with 22% efficiency rating',
    price: 299,
    category: 'Solar Panels',
    specs: [
      '400W Output',
      '22% Efficiency',
      '25 Year Warranty',
      'Weather Resistant',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '2',
    name: 'EcoPower 5kW Inverter',
    description: 'Advanced solar inverter with smart grid connectivity',
    price: 1499,
    category: 'Inverters',
    specs: [
      '5kW Capacity',
      'MPPT Technology',
      '98% Efficiency',
      'Wi-Fi Monitoring',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '3',
    name: 'PowerBank Home Battery 10kWh',
    description: 'Residential energy storage system for 24/7 clean power',
    price: 6999,
    category: 'Battery Storage',
    specs: [
      '10kWh Capacity',
      'Lithium-Ion',
      '10 Year Warranty',
      'Scalable System',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '4',
    name: 'SmartMount Roof System',
    description:
      'Professional-grade mounting solution for residential installations',
    price: 899,
    category: 'Mounting',
    specs: [
      'Adjustable Tilt',
      'Corrosion Resistant',
      'Easy Installation',
      'Wind Rated',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '5',
    name: 'SolarMax Pro 550W Panel',
    description: 'Premium high-output solar panel for commercial applications',
    price: 449,
    category: 'Solar Panels',
    specs: [
      '550W Output',
      '24% Efficiency',
      '30 Year Warranty',
      'Bifacial Technology',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '6',
    name: 'EcoPower 10kW Inverter',
    description: 'Commercial-grade solar inverter for large installations',
    price: 2799,
    category: 'Inverters',
    specs: [
      '10kW Capacity',
      'Hybrid Ready',
      '99% Efficiency',
      'Remote Monitoring',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
];
