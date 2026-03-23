// src/components/RecipeDashboard/RecipeForm.jsx
import React, { useState } from 'react';

const RecipeForm = ({ onGenerate, isLoading, isBroke, engineMode }) => {
  const [userRequest, setUserRequest] = useState('');
  
  const [prefs, setPrefs] = useState({
    oilFree: true,
    glutenFree: false,
    sugarFree: true 
  });

  // A helper to flip our switches
  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userRequest.trim()) return;
    // Pass the entire preferences object back up to the Engine
    onGenerate(userRequest, prefs);
  };

  // Determine the placeholder based on mode
  const getPlaceholder = () => {
    if (engineMode === 'chat') return "E.g., What are the best plant-based sources of iron, Emma?";
    return "E.g., A massive bowl of spicy lentil stew, or a proper good vegan shepherd's pie...";
  };

  // Determine the label based on mode
  const getLabel = () => {
    if (engineMode === 'chat') return "Ask Emma a question...";
    return "What are you craving, then?";
  };

  // Determine the button text
  const getButtonText = () => {
      if (isLoading) return "Emma's having a think...";
      if (engineMode === 'chat') return "Chat with Emma";
      if (engineMode === 'draft') return "Generate Draft (Free)";
      return "Generate Full Recipe";
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      
      <div className="input-group">
        <label htmlFor="recipe-request">{getLabel()}</label>
        <textarea
          id="recipe-request"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={isLoading}
          rows="4"
          required
        />
      </div>

      {/* Only show the toggles if we are actually making a recipe! */}
      {engineMode !== 'chat' && (
          <div className="dietary-toggles-container">
            <button 
                type="button" 
                className={`diet-pill ${prefs.oilFree ? 'active' : 'warning'}`}
                onClick={() => handleToggle('oilFree')}
                disabled={isLoading}
                title="Toggle strictly oil-free"
            >
                {prefs.oilFree ? '✅ Strictly Oil-Free' : '⚠️ Oil Allowed (Needs Justification)'}
            </button>
            
            <button 
                type="button" 
                className={`diet-pill ${prefs.glutenFree ? 'active' : ''}`}
                onClick={() => handleToggle('glutenFree')}
                disabled={isLoading}
                title="Toggle Gluten-Free"
            >
                {prefs.glutenFree ? '✅ Gluten-Free' : 'Gluten-Free'}
            </button>
            
            <button 
                type="button" 
                className={`diet-pill ${prefs.sugarFree ? 'active' : 'warning'}`}
                onClick={() => handleToggle('sugarFree')}
                disabled={isLoading}
                title="Refined Sugar-Free"
            >
                {prefs.sugarFree ? '✅ Strictly RSF' : '⚠️ RSF Allowed (Needs Justification)'}
            </button>
          </div>
      )}

      <button 
        type="submit" 
        className="submit-btn" 
        disabled={isBroke || isLoading || !userRequest.trim()}
      >
        {getButtonText()}
      </button>

    </form>
  );
};

export default RecipeForm;