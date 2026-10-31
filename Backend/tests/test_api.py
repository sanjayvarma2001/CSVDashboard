# tests/test_api.py
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200


def test_upload_then_chat():
    csv = b"name,age\nAsha,30\nRavi,25\n"
    upload = client.post("/upload", files={"file": ("test.csv", csv, "text/csv")})
    assert upload.status_code == 200
    report_id = upload.json()["id"]

    chat = client.post(f"/reports/{report_id}/chat", json={"message": "What is the average age?"})
    assert chat.status_code == 200
    assert "response" in chat.json()
    assert len(chat.json()["history"]) >= 2