from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from database import users_collection


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Check all fields
    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    # Check if email already exists
    existing_user = users_collection.find_one({
        "email": email
    })

    if existing_user:
        return jsonify({
            "message": "Email already registered"
        }), 409

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create user
    user = {
        "name": name,
        "email": email,
        "password": hashed_password
    }

    # Save user in MongoDB
    users_collection.insert_one(user)

    return jsonify({
        "message": "Registration successful"
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not check_password_hash(user["password"], password):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }), 200
# =====================================
# FORGOT PASSWORD
# =====================================

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()

    email = data.get("email")

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "message": "Email is not registered"
        }), 404

    return jsonify({
        "message": "Email found. Password reset can continue."
    }), 200