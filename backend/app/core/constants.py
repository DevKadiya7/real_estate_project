"""Domain constants shared across services (category thresholds, labels)."""
from __future__ import annotations

LUXURY_LOW_MAX = 50
LUXURY_MEDIUM_MAX = 150

FLOOR_LOW_MAX = 2
FLOOR_MID_MAX = 10

FLOOR_CATEGORIES = ["Low Floor", "Mid Floor", "High Floor"]

PROPERTY_TYPES = ["flat", "house"]

CRORE = 1e7


def categorize_luxury(score: float) -> str:
    if score < LUXURY_LOW_MAX:
        return "Low"
    if score < LUXURY_MEDIUM_MAX:
        return "Medium"
    return "High"


def categorize_floor(floor: float) -> str:
    if floor <= FLOOR_LOW_MAX:
        return "Low Floor"
    if floor <= FLOOR_MID_MAX:
        return "Mid Floor"
    return "High Floor"
