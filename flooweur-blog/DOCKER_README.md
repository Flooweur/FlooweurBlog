# FlooweurBlog Docker Deployment

This guide explains how to deploy the FlooweurBlog application using Docker and Docker Compose.

## Architecture

The application consists of 4 services:

1. **Frontend** (React) - Port 3000
2. **Backend** (Node.js/Express) - Port 3001
3. **Database** (MongoDB) - Port 8081
4. **Database Admin** (Mongo Express) - Port 8082

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

## Quick Start

1. Navigate to the project directory:
   ```bash
   cd flooweur-blog
   ```

2. Build and start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001/api
   - **Database Admin**: http://localhost:8082 (admin/admin123)

## Individual Commands

### Build all services
```bash
docker-compose build
```

### Start services in background
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (clean slate)
```bash
docker-compose down -v
```

## Service Management

### Restart a specific service
```bash
docker-compose restart frontend
docker-compose restart backend
docker-compose restart mongodb
```

### View service status
```bash
docker-compose ps
```

### Execute commands in running containers
```bash
# Access backend container
docker-compose exec backend sh

# Access database
docker-compose exec mongodb mongosh
```

## Environment Configuration

Default environment variables are configured in `docker.env`. To customize:

1. Copy the file: `cp docker.env .env.local`
2. Modify values in `.env.local`
3. Update `docker-compose.yml` to use the new env file

## Database

### Default Credentials
- **Database**: `flooweur_blog`
- **Username**: `admin`
- **Password**: `password123`

### Mongo Express Access
- **URL**: http://localhost:8082
- **Username**: `admin`
- **Password**: `admin123`

### Data Persistence
Database data is persisted in a Docker volume named `mongodb_data`.

## Development vs Production

### Development
Use the existing npm scripts for development:
```bash
npm run dev  # Starts both frontend and backend
```

### Production
Use Docker Compose for production deployment:
```bash
docker-compose up -d
```

## Troubleshooting

### Port Conflicts
If ports are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3001"  # Change first number (host port)
```

### Build Issues
Clean and rebuild:
```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up
```

### Database Connection Issues
1. Ensure MongoDB is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify database credentials in `docker-compose.yml`

### Frontend API Issues
1. Check if backend is healthy: `docker-compose ps`
2. Verify nginx proxy configuration in `nginx.conf`
3. Ensure REACT_APP_API_URL is set correctly

## Health Checks

The backend includes health checks that verify:
- Service is responding on port 3001
- API endpoint `/api/articles` is accessible

Check health status:
```bash
docker-compose ps
```

## Security Notes

**Important**: Change default passwords before production deployment!

Update these in `docker-compose.yml`:
- MongoDB admin password
- Mongo Express credentials

## Performance Optimization

### Production Optimizations
- Frontend is built with production optimizations
- Nginx serves static files efficiently
- Gzip compression is enabled
- Security headers are configured

### Scaling
To scale services horizontally:
```bash
docker-compose up --scale backend=3
```

## Backup and Restore

### Backup Database
```bash
docker-compose exec mongodb mongodump --host localhost --db flooweur_blog --out /data/backup
```

### Restore Database
```bash
docker-compose exec mongodb mongorestore --host localhost --db flooweur_blog /data/backup/flooweur_blog
```
