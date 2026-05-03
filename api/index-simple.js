const app = require('../frontend/api/dist/app').default;

// Simple pass-through handler - don't try to manage DB in serverless
module.exports = (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    return app(req, res);
};
