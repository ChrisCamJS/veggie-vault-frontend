import React, { useState, useEffect } from 'react';

// ============================================================================
// COMPONENT: TDEECalculator
// PURPOSE: Calculates Basal Metabolic Rate (BMR) and Total Daily Energy 
// Expenditure (TDEE) using the highly accurate Mifflin-St Jeor equation.
// ============================================================================

const TDEECalculator = () => {
  // ---  STATE MANAGEMENT ---

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male'); // Defaulting to male, but easily changed
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const [results, setResults] = useState(null);

  // State for the educational dropdown
  const [showDetails, setShowDetails] = useState(false);

  // --- THE CALCULATION ENGINE (useEffect) ---
  useEffect(() => {
    
    const a = parseFloat(age);
    const ft = parseFloat(heightFt);
    const inc = parseFloat(heightIn) || 0; 
    const lbs = parseFloat(weightLbs);
    const activity = parseFloat(activityLevel);

    // We only proceed if all the vital numbers are actually numbers (not NaN) and greater than 0.
    if (a > 0 && ft > 0 && lbs > 0 && activity > 0) {
      
      // --- CONVERSIONS ---
      // The Mifflin-St Jeor equation requires metric values, so 
      // we need to translate our imperial inputs.
      
      // 1 inch = 2.54 centimeters
      const heightCm = ((ft * 12) + inc) * 2.54;
      
      // 1 pound = 0.453592 kilograms
      const weightKg = lbs * 0.453592;

      // --- BMR: BASAL METABOLIC RATE ---
      let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a);
      
      // The equation shifts slightly based on biological sex due to average muscle mass differences.
      if (gender === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }
      // --- TDEE: TOTAL DAILY ENERGY EXPENDITURE ---
      const tdee = bmr * activity;
      // Update our results state with beautifully rounded numbers
      setResults({
        bmr: Math.round(bmr),
        maintain: Math.round(tdee),
        mildLoss: Math.round(tdee - 250),
        weightLoss: Math.round(tdee - 500),
        mildGain: Math.round(tdee + 250)
      });
    } else {
      // If inputs are incomplete, clear the results so the box disappears
      setResults(null);
    }
  }, [age, gender, heightFt, heightIn, weightLbs, activityLevel]); // The dependency array

  // --- 3. THE UI RENDER ---
  return (
<div className="max-w-2xl mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">2. Caloric Needs (TDEE)</h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover your body's daily energy needs to tailor your nutrition.
          </p>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
        >
          {showDetails ? 'Hide Details ▲' : 'How it Works ▼'}
        </button>
      </div>

      {/* Educational Dropdown */}
      {showDetails && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6 text-sm text-purple-900 animate-fade-in">
          <h4 className="font-bold mb-2">The Engine Under the Hood:</h4>
          <p className="mb-3">
            We use the <strong>Mifflin-St Jeor equation</strong>, widely considered the gold standard for calculating Basal Metabolic Rate (BMR) in clinical settings. 
          </p>
          <h4 className="font-bold mb-1">Example Calculation:</h4>
          <p>
            If our 5'10", 150 lb runner is a 35-year-old male:
            <br />
            1. The equation finds his BMR (calories burned just staying alive) is roughly <strong>1,643 calories</strong>.
            <br />
            2. If he runs 4 days a week (Moderately Active multiplier of 1.55): 1,643 × 1.55 = <strong>2,546 calories/day</strong>.
            <br />
            3. That final number is his Total Daily Energy Expenditure (TDEE). Eating exactly that amount will maintain his 150 lb frame.
          </p>
        </div>
      )}

      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Age</label>
            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="35" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Gender</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Height (ft)</label>
            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Height (in)</label>
            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="10" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Weight (lbs)</label>
          <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="150" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Activity Level</label>
          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
            <option value="">-- Select an Option --</option>
            <option value="1.2">Sedentary (Little/no exercise)</option>
            <option value="1.375">Lightly Active (1-3 days/wk)</option>
            <option value="1.55">Moderately Active (3-5 days/wk)</option>
            <option value="1.725">Very Active (6-7 days/wk)</option>
            <option value="1.9">Extra Active (Very physical)</option>
          </select>
        </div>
      </div>

      {/* Auto-Render Results */}
      {results && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100 p-6 rounded-xl shadow-inner mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="text-center md:border-r border-purple-200 md:pr-4">
              <div className="text-gray-600 mb-1 text-sm">To Maintain Current Weight (TDEE)</div>
              <div className="text-4xl font-extrabold text-purple-700 mb-1">{results.maintain}</div>
              <div className="text-sm font-semibold text-purple-500 uppercase tracking-wider">Calories / Day</div>
              
              <div className="mt-4 pt-4 border-t border-purple-100">
                <div className="text-gray-500 text-xs uppercase">Basal Metabolic Rate (BMR)</div>
                <div className="font-bold text-gray-700">{results.bmr} calories</div>
              </div>
            </div>

            <div className="space-y-3">
               <h4 className="text-center font-bold text-gray-700 text-sm uppercase tracking-wide mb-2">Adjusted Goals</h4>
               <div className="flex justify-between bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                 <span className="text-gray-600">Loss (1 lb/wk)</span>
                 <span className="font-bold text-purple-900">{results.weightLoss} cal</span>
               </div>
               <div className="flex justify-between bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                 <span className="text-gray-600">Mild Loss (0.5 lb/wk)</span>
                 <span className="font-bold text-purple-900">{results.mildLoss} cal</span>
               </div>
               <div className="flex justify-between bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                 <span className="text-gray-600">Mild Gain (0.5 lb/wk)</span>
                 <span className="font-bold text-purple-900">{results.mildGain} cal</span>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
    );
};

export default TDEECalculator;