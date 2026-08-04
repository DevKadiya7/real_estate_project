def test_sector_stats(client):
    response = client.get("/api/analytics/sector-stats")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "sector" in data[0]


def test_feature_text(client):
    response = client.get("/api/analytics/feature-text")
    assert response.status_code == 200
    assert "text" in response.json()


def test_area_vs_price(client):
    response = client.get("/api/analytics/area-vs-price", params={"property_type": "flat"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_area_vs_price_rejects_invalid_type(client):
    response = client.get("/api/analytics/area-vs-price", params={"property_type": "villa"})
    assert response.status_code == 422


def test_bedroom_pie(client):
    response = client.get("/api/analytics/bedroom-pie")
    assert response.status_code == 200
    data = response.json()
    assert "labels" in data and "values" in data
