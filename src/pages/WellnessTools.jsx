import React from 'react';
import BMICalculator from '../components/BMICalculator.jsx';
import TDEECalculator from '../components/TDEECalculator.jsx';
import MacroNutrientPlanner from '../components/MacroNutrientPlanner.jsx';

const WellnessTools = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-extrabold text-purple-900 tracking-tight">
            Wellness Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by The Chris & Emma Show. Dial in your body composition, energy expenditure, and macronutrient goals with our suite of precision tools.
          </p>
        </div>

        {/* The Calculators */}
        <section className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
          <div className="p-6 md:p-8">
            <BMICalculator />
          </div>
        </section>

        <section className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>
          <div className="p-6 md:p-8">
            <TDEECalculator />
          </div>
        </section>

        <section className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-pink-500 to-orange-400"></div>
          <div className="p-6 md:p-8">
            <MacroNutrientPlanner />
          </div>
        </section>

      </div>
    </div>
  );
};

export default WellnessTools;