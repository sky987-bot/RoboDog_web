from flask import Blueprint, jsonify
from database import alerts_collection

robot_bp = Blueprint("robot", __name__)


# Store current robot command
current_command = "stop"
battery_level = 85
patrol_status = "inactive"

@robot_bp.route("/forward", methods=["POST"])
def forward():
    global current_command

    current_command = "forward"

    return jsonify({
        "message": "Robot moving forward",
        "command": current_command
    })


@robot_bp.route("/backward", methods=["POST"])
def backward():
    global current_command

    current_command = "backward"

    return jsonify({
        "message": "Robot moving backward",
        "command": current_command
    })


@robot_bp.route("/left", methods=["POST"])
def left():
    global current_command

    current_command = "left"

    return jsonify({
        "message": "Robot turning left",
        "command": current_command
    })


@robot_bp.route("/right", methods=["POST"])
def right():
    global current_command

    current_command = "right"

    return jsonify({
        "message": "Robot turning right",
        "command": current_command
    })


@robot_bp.route("/stop", methods=["POST"])
def stop():
    global current_command

    current_command = "stop"

    return jsonify({
        "message": "Robot stopped",
        "command": current_command
    })


@robot_bp.route("/status", methods=["GET"])
def status():
    return jsonify({
        "status": "online",
        "command": current_command,
        "battery": battery_level
    })
# =====================================
# PATROL SYSTEM
# =====================================

@robot_bp.route("/patrol/start", methods=["POST"])
def start_patrol():

    global patrol_status
    global current_stop
    global next_stop
    global patrol_progress

    patrol_status = "active"

    current_stop = "Main Gate"
    next_stop = "Parking Area"
    patrol_progress = 20

    return jsonify({
        "message": "Patrol started",
        "patrol_status": patrol_status,
        "current_stop": current_stop,
        "next_stop": next_stop,
        "progress": patrol_progress
    })


@robot_bp.route("/patrol/stop", methods=["POST"])
def stop_patrol():

    global patrol_status

    patrol_status = "inactive"

    return jsonify({
        "message": "Patrol stopped",
        "patrol_status": patrol_status
    })


@robot_bp.route("/patrol/status", methods=["GET"])
def patrol_status_api():

    return jsonify({
        "patrol_status": patrol_status
    })
# =====================================
# INTRUDER DETECTION
# =====================================

intruder_count = 0
suspicion_rate = 0
intruder_status = "No Intruder"


@robot_bp.route("/intruder/status", methods=["GET"])
def intruder_status_api():

    return jsonify({
        "status": intruder_status,
        "count": intruder_count,
        "suspicion_rate": suspicion_rate
    })
# =====================================
# TEST INTRUDER DETECTION
# =====================================

@robot_bp.route("/intruder/test", methods=["POST"])
def test_intruder():

    global intruder_count
    global suspicion_rate
    global intruder_status

    intruder_count = 1
    suspicion_rate = 85
    intruder_status = "Intruder Detected"
    alerts.append({
    "type": "Intruder",
    "message": "Intruder detected!",
    "suspicion_rate": suspicion_rate
})
    alerts_collection.insert_one({
    "type": "Intruder",
    "message": "Intruder detected!",
    "suspicion_rate": suspicion_rate
})

    return jsonify({
        "message": "Test intruder detected",
        "status": intruder_status,
        "count": intruder_count,
        "suspicion_rate": suspicion_rate
    })
# =====================================
# RESET INTRUDER DETECTION
# =====================================

@robot_bp.route("/intruder/reset", methods=["POST"])
def reset_intruder():

    global intruder_count
    global suspicion_rate
    global intruder_status

    intruder_count = 0
    suspicion_rate = 0
    intruder_status = "No Intruder"

    return jsonify({
        "message": "Intruder detection reset",
        "status": intruder_status,
        "count": intruder_count,
        "suspicion_rate": suspicion_rate
    })
# =====================================
# DISASTER DETECTION
# =====================================

disaster_status = "Safe"
disaster_type = "None"
disaster_confidence = 0


@robot_bp.route("/disaster/status", methods=["GET"])
def disaster_status_api():

    return jsonify({
        "status": disaster_status,
        "type": disaster_type,
        "confidence": disaster_confidence
    })
# =====================================
# TEST DISASTER DETECTION
# =====================================

@robot_bp.route("/disaster/test", methods=["POST"])
def test_disaster():

    global disaster_status
    global disaster_type
    global disaster_confidence

    disaster_status = "Disaster Detected"
    disaster_type = "Fire"
    disaster_confidence = 92
    alerts.append({
    "type": "Disaster",
    "message": "Fire detected!",
    "disaster_type": disaster_type,
    "confidence": disaster_confidence
})
    alerts_collection.insert_one({
    "type": "Disaster",
    "message": "Fire detected!",
    "disaster_type": disaster_type,
    "confidence": disaster_confidence
})

    return jsonify({
        "message": "Test disaster detected",
        "status": disaster_status,
        "type": disaster_type,
        "confidence": disaster_confidence
    })
# =====================================
# RESET DISASTER DETECTION
# =====================================

@robot_bp.route("/disaster/reset", methods=["POST"])
def reset_disaster():

    global disaster_status
    global disaster_type
    global disaster_confidence

    disaster_status = "Safe"
    disaster_type = "None"
    disaster_confidence = 0

    return jsonify({
        "message": "Disaster detection reset",
        "status": disaster_status,
        "type": disaster_type,
        "confidence": disaster_confidence
    })
# =====================================
# ALERT SYSTEM
# =====================================

alerts = []


@robot_bp.route("/alerts", methods=["GET"])
def get_alerts():

    return jsonify({
        "alerts": alerts,
        "count": len(alerts)
    })
# =====================================
# PATROL ROUTE
# =====================================

patrol_route = [
    "Main Gate",
    "Parking Area",
    "Building A",
    "Building B",
    "Return to Main Gate"
]
current_stop = "Main Gate"
next_stop = "Parking Area"
patrol_progress = 0

@robot_bp.route("/patrol/route", methods=["GET"])
def get_patrol_route():

    return jsonify({
        "route": patrol_route
    })
@robot_bp.route("/patrol/location", methods=["GET"])
def patrol_location():

    return jsonify({
        "current_stop": current_stop,
        "next_stop": next_stop,
        "progress": patrol_progress
    })
# =====================================
# NEXT PATROL STOP
# =====================================

@robot_bp.route("/patrol/next", methods=["POST"])
def next_patrol_stop():

    global current_stop
    global next_stop
    global patrol_progress

    if current_stop == "Main Gate":
        current_stop = "Parking Area"
        next_stop = "Building A"
        patrol_progress = 40

    elif current_stop == "Parking Area":
        current_stop = "Building A"
        next_stop = "Building B"
        patrol_progress = 60

    elif current_stop == "Building A":
        current_stop = "Building B"
        next_stop = "Return to Main Gate"
        patrol_progress = 80

    elif current_stop == "Building B":
        current_stop = "Return to Main Gate"
        next_stop = "Completed"
        patrol_progress = 100

    else:
        current_stop = "Main Gate"
        next_stop = "Parking Area"
        patrol_progress = 0

    return jsonify({
        "current_stop": current_stop,
        "next_stop": next_stop,
        "progress": patrol_progress
    })
# =====================================
# ALERT HISTORY
# =====================================

@robot_bp.route("/alerts/history", methods=["GET"])
def alert_history():

    alerts_history = list(
        alerts_collection.find(
            {},
            {"_id": 0}
        )
    )

    return jsonify({
        "alerts": alerts_history,
        "count": len(alerts_history)
    })