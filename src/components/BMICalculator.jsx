import React, { useState, useEffect } from 'react';

// ============================================================================
// COMPONENT: BMICalculator
// PURPOSE: A dynamic, real-time Body Mass Index calculator.
// We are using React State to calculate the BMI instantly as the user types,
// removing the need for clunky form submissions or page reloads.
// ============================================================================

const BMICalculator = () => {
  // --- STATE MANAGEMENT ---
  // We need to store three pieces of input from the user: Height (feet and inches) and Weight.
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  // We also need state to hold our output: the final BMI number and the category it falls into.
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  // State to toggle the educational breakdown
  const [showDetails, setShowDetails] = useState(false);

  // --- THE MATH ENGINE (useEffect) ---
  // We use the useEffect hook here because we want the math to run automatically 
  // every single time heightFt, heightIn, or weightLbs changes. 
  useEffect(() => {
    // First, we convert our string inputs into usable numbers.
    const ft = parseFloat(heightFt);
    const inc = parseFloat(heightIn) || 0; // Default to 0 if they leave inches blank
    const lbs = parseFloat(weightLbs);

    // We only want to run the calculation if we have valid numbers for both feet and weight.
    if (ft > 0 && lbs > 0) {
      // Step 1: Convert the total height into pure inches
      const totalInches = (ft * 12) + inc;
      
      // Step 2: The classic BMI Formula 
      // Weight divided by height squared, all multiplied by the 703 conversion factor.
      const calculatedBmi = (lbs / (totalInches * totalInches)) * 703;
      
      // Step 3: Round it to one decimal place so it looks clean on the UI
      const finalBmi = calculatedBmi.toFixed(1);
      setBmi(finalBmi);

      // Step 4: Determine the category based on standard health brackets
      if (finalBmi < 18.5) {
        setCategory('Underweight');
      } else if (finalBmi >= 18.5 && finalBmi <= 24.9) {
        setCategory('Healthy Weight');
      } else if (finalBmi >= 25 && finalBmi <= 29.9) {
        setCategory('Overweight');
      } else {
        setCategory('Obesity');
      }
    } else {
      // If the inputs are cleared out or invalid, reset the results to hide the output box
      setBmi(null);
      setCategory('');
    }
  }, [heightFt, heightIn, weightLbs]); // Dependency array: watch these variables!

  // --- THE UI (Render) ---
  return (
        <div className="max-w-2xl mx-auto">
            
            {/* Header Section */}
            <div className="flex justify-between items-end mb-4 border-b pb-4">
                <div>
                <h2 className="text-2xl font-bold text-gray-800">1. Body Composition (BMI)</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Enter your height and weight to calculate your Body Mass Index.
                </p>
                </div>
                <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                {showDetails ? 'Hide Details ▲' : 'How it Works ▼'}
                </button>
            </div>

            {/* Educational Dropdown */}
            {showDetails && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 mb-6 text-sm text-cyan-900 animate-fade-in">
                <h4 className="font-bold mb-2">The Formula:</h4>
                <p className="font-mono bg-white p-2 rounded border border-cyan-200 mb-3 inline-block">
                    BMI = (Weight in lbs / (Height in inches × Height in inches)) × 703
                </p>
                <h4 className="font-bold mb-1">Example Calculation:</h4>
                <p>
                    For example, if an active runner is <strong>5 foot 10 inches</strong> (70 total inches) and weighs <strong>150 lbs</strong>:
                    <br />
                    1. Multiply height in inches by itself: (70 × 70) = 4,900
                    <br />
                    2. Divide weight by that number: (150 / 4,900) = 0.0306
                    <br />
                    3. Multiply by the conversion factor: (0.0306 × 703) = <strong>21.5 (Healthy Weight)</strong>
                </p>
                </div>
            )}

            {/* Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Height (ft)</label>
                <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="5"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Height (in)</label>
                <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="10"
                    min="0" max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Weight (lbs)</label>
                <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="150"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                />
                </div>
            </div>

            {/* Auto-Render Results */}
            {bmi && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-inner text-center">
                <div className="text-gray-600 mb-1">Your current BMI is</div>
                <div className="text-4xl font-extrabold text-emerald-600 mb-2">{bmi}</div>
                <div className="inline-block px-4 py-1 bg-white rounded-full text-sm font-bold text-gray-700 shadow-sm mb-3 border border-emerald-100">
                    {category}
                </div>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                    A healthy BMI range is typically 18.5 to 24.9. Remember, this formula doesn't account for muscle mass, so it's best used as a general baseline rather than a strict rule.
                </p>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;