from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ucsp.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.static_folder = 'static'
db = SQLAlchemy(app)

# Database Models
class Endpoint(db.Model):
    id = db.Column(db.String(10), primary_key=True)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    risk = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(10), nullable=False)
    details = db.Column(db.String(200), nullable=False)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    endpoint = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Risk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    endpoint = db.Column(db.String(10), nullable=False)

# Initialize DB with sample data
def init_db():
    db.create_all()
    if Endpoint.query.count() == 0:
        endpoints_data = [
            {'id': 'WS001', 'x': 100, 'y': 100, 'risk': 85, 'color': 'red', 'details': 'High risk: Weak password + Anomaly detected'},
            {'id': 'WS002', 'x': 200, 'y': 150, 'risk': 60, 'color': 'orange', 'details': 'Medium risk: UAC disabled'},
            {'id': 'WS003', 'x': 300, 'y': 200, 'risk': 30, 'color': 'green', 'details': 'Low risk: Compliant config'},
            {'id': 'WS004', 'x': 150, 'y': 250, 'risk': 90, 'color': 'red', 'details': 'High risk: Multiple anomalies'}
        ]
        for e in endpoints_data:
            db.session.add(Endpoint(**e))
        db.session.commit()

    if Event.query.count() == 0:
        events_data = [
            'Process anomaly detected (PID: 1234, Score: 85) - Endpoint WS001',
            'Network connection to suspicious IP - Endpoint WS002'
        ]
        for e in events_data:
            db.session.add(Event(description=e, endpoint='WS001' if 'WS001' in e else 'WS002'))
        db.session.commit()

    if Risk.query.count() == 0:
        risks_data = [
            'Weak password policy on Endpoint WS001 (Score: 80)',
            'UAC disabled on Endpoint WS003 (Score: 70)'
        ]
        for r in risks_data:
            endpoint = 'WS001' if 'WS001' in r else 'WS003'
            score = 80 if '80' in r else 70
            db.session.add(Risk(description=r, risk_score=score, endpoint=endpoint))
        db.session.commit()

@app.route('/')
def index():
    return app.send_static_file('UCSP_Framework.html')

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    total_endpoints = Endpoint.query.count()
    active_alerts = Event.query.count()  # Simplification
    risk_average = db.session.query(db.func.avg(Endpoint.risk)).scalar() or 0
    return jsonify({
        'total_endpoints': total_endpoints,
        'active_alerts': active_alerts,
        'risk_average': round(risk_average)
    })

@app.route('/api/endpoints', methods=['GET'])
def get_endpoints():
    endpoints = Endpoint.query.all()
    return jsonify([{'id': e.id, 'x': e.x, 'y': e.y, 'risk': e.risk, 'color': e.color, 'details': e.details} for e in endpoints])

@app.route('/api/ksp/events', methods=['GET'])
def ksp_events():
    events = Event.query.all()
    return jsonify([f"{e.description} - Endpoint {e.endpoint}" for e in events])

@app.route('/api/wsa/risks', methods=['GET'])
def wsa_risks():
    risks = Risk.query.all()
    return jsonify([r.description for r in risks])

@app.route('/api/remediate/<id>', methods=['POST'])
def remediate(id):
    endpoint = Endpoint.query.get(id)
    if not endpoint:
        return jsonify({'error': 'Endpoint not found'}), 404
    endpoint.risk = max(0, endpoint.risk - 20)
    if endpoint.risk < 40:
        endpoint.color = 'green'
        endpoint.details = 'Low risk: Remediation applied'
    elif endpoint.risk < 70:
        endpoint.color = 'orange'
        endpoint.details = 'Medium risk: Remediation applied'
    else:
        endpoint.color = 'red'
        endpoint.details = 'High risk: Remediation applied'
    db.session.commit()
    return jsonify({'message': f'Remediation applied to {id}. Risk score: {endpoint.risk}'})

@app.route('/api/investigate', methods=['POST'])
def investigate():
    # Simulate investigation
    return jsonify({'message': 'Incident investigated and marked as resolved.'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
