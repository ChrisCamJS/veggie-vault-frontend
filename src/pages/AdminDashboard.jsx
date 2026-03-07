// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboard Component
 * The restricted area for managing The Veggie Vault.
 * Includes forms for adding recipes and lists for moderation.
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');

  // state for Manage Recipes
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // <-- Items per page can be adjusted here

    // fetch the recipes when switching to manage recipes tab
    useEffect(() => {
      if (activeTab === 'manage' && recipes.length === 0) {
        loadRecipes();
      }
    }, [activeTab]);

    const loadRecipes = async () => {
      try {
        const response = await api.getRecipes();
        // adjust this
        setRecipes(response || response.data);
      }
      catch (err) {
        console.error("Failed to load the recipes", err);
      }
    }

    // Dummy handlers for our action buttons (we'll wire these up to the API next)
  const handleEdit = (id) => console.log(`Editing recipe ${id}`);
  const handleDelete = (id) => console.log(`Deleting recipe ${id}`);
  const handleToggleDraft = (id) => console.log(`Toggling draft status for recipe ${id} (DB update needed)`);

  // Pagination math
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = recipes.slice(recipes.length / itemsPerPage);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h2>Admin Vault Control</h2>
        <div className={styles.adminTabs}>
          <button 
            className={activeTab === 'add' ? styles.active : ''} 
            onClick={() => setActiveTab('add')}
          >
            Add New Recipe
          </button>
          <button 
            className={activeTab === 'manage' ? styles.active : ''} 
            onClick={() => setActiveTab('manage')}
          >
            Manage Recipes
          </button>
        </div>
      </header>

      <main className={styles.adminContentArea}>
        {activeTab === 'add' ? (
          <section className={styles.addRecipeSection}>
            <h3>Secure Entry: New Recipe</h3>
            <form className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label>Recipe Title</label>
                <input type="text" placeholder="e.g. Iron-Rich Lentil Stew" />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prep Time (mins)</label>
                  <input type="number" />
                </div>
                <div className={styles.formGroup}>
                  <label>Cook Time (mins)</label>
                  <input type="number" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Oil-Free Rationale</label>
                <textarea placeholder="Explain why this fits the vault's standards..."></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Macros (Protein / Carbs / Fat)</label>
                <div className={styles.macroInputs}>
                  <input type="text" placeholder="P" />
                  <input type="text" placeholder="C" />
                  <input type="text" placeholder="F" />
                </div>
              </div>

              <button type="submit" className={styles.saveBtn}>Vault This Recipe</button>
            </form>
          </section>
        ) : (
          <section className={styles.manageRecipes}>
            <h3>Manage Vault Inventory</h3>
            
            {recipes.length === 0 ? (
                <p>Loading your culinary masterpieces...</p>
            ) : (
                <>
                    <div className={styles.recipeList}>
                        {currentRecipes.map(recipe => (
                            <div key={recipe.id} className={styles.recipeListItem}>
                                <div className={styles.recipeInfo}>
                                    <h4>{recipe.title}</h4>
                                    <span className={styles.recipeMeta}>
                                        ID: {recipe.id} | {recipe.yields || 'Yields unknown'}
                                    </span>
                                </div>
                                <div className={styles.recipeActions}>
                                    <button onClick={() => handleToggleDraft(recipe.id)} className={styles.draftBtn}>Hide</button>
                                    <button onClick={() => handleEdit(recipe.id)} className={styles.editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(recipe.id)} className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* The Paginator */}
                    <div className={styles.pagination}>
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className={styles.pageBtn}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages || 1}</span>
                        <button 
                            disabled={currentPage === totalPages || totalPages === 0} 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className={styles.pageBtn}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;