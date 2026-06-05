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

Set the production environment values in `prod.env` first, including
`DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `NGINX_SERVER_NAME`,
`CERTBOT_DOMAIN`, and `CERTBOT_EMAIL`. If the Lets Encrypt volume is empty,
issue the first certificate with nginx stopped:

```bash
docker compose -f docker-compose.prod.yml --profile certbot-standalone run --rm --service-ports certbot-standalone
```

After the first certificate exists, start the stack:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- App entrypoint: `https://<your-domain>` (port 443)

For webroot renewals while nginx is running:

```bash
docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Environment Notes

- `CCRABDashboard/settings.py` keeps Homebrew GDAL/GEOS defaults for local runs.
- Docker sets `DJANGO_IN_DOCKER=True`, which switches GIS library detection to Linux/container paths.
- In production, set a real `DJANGO_SECRET_KEY`, production hostnames in
  `DJANGO_ALLOWED_HOSTS`, and scheme-qualified origins in
  `DJANGO_CSRF_TRUSTED_ORIGINS`.
- For the current production host, use
  `DJANGO_ALLOWED_HOSTS=159.203.109.18.sslip.io` and
  `DJANGO_CSRF_TRUSTED_ORIGINS=https://159.203.109.18.sslip.io`.

## REST API Client

Scripts can use the reusable Python client in `CCRABDashboard.api.client`.

```python
from CCRABDashboard.api.client import CCRABRestClient

client = CCRABRestClient(base_url="http://127.0.0.1:8000")
client.register_user(
    username="new_api_user",
    password="StrongPass123!",
    email="new_api_user@example.com",
)

projects = client.list_projects(q="air")
platforms = client.list_platforms(name="purple")
```

Existing users can request a JWT pair directly:

```python
from CCRABDashboard.api.client import CCRABRestClient

client = CCRABRestClient.from_credentials(
    "ccrab_system_api_user",
    "your-password",
    base_url="http://127.0.0.1:8000",
)

config = client.platform_configuration(data_source="purple_air")
```

The client stores returned `access` and `refresh` tokens, sends
`Authorization: Bearer <token>` for authenticated API calls, and automatically
tries one token refresh after a `401` when a refresh token is available. The
`system/platform_configuration/` endpoint also requires the user to be in the
Django `private_api_access` group.
