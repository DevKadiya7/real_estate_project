def test_list_properties(client):
    response = client.get("/api/analytics/properties")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    row = data[0]
    for key in ["id", "property_type", "sector", "price", "bedRoom", "latitude", "longitude", "luxury_category"]:
        assert key in row

    ids = [row["id"] for row in data]
    assert len(ids) == len(set(ids))
