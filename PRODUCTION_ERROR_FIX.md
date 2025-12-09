# Production Error Fix - "Failed to fetch"

## Problem:
Frontend production mein error aa raha hai: "Connection error: Failed to fetch. Make sure the backend server is running on http://localhost:8000"

## Root Causes:

### 1. Frontend Build Nahi Hua (Most Likely)
- Purana build S3 par hai jo `localhost:8000` use kar raha hai
- Naya build with `16.171.199.158:8000` nahi hua

### 2. Backend Server Nahi Chal Raha
- EC2 par Django/Gunicorn server running nahi hai

### 3. CORS Issues
- Backend CORS settings sahi nahi hain

### 4. Security Group
- EC2 Security Group mein port 8000 open nahi hai

## Solutions:

### Solution 1: Frontend Rebuild (ZAROORI)

```bash
cd frontend
npm run build
```

Phir `build` folder ki sabhi files S3 bucket mein upload karo (purani files replace karo).

### Solution 2: Backend Server Check

EC2 par check karo:
```bash
# Server running hai ya nahi
curl http://localhost:8000/api/projects/

# Ya browser mein
http://16.171.199.158:8000/api/projects/
```

Agar nahi chal raha to:
```bash
cd ~/invoicing-system/backend
python manage.py runserver 0.0.0.0:8000
```

### Solution 3: CORS Check

Backend `settings.py` mein:
```python
CORS_ALLOW_ALL_ORIGINS = True  # Already hai
```

Agar phir bhi issue ho to:
```python
CORS_ALLOWED_ORIGINS = [
    "http://amzn-invoice-bucket-project.s3-website.eu-north-1.amazonaws.com",
]
```

### Solution 4: Security Group

AWS Console:
1. EC2 → Security Groups
2. Inbound Rules → Port 8000 open karo
3. Source: 0.0.0.0/0

### Solution 5: Browser Console Check

1. Browser Console (F12) kholo
2. Network tab check karo
3. API calls dekhlo - kahan fail ho rahi hain
4. Error details check karo

## Quick Debugging Steps:

1. **Frontend URL check:**
   - Browser console mein: `console.log(API_BASE_URL)`
   - Ya Network tab mein API call ka URL dekhlo

2. **Backend test:**
   ```bash
   curl http://16.171.199.158:8000/api/projects/
   ```

3. **CORS test:**
   - Browser console mein CORS error dikhega agar issue hai

4. **Network test:**
   - Browser Network tab → Failed requests check karo

## Most Common Issue:

**Frontend rebuild nahi hua** - Yeh 90% cases mein problem hoti hai.

Frontend rebuild karo aur S3 par upload karo, phir test karo.

