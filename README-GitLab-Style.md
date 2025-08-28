# GitLab-Style CI/CD Pipeline (GitHub Actions)

Bu loyiha GitLab CI/CD konfiguratsiyasiga asoslangan GitHub Actions workflow ga ega.

## Workflow Struktura

### Stages:
1. **Build Stage** - Docker image yaratish va push
2. **Deploy Stage** - Server ga deploy qilish

### Jobs:

#### Build Jobs:
- `build-prod` - Production image yaratish (main branch)
- `build-dev` - Development image yaratish (develop branch)

#### Deploy Jobs:
- `deploy-prod` - Production server ga deploy
- `deploy-dev` - Development server ga deploy

## Trigger

### Avtomatik:
- **Main branch** push → Production build va deploy
- **Develop branch** push → Development build va deploy

### Manual:
- GitHub Actions → GitLab-Style CI/CD Pipeline → Run workflow
- Environment tanlash: `prod` yoki `dev`

## Domainlar

- **Production**: `https://swem.musait.tech`
- **Development**: `https://dev.swem.musait.tech`

## GitHub Secrets

Repository Settings → Secrets and variables → Actions da quyidagi secrets qo'shing:

### SSH Configuration:
- `SSH_PRIVATE_KEY` - Server SSH private key
- `SSH_KNOWN_HOSTS` - Server known_hosts content
- `SERVER_USER` - Server username
- `SERVER_HOST` - Server host/IP

### Example SSH setup:
```bash
# SSH key yaratish
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Public key ni server ga qo'shish
ssh-copy-id user@server

# Known hosts olish
ssh-keyscan -H server_ip >> ~/.ssh/known_hosts
cat ~/.ssh/known_hosts
```

## Server Setup

### Directory Structure:
```
~/app/swem/swem-frontend/
├── docker-compose.prod.yml
├── docker-compose.dev.yml
├── nginx/
│   ├── swem.musait.tech.conf
│   └── dev.swem.musait.tech.conf
└── .env files
```

### Server Requirements:
- Docker va Docker Compose
- Nginx
- Certbot (SSL uchun)
- SSH access

## Deployment Process

### Production Deploy:
1. Main branch ga push
2. GitHub Actions build-prod job ishga tushadi
3. Docker image yaratiladi va GitHub Container Registry ga push qilinadi
4. deploy-prod job ishga tushadi
5. Server ga fayllar copy qilinadi
6. Docker Compose orqali container ishga tushiriladi
7. Nginx konfiguratsiyasi yangilanadi
8. SSL sertifikat tekshiriladi/yaratiladi

### Development Deploy:
1. Develop branch ga push
2. GitHub Actions build-dev job ishga tushadi
3. Docker image yaratiladi va GitHub Container Registry ga push qilinadi
4. deploy-dev job ishga tushadi
5. Server ga fayllar copy qilinadi
6. Docker Compose orqali container ishga tushiriladi
7. Nginx konfiguratsiyasi yangilanadi
8. SSL sertifikat tekshiriladi/yaratiladi

## Nginx Configuration

### Production (`nginx/swem.musait.tech.conf`):
- HTTPS redirect
- SSL sertifikat
- Security headers
- Static asset caching (1 yil)
- SPA routing

### Development (`nginx/dev.swem.musait.tech.conf`):
- HTTPS redirect
- SSL sertifikat
- Security headers (kamroq strict)
- Static asset caching (1 soat)
- SPA routing

## SSL Certificate Management

Certbot orqali avtomatik SSL sertifikat yaratish va yangilash:

```bash
# Yangi sertifikat yaratish
certbot --nginx -d swem.musait.tech --non-interactive --agree-tos -m admin@musait.tech

# Sertifikat yangilash
certbot renew --quiet
```

## Monitoring

### Health Check:
- Production: `https://swem.musait.tech/health`
- Development: `https://dev.swem.musait.tech/health`

### Logs:
```bash
# Production logs
docker-compose -f docker-compose.prod.yml logs -f

# Development logs
docker-compose -f docker-compose.dev.yml logs -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Build xatolari:
```bash
# Local test
docker build -t test-image .
docker build -f Dockerfile.dev -t test-dev-image .
```

### Deploy xatolari:
```bash
# SSH connection test
ssh user@server "echo 'Connection successful'"

# Server da docker-compose test
ssh user@server "docker-compose --version"

# Nginx config test
ssh user@server "nginx -t"
```

### SSL xatolari:
```bash
# Certbot status
ssh user@server "certbot certificates"

# Manual SSL test
ssh user@server "openssl s_client -connect swem.musait.tech:443"
```

## Manual Deployment

### Production:
```bash
# Manual production deploy
./deploy.sh production deploy

# Manual production stop
./deploy.sh production stop

# Manual production logs
./deploy.sh production logs
```

### Development:
```bash
# Manual development deploy
./deploy.sh development deploy

# Manual development stop
./deploy.sh development stop

# Manual development logs
./deploy.sh development logs
```

## Rollback

Agar muammo bo'lsa, oldingi versiyaga qaytish:

```bash
# Server da
cd ~/app/swem/swem-frontend
git log --oneline -5
git checkout <previous-commit-hash>
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## Performance Optimization

### Docker:
- Multi-stage builds
- Layer caching
- Image optimization

### Nginx:
- Gzip compression
- Static asset caching
- HTTP/2 support

### SSL:
- Modern cipher suites
- Session caching
- OCSP stapling
