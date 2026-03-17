import React, { useState, useEffect } from 'react';
import { ShoppingCart, Leaf, Beef, Wheat, Droplets, Download, Printer, Check, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './GroceryPage.css';

const categoryIcons = {
  "Vegetables": <Leaf className="category-icon veg" />,
  "Protein": <Beef className="category-icon protein" />,
  "Carbs": <Wheat className="category-icon carbs" />,
  "Healthy Fats": <Droplets className="category-icon fats" />,
  "Other": <ShoppingCart className="category-icon other" />
};

export default function GroceryPage({ showHeader = true, initialItems = [] }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
      setLoading(false);
    } else {
      fetchGroceryList();
    }
  }, [initialItems]);

  const fetchGroceryList = async () => {
    try {
      setLoading(true);
      const data = await api.getGroceryList();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch grocery list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const data = await api.generateGroceryList();
      setItems(data);
    } catch (error) {
      console.error("Failed to generate grocery list:", error);
      alert("Failed to generate plan. Make sure you have a weekly meal plan generated.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'bought' ? 'pending' : 'bought';
    try {
      // Optimistic update
      setItems(items.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
      await api.updateGroceryItemStatus(itemId, newStatus);
    } catch (error) {
      console.error("Failed to update item:", error);
      // Revert on failure
      setItems(items.map(item => item.id === itemId ? { ...item, status: currentStatus } : item));
    }
  };

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalEstimatedCost = items.reduce((sum, item) => sum + (item.price || 0), 0);

  if (loading && items.length === 0) {
    return <div className="grocery-loading-spinner">Loading your grocery list...</div>;
  }

  return (
    <div className={`grocery-page-container ${!showHeader ? 'no-header' : ''}`}>
      {/* Header */}
      {showHeader && (
        <header className="grocery-header">
          <div className="header-left">
            <h2 className="header-title">Grocery Cart</h2>
            <div className="header-toggle-container clay-inset">
              <button 
                onClick={() => navigate('/meals-cart')}
                className="toggle-btn"
              >
                Meals
              </button>
              <button className="toggle-btn active">Groceries</button>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-icon-btn clay-morphic">
              <Bell size={20} />
            </button>
            <button className="action-icon-btn clay-morphic">
              <Search size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="grocery-content">
        <div className="grocery-content-inner">
          <div className="grocery-title-section">
            <h3 className="grocery-main-title">Weekly Grocery List</h3>
            <p className="grocery-subtitle">Based on your personalized nutrition plan (7 days)</p>
            {items.length === 0 && (
              <button 
                onClick={handleGenerate} 
                disabled={generating}
                className="btn-generate-main clay-button-primary"
              >
                {generating ? "Generating..." : "Generate List from Plan"}
              </button>
            )}
          </div>

          <div className="grocery-grid">
            {Object.keys(categories).map(category => (
              <div key={category} className="grocery-category-card clay-morphic">
                <div className="category-header">
                  {categoryIcons[category] || categoryIcons["Other"]}
                  <h4 className="category-title">{category}</h4>
                </div>
                <div className="category-items-list">
                  {categories[category].map(item => (
                    <label key={item.id} className="grocery-item-row clay-inset group">
                      <div className="item-info">
                        <span className="item-name">{item.item_name}</span>
                        {item.quantity > 0 && (
                          <span className="item-qty">{item.quantity} {item.unit}</span>
                        )}
                      </div>
                      <div className="checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          checked={item.status === 'bought'}
                          onChange={() => toggleItem(item.id, item.status)}
                          className="grocery-checkbox"
                        />
                        <div className="custom-checkbox">
                          {item.status === 'bought' && <Check size={14} />}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="grocery-footer backdrop-blur-md">
        <div className="grocery-footer-inner">
          <div className="cost-summary">
            <span className="cost-label">Estimated Cost</span>
            <div className="cost-value-container">
              <span className="cost-currency">₹</span>
              <span className="cost-amount">{totalEstimatedCost || 2800}</span>
              <span className="cost-period">/ week</span>
            </div>
          </div>
          <div className="footer-actions">
            <button className="btn-footer-secondary clay-morphic">
              <Download size={20} />
              Export List
            </button>
            <button className="btn-footer-primary clay-button-primary">
              <Printer size={20} />
              Print
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
