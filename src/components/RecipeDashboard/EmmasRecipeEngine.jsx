// src/pages/EmmasRecipeEngine.jsx

import React, { useState } from 'react';
import { getSystemInstructions } from '../../utils/promptBuilder';
import { sendChatMessage, generateRecipeImage } from '../../services/geminiApi'; 
import RecipeForm from './RecipeForm';
import RecipeResult from './RecipeResult';
import './EmmasRecipeEngine.css';

// NEW: Bring in the bouncer's guest list!
import { useAuth } from '../../context/AuthContext';

const EmmasRecipeEngine = () => {
    // Grab the logged-in user
    const { user } = useAuth();
    // Fallback to 'Guest' just in case, though the ProtectedRoute should prevent that
    const currentUserName = user?.username || 'Guest';

    const [chatHistory, setChatHistory] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [followUpText, setFollowUpText] = useState('');
    const [currentIsOilFree, setCurrentIsOilFree] = useState(true);

    const processChatTurn = async (newUserMessageText, isOilFreeSetting) => {
        setIsLoading(true);
        setError(null);
        setCurrentIsOilFree(isOilFreeSetting);

        const updatedHistory = [
            ...chatHistory, 
            { role: 'user', parts: [{ text: newUserMessageText }] }
        ];

        try {
            // NEW: Pass the username into my brain!
            const systemInstructions = getSystemInstructions(isOilFreeSetting, currentUserName);
            
            if (chatHistory.length === 0) {
                generateRecipeImage(newUserMessageText)
                    .then(base64Data => {
                        if (base64Data) {
                            setRecipeImage(`data:image/jpeg;base64,${base64Data}`);
                        }
                    })
                    .catch(err => console.error("The image generation threw a wobbly:", err));
            }

            const modelReplyText = await sendChatMessage(updatedHistory, systemInstructions);

            setChatHistory([
                ...updatedHistory,
                { role: 'model', parts: [{ text: modelReplyText }] }
            ]);

        } catch (err) {
            console.error("Dashboard caught an error:", err);
            setError(err.message || "Something went pear-shaped. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitialGenerate = (userRequest, isOilFree) => {
        setChatHistory([]);
        setRecipeImage(null); 
        processChatTurn(`I want a recipe for: ${userRequest}`, isOilFree);
    };

    const handleFollowUpSubmit = (e) => {
        e.preventDefault();
        if (!followUpText.trim()) return;
        
        const messageToSend = followUpText;
        setFollowUpText(''); 
        processChatTurn(messageToSend, currentIsOilFree);
    };

    return (
        <div className="recipe-dashboard-container">
            <header className="dashboard-header">
                <h2>Emma Advanced Premium Generator</h2>
                <p>Strictly WFPB. Full Macros. Live Banter Enabled.</p>
            </header>

            {chatHistory.length === 0 && (
                <RecipeForm 
                    onGenerate={handleInitialGenerate} 
                    isLoading={isLoading} 
                />
            )}

            {error && (
                <div className="error-banner">
                    <p><strong>Oi!</strong> {error}</p>
                </div>
            )}

            <div className="chat-container" style={{ marginTop: '2rem' }}>
                {chatHistory.map((msg, index) => {
                    if (msg.role === 'user') {
                        return (
                            <div key={index} style={{ textAlign: 'right', margin: '1rem 0', color: '#4a5568', fontStyle: 'italic' }}>
                                {/* NEW: Dynamic username in the chat! */}
                                <strong>{currentUserName}:</strong> {msg.parts[0].text}
                            </div>
                        )
                    } else {
                        return (
                            <RecipeResult 
                                key={index} 
                                recipeMarkdown={msg.parts[0].text} 
                                imageUrl={index === 1 ? recipeImage : null} 
                            />
                        )
                    }
                })}
            </div>

            {chatHistory.length > 0 && (
                <form onSubmit={handleFollowUpSubmit} style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder="Talk back to Emma (e.g., 'Swap the lentils for chickpeas, please!')"
                        disabled={isLoading}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0' }}
                    />
                    <button type="submit" className="submit-btn" disabled={isLoading || !followUpText.trim()}>
                        {isLoading ? "Thinking..." : "Send"}
                    </button>
                </form>
            )}
            
            {chatHistory.length > 0 && !isLoading && (
                 <button 
                    onClick={() => {
                        setChatHistory([]);
                        setRecipeImage(null);
                    }}
                    style={{ marginTop: '1rem', background: 'transparent', color: '#e53e3e', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                 >
                     Bin this and start a new recipe
                 </button>
            )}
        </div>
    );
};

export default EmmasRecipeEngine;