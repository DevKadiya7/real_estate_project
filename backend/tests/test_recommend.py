def test_recommend_options(client):
    response = client.get("/api/recommend/options")
    assert response.status_code == 200
    data = response.json()
    assert "locations" in data and "apartments" in data
    assert len(data["apartments"]) > 0


def test_nearby_properties(client):
    options = client.get("/api/recommend/options").json()
    location = options["locations"][0]

    response = client.get("/api/recommend/nearby", params={"location": location, "radius_km": 5})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_nearby_unknown_location_returns_404(client):
    response = client.get("/api/recommend/nearby", params={"location": "not-a-real-location", "radius_km": 5})
    assert response.status_code == 404


def test_recommend_properties(client):
    options = client.get("/api/recommend/options").json()
    apartment = options["apartments"][0]

    response = client.post("/api/recommend", json={"property_name": apartment, "top_n": 3})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert "PropertyName" in data[0]
    assert "SimilarityScore" in data[0]
    assert "amenities" in data[0]
    assert isinstance(data[0]["amenities"], list)


def test_recommend_unknown_apartment_returns_404(client):
    response = client.post("/api/recommend", json={"property_name": "not-a-real-apartment"})
    assert response.status_code == 404
