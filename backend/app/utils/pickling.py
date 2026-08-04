from __future__ import annotations

import pickle
from pathlib import Path
from typing import Any


def read_pickle(path: Path) -> Any:
    with open(path, "rb") as file:
        return pickle.load(file)
