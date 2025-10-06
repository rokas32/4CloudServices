// index.js

const express = require('express');
const { ParseServer } = require('parse-server');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for easier client-side access

// 1. Parse Server Configuration
const api = new ParseServer({
    // Critical environment variables provided by Back4app
    databaseURI: process.env.DATABASE_URI, 
    appId: process.env.APP_ID, 
    masterKey: process.env.MASTER_KEY, 
    serverURL: process.env.SERVER_URL || 'http://localhost:8080/parse',
    
    // Links to your existing Cloud Code file
    cloud: path.join(__dirname, 'cloud/main.js'),
    
    // Links to your Web Hosting content
    publicServerURL: process.env.SERVER_URL || 'http://localhost:8080',
});

// 2. Serve the Parse API endpoint (e.g., /parse)
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api.app);

// 3. Serve the Web Hosting (static files from the 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Start the Server
const port = process.env.PORT || 8080;
const host = '0.0.0.0'; // Essential for Docker containers
app.listen(port, host, () => {
    console.log(`Server running on port ${port} with Parse API at ${mountPath}`);
});
