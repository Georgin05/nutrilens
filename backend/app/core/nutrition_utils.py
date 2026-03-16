def calculate_bmr(weight_kg: float, height_cm: float, age_years: int, gender: str) -> float:
    """
    Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
    """
    if gender.lower() == 'male':
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years) + 5
    else:
        # Default to female calculation
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years) - 161

def calculate_tdee(bmr: float, activity_level: float) -> float:
    """
    Calculate Total Daily Energy Expenditure (TDEE).
    activity_level typically ranges from 1.2 (sedentary) to 1.9 (very active).
    """
    return bmr * activity_level
