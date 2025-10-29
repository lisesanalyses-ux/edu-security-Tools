# Unified Cyber Security Platform (UCSP) - Production Framework

This is a production-ready implementation of the UCSP framework, integrating KSP (Endpoint Detection & Response) and WSA (Windows Security Auditor) tools. The platform provides a web-based dashboard for real-time monitoring, correlation, and remediation of security incidents across endpoints.

## Features

- **Dashboard**: Overview of endpoints, alerts, and average risk scores
- **KSP Management**: View and refresh events from endpoint detection agents
- **WSA Management**: Audit results and one-click remediation
- **Correlation Dashboard**: Interactive risk map and incident investigation
- **settings**: Configuration modal (demo implementation)

## Architecture

- **Frontend**: HTML/CSS/JavaScript with SVG-based visualization
- **Backend**: Python Flask API with SQLite database for persistence
- **Database Models**: Endpoints, Events, Risks
- **API Endpoints**: JSON API for real-time data updates

## Installation

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python app.py
   # or
   ./run.bat
   ```

3. Open browser to `http://localhost:5000`

## Database

The app uses SQLite (`ucsp.db`) which is initialized with sample data on first run.

## Production Deployment

To deploy to production:
- Change Flask config for production (e.g., turn off debug)
- Use a proper WSGI server like Gunicorn
- Set up proper database (e.g., PostgreSQL)
- Configure reverse proxy (e.g., Nginx)
- Secure API with authentication/JWT

## Directory Structure

```
UCSP/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── README.md           # This file
├── UCSP_Design.md      # Original design document
├── run.bat             # Windows run script
├── static/             # Static files
│   └── UCSP_Framework.html  # Main HTML interface
└── static/             # (additional static files if needed)
```

## API Endpoints

- `GET /` - Serve main page
- `GET /api/dashboard` - Dashboard data
- `GET /api/endpoints` - Endpoint list
- `GET /api/ksp/events` - KSP events
- `GET /api/wsa/risks` - WSA risks
- `POST /api/remediate/<id>` - Remediate endpoint
- `POST /api/investigate` - Mark incident as resolved

## Testing

The framework includes interactive elements for testing functionality:
- Buttons trigger API calls
- Settings modal (demo)
- Map interactions
- Remediation workflows

## Future Enhancements

- Real-time WebSocket updates
- ML-powered anomaly detection
- User authentication and roles
- Audit logging
- Integration with real KSP/WSA agents

## License

This is a demo implementation for educational purposes.
