# python_bridge/alert_server.py
# ─────────────────────────────────────────────────────────────────────────────
# Tiny Flask web server to bridge your existing Gemini Python script
# with the React Native iOS app.
#
# HOW TO USE:
#   1. pip install flask flask-cors
#   2. Call `add_alert(description, severity)` from your existing Gemini code
#      whenever a new AI detection happens.
#   3. Run this script (or import it into your main script).
#   4. The iOS app will poll http://<YOUR_IP>:5000/alerts every 5 seconds.
#
# REMOTE ACCESS:
#   ngrok:       ngrok http 5000
#   Cloudflare:  cloudflared tunnel --url http://localhost:5000
# ─────────────────────────────────────────────────────────────────────────────

from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
from threading import Lock
from typing import Literal
import threading

app = Flask(__name__)
CORS(app)  # Allow the mobile app to call from any origin

# ── In-memory alert store (last 100 alerts) ───────────────────────────────────

_lock = Lock()
_alerts: list[dict] = []
_MAX_ALERTS = 100

Severity = Literal["low", "medium", "high"]


def add_alert(description: str, severity: Severity = "medium") -> None:
    """
    Call this from your Gemini detection script instead of print().

    Example:
        add_alert("Person detected walking near front door", severity="high")
    """
    alert = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "description": description,
        "severity": severity,
    }
    with _lock:
        _alerts.insert(0, alert)          # newest first
        if len(_alerts) > _MAX_ALERTS:
            _alerts.pop()                  # drop oldest

    # Still print to terminal so your existing workflow isn't broken
    print(f"[ALERT] [{severity.upper()}] {description}")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/alerts", methods=["GET"])
def get_alerts():
    """Returns the last 100 alerts as JSON (newest first)."""
    with _lock:
        return jsonify(list(_alerts))


@app.route("/health", methods=["GET"])
def health():
    """Simple health check endpoint."""
    return jsonify({"status": "ok", "alert_count": len(_alerts)})


# ── Entry point ───────────────────────────────────────────────────────────────

def run_server(host: str = "0.0.0.0", port: int = 5000) -> None:
    """
    Run the Flask server in a background thread so it doesn't block
    your main Gemini detection loop.

    Call this once at the top of your main script:
        from alert_server import run_server, add_alert
        run_server()
        # ... rest of your Gemini code, calling add_alert() instead of print()
    """
    t = threading.Thread(
        target=lambda: app.run(host=host, port=port, debug=False, use_reloader=False),
        daemon=True,
    )
    t.start()
    print(f"[AlertServer] Running at http://{host}:{port}")


if __name__ == "__main__":
    # Standalone mode — add some test alerts then serve
    add_alert("Test alert: server started successfully", severity="low")
    add_alert("Person detected in living room", severity="high")
    add_alert("Motion detected near front door", severity="medium")
    print("[AlertServer] Starting on http://0.0.0.0:5000 ...")
    print("[AlertServer] Point your ngrok/Cloudflare tunnel at port 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
