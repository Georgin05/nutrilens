def calculate_bmr(weight_kg: float, height_cm: float, age_years: int, gender: str) -> float:
    """
    Calculates Basal Metabolic Rate using the Harris-Benedict Equation.
    Gender must be 'male' or 'female'.
    """
    gender_lower = gender.lower()
    
    if gender_lower == 'male':
        # BMR = 88.362 + (13.397 x weight) + (4.799 x height) - (5.677 x age)
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age_years)
    elif gender_lower == 'female':
        # BMR = 447.593 + (9.247 x weight) + (3.098 x height) - (4.330 x age)
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age_years)
    else:
        raise ValueError("Gender must be 'male' or 'female' for BMR calculation.")
        
    return round(bmr, 2)
