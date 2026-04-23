# CCRABDashBoard

CCRAB dashboard Django project.

## Local (PyCharm / venv)

1. Copy `.env.sample` to `.env` and set values for your environment.
2. Start your local database.
3. Run Django as you do today:

```bash
python manage.py migrate
python manage.py runserver
```

## Docker Development

This runs Django with hot reload plus PostGIS.

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Django app: `http://localhost:8000`
- Postgres/PostGIS: `localhost:5432`

## Docker Production-Style Stack

This runs:
- Django via Gunicorn (`web`)
- PostGIS (`db`)
- Nginx reverse proxy/static/media server (`nginx`)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- App entrypoint: `http://localhost` (port 80)

## Environment Notes

- `CCRABDashboard/settings.py` keeps Homebrew GDAL/GEOS defaults for local runs.
- Docker sets `DJANGO_IN_DOCKER=True`, which switches GIS library detection to Linux/container paths.
- In production, set a real `DJANGO_SECRET_KEY` and production hostnames in `DJANGO_ALLOWED_HOSTS`.
