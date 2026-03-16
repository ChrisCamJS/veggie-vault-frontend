import React, {useState, useEffect} from 'react';
// ============================================================================
// COMPONENT: MacroNutrientPlanner
// PURPOSE: Breaks down a daily calorie goal into specific grams of 
// Protein, Carbohydrates, and Fats based on selected dietary ratios.
// ============================================================================

const MacroNutrientPlanner = () => {
    // state management
    const [calories, setCalories] = useState('');
    const [plan, setPlan] = useState('');

    // custom percentage states
    const [customProtein, setCustomProtein] = useState('');
    const [customCarbs, setCustomCarbs] = useState('');
    const[customFat, setCustomFat] = useState('');

    // error handling and final results\
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    // State for the educational dropdown
    const [showDetails, setShowDetails] = useState(false);
 
    // --- THE MACRO ENGINE (useEffect) ---
    useEffect(() => {
        // clear errors by default
        setError('');

        const totalCals = parseFloat(calories);

        // if novalid Calorie count or plan, we stop here.
        if (!totalCals || totalCals <= 0 || !plan) {
            setResults(null);
            return;
        }

        let proteinRatio = 0;
        let carbRatio = 0;
        let fatRatio = 0;

        switch (plan) {
            case 'balanced':
                carbRatio = 0.40;
                proteinRatio = 0.30;
                fatRatio = 0.30;
                break;
            case 'high-protein':
                carbRatio = 0.20;
                proteinRatio = 0.40;
                fatRatio = 0.30;
                break;
            case 'high-carb':
                carbRatio = 0.60;
                proteinRatio = 0.20;
                fatRatio = 0.20;
                break;
            case 'custom':
                const p = parseFloat(customProtein) || 0;
                const c = parseFloat(customCarbs) || 0;
                const f = parseFloat(customFat) || 0;

                const totalPercent = p + c + f;
                if (totalPercent !== 100) {
                    setError(`Percentages must add up to exactly 100. Current total: ${totalPercent}%`);
                    setResults(null);
                    return;
                }

                //convert percentages to decimals
                proteinRatio = p /100;
                carbRatio = c / 100;
                fatRatio = f / 100;
                break;
            default:
                return;
        }

        // the math part
        const proteinCals = totalCals * proteinRatio;
        const carbCals = totalCals * carbRatio;
        const fatCals = totalCals * fatRatio;

        setResults({
    protein: {
        grams: Math.round(proteinCals / 4),
        calories: Math.round(proteinCals)
      },
    carbs: {
        grams: Math.round(carbCals / 4),
        calories: Math.round(carbCals)
      },
    fat: {
        grams: Math.round(fatCals / 9),
        calories: Math.round(fatCals)
      }
    });

    }, [calories, plan, customProtein, customCarbs, customFat]);

    return (
        <div className="max-w-2xl mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">3. Macronutrient Planner</h2>
          <p className="text-gray-500 text-sm mt-1">
            Determine your optimal daily breakdown of protein, carbs, and fats.
          </p>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors"
        >
          {showDetails ? 'Hide Details ▲' : 'How it Works ▼'}
        </button>
      </div>

      {/* Educational Dropdown */}
      {showDetails && (
        <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 mb-6 text-sm text-pink-900 animate-fade-in">
          <h4 className="font-bold mb-2">The 4-4-9 Rule:</h4>
          <p className="mb-3">
            Not all calories are created equal. Protein and Carbohydrates provide roughly <strong>4 calories per gram</strong>. Dietary Fat is more energy-dense, providing <strong>9 calories per gram</strong>.
          </p>
          <h4 className="font-bold mb-1">Example Calculation:</h4>
          <p>
            If our runner needs <strong>2,500 calories</strong> and chooses a High-Carb plan (60% Carbs):
            <br />
            1. Carbs will make up 60% of his intake: (2,500 × 0.60) = 1,500 calories from carbs.
            <br />
            2. Divide those calories by 4 to get the actual weight in food: (1,500 / 4) = <strong>375 grams of carbohydrates</strong> to eat that day.
          </p>
        </div>
      )}

      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Calorie Goal</label>
          <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none" placeholder="2000" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Select Plan</label>
          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none" value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="">-- Select a Plan --</option>
            <option value="balanced">Balanced Diet (40c/30p/30f)</option>
            <option value="low-carb">Low-Carb (20c/40p/40f)</option>
            <option value="high-protein">High-Protein (30c/40p/30f)</option>
            <option value="high-carb">High-Carb / Endurance (60c/20p/20f)</option>
            <option value="custom">Custom Percentages...</option>
          </select>
        </div>
      </div>

      {plan === 'custom' && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 transition-all">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Custom Percentages:</p>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Protein (%)</label>
              <input type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none" placeholder="20" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Carbs (%)</label>
              <input type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none" placeholder="50" value={customCarbs} onChange={(e) => setCustomCarbs(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Fat (%)</label>
              <input type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none" placeholder="30" value={customFat} onChange={(e) => setCustomFat(e.target.value)} />
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-red-600 font-bold bg-red-50 p-2 rounded border border-red-200">{error}</div>}
        </div>
      )}

      {/* Auto-Render Results */}
      {results && !error && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-rose-200 p-5 rounded-xl text-center shadow-sm">
            <div className="text-rose-900 font-bold uppercase tracking-wider text-sm mb-1">Protein</div>
            <div className="text-4xl font-extrabold text-rose-600 mb-1">{results.protein.grams}g</div>
            <div className="text-xs font-semibold text-rose-500 uppercase">{results.protein.calories} cal</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 p-5 rounded-xl text-center shadow-sm">
            <div className="text-green-900 font-bold uppercase tracking-wider text-sm mb-1">Carbs</div>
            <div className="text-4xl font-extrabold text-green-600 mb-1">{results.carbs.grams}g</div>
            <div className="text-xs font-semibold text-green-500 uppercase">{results.carbs.calories} cal</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-cyan-200 p-5 rounded-xl text-center shadow-sm">
            <div className="text-cyan-900 font-bold uppercase tracking-wider text-sm mb-1">Fat</div>
            <div className="text-4xl font-extrabold text-cyan-600 mb-1">{results.fat.grams}g</div>
            <div className="text-xs font-semibold text-cyan-500 uppercase">{results.fat.calories} cal</div>
          </div>

        </div>
      )}

    </div>
    );
}

export default MacroNutrientPlanner;