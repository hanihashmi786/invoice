// API Configuration
// Development default: localhost
// Production: REACT_APP_API_URL env variable set karein (e.g., http://13.60.204.193:8000)

const API_BASE_URL =
  process.env.REACT_APP_API_URL?.trim() ||
  'http://13.60.204.193:8000';

export default API_BASE_URL;

