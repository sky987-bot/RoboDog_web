from flask import Flask
from flask_cors import CORS

from database import db
from routes.auth import auth_bp
from routes.robot import robot_bp


app = Flask(__name__)

CORS(app)

# Register authentication routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(robot_bp, url_prefix="/api/robot")

@app.route("/")
def home():
    return {
        "message": "RoboDog Backend is Running"
    }


@app.route("/test-db")
def test_db():
    try:
        db.command("ping")

        return {
            "message": "MongoDB Connected Successfully!"
        }

    except Exception as e:
        return {
            "message": "MongoDB Connection Failed",
            "error": str(e)
        }, 500


if __name__ == "__main__":
    app.run(debug=True)