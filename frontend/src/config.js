// API Configuration
// Production mein yeh EC2 instance ka URL hoga
// Development mein localhost use hoga

// Production API URL: http://16.171.199.158:8000
// Development: http://localhost:8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://16.171.199.158:8000';

export default API_BASE_URL;

