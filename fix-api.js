const fs = require("fs");
const path = require("path");

const apiContent = `import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

export default api;
`;

const filePath = path.join(__dirname, "src", "lib", "api.ts");

try {
  fs.writeFileSync(filePath, apiContent, "utf8");
  console.log("✅ Successfully fixed src/lib/api.ts");
  console.log("Frontend should rebuild automatically.");
} catch (error) {
  console.error("❌ Error writing file:", error.message);
  process.exit(1);
}
