def calculate_bmr(weight_kg: float, height_cm: float, age_years: int, gender: str) -> float:
    if gender.lower() == "male":
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years) + 5
    else:
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years) - 161

def calculate_tdee(bmr: float, activity_level: str) -> float:
    multipliers = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
        "Extra Active": 1.9
    }
    return bmr * multipliers.get(activity_level, 1.2)

def calculate_macros(tdee: float, protein_ratio: float, carb_ratio: float, fat_ratio: float):
    # Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
    protein_g = (tdee * protein_ratio) / 4
    carb_g = (tdee * carb_ratio) / 4
    fat_g = (tdee * fat_ratio) / 9
    return {
        "calories": tdee,
        "protein_g": protein_g,
        "carbs_g": carb_g,
        "fat_g": fat_g
    }
