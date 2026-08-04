def test_predict_returns_price_range(client):
    options = client.get("/api/metadata/options").json()

    payload = {
        "property_type": "flat",
        "sector": options["sectors"][0],
        "bedRoom": 2,
        "bathroom": 2,
        "balcony": 1,
        "agePossession": options["ages"][0],
        "built_up_area": 1200,
        "servant_room": 0,
        "store_room": 0,
        "furnishing_type": options["furnishing_types"][0],
        "luxury_category": options["luxury_categories"][0],
        "floor_category": options["floor_categories"][0],
    }

    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["property_type"] == "flat"
    assert data["unit"] == "Cr"
    assert data["low"] <= data["base_price"] <= data["high"]


def test_predict_validation_error(client):
    response = client.post("/api/predict", json={"property_type": "flat"})
    assert response.status_code == 422
