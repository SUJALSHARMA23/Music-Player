import os

from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.secret_key = "pulse_music_studio_2026"
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


@app.route("/")
def login_page():
    if "username" in session:
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():

    username = request.form.get("username", "").strip()
    password = request.form.get("password", "").strip()

    if username == "admin" and password == "1234":
        session["username"] = username
        session.setdefault("uploaded_songs", [])
        return redirect(url_for("dashboard"))

    return render_template(
        "login.html",
        error="Invalid username or password"
    )


@app.route("/dashboard")
def dashboard():

    if "username" not in session:
        return redirect(url_for("login_page"))

    uploaded_songs = session.get("uploaded_songs", [])

    return render_template(
        "index.html",
        username=session["username"],
        uploaded_songs=uploaded_songs
    )


@app.route("/upload", methods=["POST"])
def upload():
    if "username" not in session:
        return redirect(url_for("login_page"))

    music_file = request.files.get("music_file")
    if music_file and music_file.filename:
        filename = secure_filename(music_file.filename)
        if filename:
            save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            music_file.save(save_path)

            title = request.form.get("title", "").strip() or os.path.splitext(filename)[0]
            artist = request.form.get("artist", "").strip() or "Uploaded Artist"
            url = url_for("static", filename=f"uploads/{filename}")

            uploaded_songs = session.setdefault("uploaded_songs", [])
            uploaded_songs.append({
                "title": title,
                "artist": artist,
                "url": url,
            })
            session["uploaded_songs"] = uploaded_songs

    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login_page"))


if __name__ == "__main__":

    print("PULSE MUSIC STUDIO")
    print("Login URL : http://127.0.0.1:5000")
    print("Username  : admin")
    print("Password  : 1234")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )