# Docker Usage Guide

## 🐳 Environment Types

### 1. **Local Development** (`docker-compose.yml`)

```bash
# Local development with hot reload
docker-compose up --build

# Access: http://localhost:3000
```

### 2. **Development Server** (`docker-compose.dev.yml`)

```bash
# Development server deployment
docker-compose -f docker-compose.dev.yml up --build

# Access: http://localhost:3001
```

### 3. **Production Server** (`docker-compose.prod.yml`)

```bash
# Production server deployment
docker-compose -f docker-compose.prod.yml up --build

# Access: http://localhost:9084
```

## 🏷️ Docker Image Tags

| Environment     | Tag     | Usage                       |
| --------------- | ------- | --------------------------- |
| **Local**       | `local` | Development with hot reload |
| **Development** | `dev`   | Development server          |
| **Production**  | `prod`  | Production server           |

## 🔧 Environment Variables

### Required in `.env`:

```bash
DOCKER_USERNAME=your_dockerhub_username
PROJECT_NAME=nexus-frontend
```

### Optional:

```bash
VITE_APP_DOMAIN=nexus.sanjar.me
VITE_APP_DEV_DOMAIN=nexus-dev.sanjar.me
```

## 🚀 Quick Start

### Local Development:

```bash
# 1. Copy environment file
cp env.example .env

# 2. Edit .env with your values
nano .env

# 3. Start local development
docker-compose up --build
```

### Development Server:

```bash
# Build and run development server
docker-compose -f docker-compose.dev.yml up --build

# Or build first, then run
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

### Production Server:

```bash
# Build and run production server
docker-compose -f docker-compose.prod.yml up --build

# Or build first, then run
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

## 📁 File Structure

```
├── docker-compose.yml          # Local development
├── docker-compose.dev.yml      # Development server
├── docker-compose.prod.yml     # Production server
├── Dockerfile                  # Production build
├── Dockerfile.dev              # Development build
├── nginx/
│   ├── nexus.conf             # Production nginx
│   └── dev.nexus.conf         # Development nginx
└── .env                       # Environment variables
```

## 🔍 Container Names

| Environment     | Container Name         | Port |
| --------------- | ---------------------- | ---- |
| **Local**       | `nexus_frontend_local` | 3000 |
| **Development** | `nexus_frontend_dev`   | 3001 |
| **Production**  | `nexus_frontend_prod`  | 80   |

## 🛠️ Useful Commands

```bash
# Build and run
docker-compose -f docker-compose.dev.yml up --build    # Development
docker-compose -f docker-compose.prod.yml up --build   # Production

# Build only
docker-compose -f docker-compose.dev.yml build         # Development
docker-compose -f docker-compose.prod.yml build        # Production

# View logs
docker-compose -f docker-compose.dev.yml logs -f       # Development
docker-compose -f docker-compose.prod.yml logs -f      # Production

# Stop containers
docker-compose -f docker-compose.dev.yml down          # Development
docker-compose -f docker-compose.prod.yml down         # Production

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Remove all containers and images
docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans

# List images
docker images | grep nexus-frontend

# Remove specific image
docker rmi nexus-frontend_dev
docker rmi nexus-frontend_prod
```

## 🔄 CI/CD Integration

The project uses GitHub Actions for automated deployment:

- **Push to `main`** → Deploy to production
- **Push to `development`** → Deploy to development
- **Pull Request** → Run tests only

## 📝 Notes

- Local development uses volume mounting for hot reload
- Development and Production use pre-built Docker images
- Nginx is included for production and development servers
- SSL certificates are managed automatically via Certbot
