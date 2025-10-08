# Dernier Métro API

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-18%2F18-brightgreen)

API pour obtenir les horaires de métro parisien avec endpoints pour les prochains et derniers passages.

## 🚀 Démarrage rapide

```bash
# Démarrer les services
docker compose up -d

# API disponible sur http://localhost:5001
# Swagger UI sur http://localhost:8080
```

## 🧪 Tests

```bash
cd api
npm install
npm test

# Couverture de code
npm run test:coverage
```

## 📱 Endpoints

- `GET /health` - Santé de l'API
- `GET /db-health` - Santé de la base de données
- `GET /next-metro?station=République` - Prochain passage
- `GET /last-metro?station=Chatelet` - Dernier passage

---

# 04 : branche sur votre répo + capture GET /last-metro?station=... (DB lue) et GET /next-metro?station=....

![app](assets/photo1.png)

![app](assets/photo2.png)

# 05 openapi-docs (mise à jour) + 06 — unit-tests (Jest)

![app](assets/photo4.png)

![app](assets/photo3.png)
