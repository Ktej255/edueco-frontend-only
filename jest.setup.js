// jest.setup.js
import "@testing-library/jest-dom";

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";
process.env.NEXT_PUBLIC_ENVIRONMENT = "test";
