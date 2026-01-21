import { Leaf, DollarSign, Home, Factory, TrendingDown, Shield } from 'lucide-react';

export function WhyGreen() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Why Green Energy?</h1>
          <p className="text-xl max-w-3xl text-emerald-50">
            Understanding the environmental, economic, and social benefits of renewable energy for a sustainable future
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg">
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Environmental Impact</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Zero greenhouse gas emissions during operation</li>
                <li>• Reduces air and water pollution</li>
                <li>• Conserves finite natural resources</li>
                <li>• Protects ecosystems and biodiversity</li>
                <li>• Combats climate change</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-lg">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Economic Benefits</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Lower electricity bills long-term</li>
                <li>• Hedge against rising energy costs</li>
                <li>• Increases property value 3-4%</li>
                <li>• Tax incentives and rebates</li>
                <li>• Creates local green jobs</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Energy Independence</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Reduces fossil fuel dependence</li>
                <li>• Protects from grid outages</li>
                <li>• Energy security for nations</li>
                <li>• Stable, predictable costs</li>
                <li>• Self-sufficient power generation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">The Climate Crisis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">+1.1°C</div>
              <p className="text-gray-600">Global temperature rise since pre-industrial times</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">37Gt</div>
              <p className="text-gray-600">CO₂ emissions annually from fossil fuels</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">419ppm</div>
              <p className="text-gray-600">Current atmospheric CO₂ concentration</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Solar Energy: A Proven Solution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">Environmental Savings Per Household</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Offsets 3-4 tons of CO₂ annually</li>
                  <li>• Equivalent to planting 100 trees/year</li>
                  <li>• Saves 200,000+ liters of water</li>
                  <li>• Prevents 7,500 kg of coal burning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">Global Impact</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Solar capacity grew 22% in 2023</li>
                  <li>• Costs dropped 90% since 2010</li>
                  <li>• 12+ million jobs in renewables</li>
                  <li>• On track to 30% global energy by 2030</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Applications of Solar Energy</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Home className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Residential</h4>
                    <p className="text-gray-600">Rooftop systems for homes, apartments, and communities providing clean power</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Factory className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Commercial & Industrial</h4>
                    <p className="text-gray-600">Large-scale installations reducing operational costs and carbon footprint</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingDown className="h-8 w-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Utility-Scale</h4>
                    <p className="text-gray-600">Solar farms generating megawatts of clean energy for the grid</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Green energy"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
