import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import NutritionPanel from '../components/NutritionPanel';
import './RecipeDetails.css'; 

// ============================================================================
// COMPONENT: RecipeDetails
// PURPOSE: Fetches and displays a single recipe from the Headless PHP API.
// ============================================================================

const API_URL = import.meta.env.VITE_API_BASE_URL;

const RecipeDetails = () => {
  // --- STATE & ROUTING ---
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING (useEffect) ---
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await api.getRecipesById(id);
        
        // Safety net in case the API wraps the single recipe in an error object
        if (data.error) throw new Error(data.error);
        
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // --- CONDITIONAL RENDERING (Guards) ---
  if (loading) {
    return (
      <div className="recipe-loading-screen">
        <div className="recipe-spinner"></div>
        <span className="recipe-loading-text">Decrypting vault entry...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-message-box recipe-error">
        <h3>Blimey, an error occurred!</h3>
        <p>{error}</p>
        <Link to="/" className="recipe-return-link">Return to the Pantry</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-message-box recipe-warning">
        Recipe vanished into the ether.
      </div>
    );
  }

  // Handle the image string parsing
  const targetImage = recipe?.imageUrl || recipe?.image_url; 
  const fullImageUrl = targetImage 
    ? (targetImage.startsWith('http') ? targetImage : `${API_URL}${targetImage}`)
    : '/belle-house-fiesta-bowl.jpg';

  // --- THE UI RENDER ---
  return (
    <div className="recipe-page-container">
      
      {/* Back Button */}
      <div className="recipe-back-wrapper">
        <Link to="/" className="recipe-back-button">
          &larr; Back to Recipe Grid
        </Link>
      </div>

      {/* Hero Image */}
      <div className="recipe-image-wrapper">
        <img 
          src={fullImageUrl} 
          alt={recipe.title || 'A glorious WFPB meal'} 
          className="recipe-hero-image" 
        />
      </div>

      {/* Main Recipe Card */}
      <div className="recipe-card">
        <header className="recipe-header">
          
          {/* Oil-Free Badge at the very top! */}
          {Boolean(Number(recipe.is_oil_free)) && (
            <span className="recipe-badge-oil-free">
              🌿 100% Oil-Free
            </span>
          )}

          <h1 className="recipe-title">
            {recipe.title}
          </h1>
          
          {recipe.description && (
            <p className="recipe-description">
              {recipe.description}
            </p>
          )}

          {/* Recipe Meta Info (Time & Yields) */}
          <div className="recipe-meta-tags">
            <span className="recipe-meta-tag">
              ⏱ Prep: {recipe.prep_time_mins || 0}m
            </span>
            <span className="recipe-meta-tag">
              🔥 Cook: {recipe.cook_time_mins || 0}m
            </span>
            <span className="recipe-meta-tag">
              🍽 Yields: {recipe.yields}
            </span>
          </div>
        </header>

        {/* CHEF'S NOTES & OIL RATIONALE */}
        {recipe.oil_rationale && (
          <div className="recipe-rationale-box">
            <h4 className="recipe-rationale-title">
              <span className="icon-mr">📝</span> Culinary Rationale
            </h4>
            <p className="recipe-rationale-text">
              {recipe.oil_rationale}
            </p>
          </div>
        )}

        {/* Two-Column Grid for Content */}
        <div className="recipe-content-grid">
          
          {/* Left Column: Ingredients & Instructions */}
          <div className="recipe-main-col">
            
            {/* Ingredients Section */}
            <section className="recipe-section">
              <h3 className="recipe-section-title">Ingredients</h3>
              <ul className="recipe-ingredients-list">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, index) => {
                    // --- THE DYNAMIC RENDER LOGIC ---
                    // Hide 0 or 1 placeholders.
                    const hasRealQuantity = Number(ing.quantity) !== 0 && Number(ing.quantity) !== 1;
                    const hasRealUnit = ing.unit && ing.unit !== 'serving' && ing.unit !== '';

                    return (
                      <li key={index} className="recipe-ingredient-item">
                        <span className="recipe-ingredient-bullet">&#10003;</span>
                        <div className="recipe-ingredient-text">
                          {hasRealQuantity && (
                            <span className="recipe-ingredient-highlight">
                            	{Number(ing.quantity)}
                            </span>
                          )}
                          {hasRealUnit && (
                            <span className="recipe-ingredient-highlight">
                              {ing.unit}
                            </span>
                          )}
                          <span className="recipe-ingredient-name">
                            {ing.ingredient_name}
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="recipe-empty-state">No Ingredients Found.</li>
                )}
              </ul>
            </section>

            {/* Instructions Section */}
            <section className="recipe-section">
              <h3 className="recipe-section-title">Instructions</h3>
              <ol className="recipe-instructions-list">
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  recipe.instructions.map((step) => (
                    <li key={step.id} className="recipe-instruction-item">
                      <span className="recipe-instruction-number">
                        {step.step_number}
                      </span>
                      <span className="recipe-instruction-text">
                        {step.instruction_text}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="recipe-empty-state">
                    No instructions provided. Best of luck, mate. Just chuck it all in a pan and hope for the best!
                  </li>
                )}
              </ol>
            </section>
          </div>

          {/* Right Column: Nutrition Panel */}
          <div className="recipe-sidebar-col">
            <div className="recipe-sticky-sidebar">
              <NutritionPanel macros={recipe.macros} micros={recipe.micros} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;