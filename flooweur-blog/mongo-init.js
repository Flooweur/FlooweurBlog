// Initialize the database and create collections
db = db.getSiblingDB('flooweur_blog');

// Create articles collection
db.createCollection('articles');

// Create tags collection
db.createCollection('tags');

// Create indexes for better performance
db.articles.createIndex({ "title": "text", "content": "text" });
db.articles.createIndex({ "tags": 1 });
db.articles.createIndex({ "createdAt": -1 });

db.tags.createIndex({ "name": 1 });

print('Database initialized successfully!');