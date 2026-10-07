import io

from app import app


def test_login_success_redirects_to_dashboard():
    client = app.test_client()
    response = client.post(
        "/login",
        data={"username": "admin", "password": "1234"},
        follow_redirects=False,
    )

    assert response.status_code == 302
    assert response.headers["Location"] == "/dashboard"


def test_invalid_login_renders_error():
    client = app.test_client()
    response = client.post(
        "/login",
        data={"username": "admin", "password": "wrong"},
        follow_redirects=True,
    )

    assert response.status_code == 200
    assert b"Invalid username or password" in response.data


def test_dashboard_requires_login():
    client = app.test_client()
    response = client.get("/dashboard", follow_redirects=False)

    assert response.status_code == 302
    assert response.headers["Location"] == "/"


def test_upload_route_saves_song_and_shows_it():
    client = app.test_client()
    client.post("/login", data={"username": "admin", "password": "1234"}, follow_redirects=False)

    file_content = b"fake mp3 data"
    response = client.post(
        "/upload",
        data={
            "music_file": (io.BytesIO(file_content), "demo.mp3"),
            "title": "Demo Song",
            "artist": "Demo Artist",
        },
        follow_redirects=False,
    )

    assert response.status_code == 302
    assert response.headers["Location"] == "/dashboard"

    dashboard = client.get("/dashboard")
    assert b"Demo Song" in dashboard.data
    assert b"Demo Artist" in dashboard.data
