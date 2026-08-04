def test_metadata_options(client):
    response = client.get("/api/metadata/options")
    assert response.status_code == 200

    data = response.json()
    for key in [
        "property_types", "sectors", "bedrooms", "bathrooms", "balconies",
        "ages", "furnishing_types", "luxury_categories", "floor_categories",
        "locations", "apartments",
    ]:
        assert key in data
        assert isinstance(data[key], list)
        assert len(data[key]) > 0

    assert set(data["property_types"]) <= {"flat", "house"}
    assert data["floor_categories"] == ["Low Floor", "Mid Floor", "High Floor"]
