from __future__ import annotations

import re

import numpy as np
import pandas as pd


def distance_to_meters(distance_str: object) -> float:
    if pd.isna(distance_str):
        return np.nan

    text = str(distance_str).strip().replace(",", "")
    if not text:
        return np.nan

    match = re.search(r"([\d.]+)\s*([a-zA-Z]*)", text)
    if not match:
        return np.nan

    value = float(match.group(1))
    unit = (match.group(2) or "").lower() or text.lower()

    if "km" in unit:
        return value * 1000
    return value
