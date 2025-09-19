# Flooweur Blog

A modern, minimalist personal blog built with React, TypeScript, and MongoDB.

## Features

- **Modern React Frontend** with TypeScript
- **MongoDB Backend** with Docker containerization
- **Dark/Light Mode** with smooth transitions
- **Markdown Editor** with clean interface
- **Article Management** with tag system
- **Article Preview** modal
- **Search and Filter** capabilities
- **Responsive Design** for all devices
- **Tag Management** with dropdown selection

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB with Docker

```bash
# Start MongoDB container
docker compose up -d

# Check if containers are running
docker compose ps
```

This will start:
- MongoDB on `localhost:8081`
- Mongo Express (web UI) on `localhost:8082`

### 3. Start the Development Server

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
npm run server  # Backend only
npm start        # Frontend only
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Mongo Express: `http://localhost:8082`

### 4. Access Mongo Express

- URL: `http://localhost:8082`
- Username: `admin`
- Password: `admin123`

## Usage

### Creating Articles

1. Click the search button (circle icon) at the top center
2. Click "New Article" to create a new article
3. Fill in the title and content (markdown)
4. Select tags from the dropdown and click "Add Tag"
5. Click "Save" to save to MongoDB

### Managing Articles

- **Preview**: Click on article cards to preview
- **Edit**: Click the edit icon on article cards
- **Search**: Use the search bar to find articles
- **Filter**: Filter by tags using the dropdown

### Managing Tags

- Tags are automatically created when you add them to articles
- Use the tag dropdown in the article editor to select existing tags
- Tags are shared across all articles

## API Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/articles/search/:query` - Search articles
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `DELETE /api/tags/:id` - Delete tag

## Project Structure

```
src/
├── components/          # React components
│   ├── ArticleEditor.tsx
│   ├── ArticlePreview.tsx
│   ├── GlobalSearchButton.tsx
│   ├── PresentationPage.tsx
│   └── SearchPopup.tsx
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── services/           # API services
│   └── api.ts
├── styles/             # Global styles
│   └── GlobalStyles.ts
├── types/              # TypeScript types
│   └── Article.ts
├── utils/              # Utility functions
│   ├── jsonStorage.ts
│   └── pdfExport.ts
└── App.tsx             # Main app component
```

## Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=mongodb://admin:password123@localhost:8081/flooweur_blog?authSource=admin
PORT=3001
```

## Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# Restart services
docker compose restart
```

## Development

The application uses:
- **React 18** with TypeScript
- **Styled Components** for styling
- **React Markdown** for markdown rendering
- **Express.js** for backend API
- **MongoDB** with Mongoose ODM

## Troubleshooting

### MongoDB Connection Issues

1. Ensure Docker is running
2. Check if MongoDB container is up: `docker compose ps`
3. Verify connection string in `.env` file
4. Check MongoDB logs: `docker compose logs mongodb`

### API Connection Issues

1. Ensure backend server is running on port 3001
2. Check if MongoDB is accessible on port 8081
3. Verify CORS settings in server.js

### Frontend Issues

1. Clear browser cache
2. Check browser console for errors
3. Ensure all dependencies are installed: `npm install`