/**
 * Mock Data Service for NutriLens Meals Cart Demo
 * This file handles nutrition database, meal planning logic, and grocery list generation.
 */

export const FOOD_DATABASE = {
    // Breakfast Items
    "Oats (50g)": { calories: 190, protein: 6, carbs: 32, fat: 4, category: "Carbs", unit: "g" },
    "Peanut Butter": { calories: 190, protein: 8, carbs: 6, fat: 16, category: "Healthy Fats", unit: "g" },
    "Banana": { calories: 105, protein: 1, carbs: 27, fat: 0, category: "Fruits", unit: "unit" },
    "Yogurt": { calories: 120, protein: 10, carbs: 10, fat: 3, category: "Protein", unit: "g" },
    "Milk": { calories: 150, protein: 8, carbs: 12, fat: 8, category: "Other", unit: "ml" },
    
    // Main Proteins
    "Chicken Breast": { calories: 220, protein: 40, carbs: 0, fat: 5, category: "Protein", unit: "g" },
    "Fish": { calories: 200, protein: 35, carbs: 0, fat: 6, category: "Protein", unit: "g" },
    
    // Carbs
    "Rice": { calories: 200, protein: 4, carbs: 45, fat: 1, category: "Carbs", unit: "g" },
    "Roti": { calories: 120, protein: 3, carbs: 20, fat: 2, category: "Carbs", unit: "unit" },
    "Bread": { calories: 140, protein: 5, carbs: 25, fat: 2, category: "Carbs", unit: "slice" },
    
    // Veggies & Fruit
    "Vegetables": { calories: 80, protein: 3, carbs: 15, fat: 1, category: "Vegetables", unit: "g" },
    "Apple": { calories: 95, protein: 0, carbs: 25, fat: 0, category: "Fruits", unit: "unit" },
    "Salad": { calories: 30, protein: 1, carbs: 5, fat: 0, category: "Vegetables", unit: "g" }
};

export const USER_GOALS = {
    calories: 2200,
    protein: 140,
    carbs: 230,
    fat: 70
};

/**
 * Generates a mock 7-day meal plan based on goals.
 */
export const getMockWeeklyPlan = (includeShake = false) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // Base meal templates
    const breakfastA = { name: "Oats + PB + Banana + Yogurt", items: ["Oats (50g)", "Peanut Butter", "Banana", "Yogurt"], calories: 520, protein: 22, carbs: 75, fat: 23 };
    const breakfastB = { name: "PB Bread + Yogurt", items: ["Bread", "Peanut Butter", "Yogurt"], calories: 450, protein: 23, carbs: 41, fat: 21 };
    
    const lunchA = { name: "Grilled Chicken + Rice + Veggies", items: ["Chicken Breast", "Rice", "Vegetables"], calories: 620, protein: 48, carbs: 60, fat: 7 };
    const lunchB = { name: "Chicken + Roti + Salad", items: ["Chicken Breast", "Roti", "Salad"], calories: 580, protein: 44, carbs: 45, fat: 10 };
    
    const dinnerA = { name: "Baked Fish + Roti + Salad", items: ["Fish", "Roti", "Salad"], calories: 450, protein: 38, carbs: 25, fat: 8 };
    const dinnerB = { name: "Baked Fish + Rice + Veggies", items: ["Fish", "Rice", "Vegetables"], calories: 550, protein: 42, carbs: 50, fat: 8 };
    
    const snack = { name: "PB Bread + Apple", items: ["Bread", "Peanut Butter", "Apple"], calories: 425, protein: 13, carbs: 56, fat: 18 };
    
    const shake = { name: "Protein Shake", items: ["Milk", "Oats (50g)", "Peanut Butter", "Banana"], calories: 450, protein: 22, carbs: 75, fat: 23 };

    return days.map((day, idx) => {
        const meals = [
            { type: "Breakfast", ...((idx % 2 === 0) ? breakfastA : breakfastB) },
            { type: "Lunch", ...((idx % 3 === 0) ? lunchA : lunchB) },
            { type: "Dinner", ...((idx % 2 === 1) ? dinnerA : dinnerB) },
            { type: "Snack", ...snack }
        ];

        if (includeShake) {
            meals.push({ type: "Supplement", ...shake });
        }

        const totals = meals.reduce((acc, m) => ({
            calories: acc.calories + m.calories,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return {
            day_of_week: day,
            meals,
            totals
        };
    });
};

/**
 * Aggregates ingredients from the weekly plan to generate a grocery list.
 */
export const getMockGroceriesFromPlan = (weeklyPlan) => {
    const ingredientCounts = {};

    weeklyPlan.forEach(day => {
        day.meals.forEach(meal => {
            meal.items.forEach(item => {
                const food = FOOD_DATABASE[item];
                if (!ingredientCounts[item]) {
                    ingredientCounts[item] = {
                        item_name: item,
                        quantity: 0,
                        unit: food.unit,
                        category: food.category,
                        count: 0
                    };
                }
                ingredientCounts[item].count += 1;
                // Add estimated amounts per serving
                const amountPerServing = item === "Chicken Breast" ? 200 : (item === "Rice" ? 150 : (item === "Fish" ? 200 : 1));
                ingredientCounts[item].quantity += amountPerServing;
            });
        });
    });

    // Format for UI with prices
    const prices = {
        "Protein": 120,
        "Carbs": 40,
        "Vegetables": 30,
        "Fruits": 25,
        "Healthy Fats": 80,
        "Other": 50
    };

    return Object.values(ingredientCounts).map((ing, idx) => {
        const basePrice = prices[ing.category] || 50;
        // Clean quantity representation
        let qtyStr = ing.quantity.toString();
        if (ing.unit === "g" && ing.quantity >= 1000) {
            qtyStr = (ing.quantity / 1000).toFixed(1);
            ing.unit = "kg";
        } else if (ing.unit === "ml" && ing.quantity >= 1000) {
            qtyStr = (ing.quantity / 1000).toFixed(1);
            ing.unit = "L";
        }

        return {
            id: idx + 1,
            item_name: ing.item_name,
            quantity: qtyStr,
            unit: ing.unit,
            category: ing.category,
            status: "pending",
            price: Math.round((basePrice * (ing.quantity / 100)) || basePrice * ing.count)
        };
    });
};
