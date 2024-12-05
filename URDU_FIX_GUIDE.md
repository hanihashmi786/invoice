# Problem Fix - Frontend aur Backend Connection

## Kya Problem Thi?

1. Frontend code mein `http://localhost:8000` hardcoded tha - yeh production mein kaam nahi karta
2. Backend mein `ALLOWED_HOSTS` empty tha - EC2 domain/IP allow nahi tha

## Kya Fix Kiya?

### 1. Frontend Fixes:
- ✅ `frontend/src/config.js` file banai - API URL ab configurable hai
- ✅ Sabhi API calls update kiye:
  - InvoiceForm.jsx
  - InvoiceHistory.jsx  
  - Dashboard.jsx
  - Login.jsx

### 2. Backend Fixes:
- ✅ `settings.py` mein `ALLOWED_HOSTS` update kiya - ab environment variable se set ho sakta hai

## Ab Kya Karna Hai?

### Step 1: Frontend Setup (S3)

1. **Frontend folder mein `.env` file banao:**
```bash
cd frontend
```

`.env` file mein yeh likho:
```
REACT_APP_API_URL=http://YOUR-EC2-IP:8000
```

**Example:**
```
REACT_APP_API_URL=http://54.123.45.67:8000
```

Ya agar EC2 par domain hai:
```
REACT_APP_API_URL=https://api.yourdomain.com
```

2. **Frontend rebuild karo:**
```bash
npm run build
```

3. **Build folder ko S3 par upload karo:**
   - `build` folder ki sabhi files S3 bucket mein upload karo
   - Static website hosting enable karo

### Step 2: Backend Setup (EC2)

1. **EC2 instance par jao aur settings.py update karo:**

EC2 par SSH karo:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

`settings.py` file kholo:
```bash
nano backend/backend/settings.py
```

`ALLOWED_HOSTS` ko update karo:
```python
ALLOWED_HOSTS = ['your-ec2-ip', 'your-ec2-domain.com']
```

**Example:**
```python
ALLOWED_HOSTS = ['54.123.45.67', 'ec2-54-123-45-67.compute-1.amazonaws.com']
```

Ya environment variable se:
```bash
export ALLOWED_HOSTS=54.123.45.67,your-domain.com
```

2. **Django server ko run karo:**
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

**Important:** `0.0.0.0` use karo taake bahar se access ho sake!

### Step 3: EC2 Security Group

AWS Console mein:
1. EC2 → Security Groups
2. Apne instance ka Security Group select karo
3. Inbound Rules mein add karo:
   - Type: Custom TCP
   - Port: 8000
   - Source: 0.0.0.0/0 (ya sirf S3 bucket ka IP)

### Step 4: Testing

1. Browser mein S3 website kholo
2. Browser Console (F12) kholo
3. Network tab check karo - API calls ho rahi hain ya nahi
4. Agar error aaye to:
   - CORS error: Backend CORS settings check karo
   - Connection refused: Security Group aur Django server check karo
   - 404 error: API endpoints check karo

## Quick Checklist

- [ ] Frontend `.env` file banai aur API URL set kiya
- [ ] Frontend rebuild kiya (`npm run build`)
- [ ] Build folder S3 par upload kiya
- [ ] Backend `ALLOWED_HOSTS` update kiya
- [ ] Django server `0.0.0.0:8000` par run ho raha hai
- [ ] EC2 Security Group mein port 8000 open hai
- [ ] Browser mein test kiya - sab kaam kar raha hai

## Common Issues aur Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:** Backend mein `CORS_ALLOW_ALL_ORIGINS = True` already hai. Agar phir bhi error aaye to:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-s3-bucket.s3.amazonaws.com",
    "https://your-s3-website-url.com"
]
```

### Issue 2: Connection Refused
**Error:** `Failed to fetch` ya `Connection refused`

**Solution:**
1. EC2 Security Group check karo - port 8000 open hai ya nahi
2. Django server `0.0.0.0:8000` par run ho raha hai ya nahi
3. EC2 firewall rules check karo

### Issue 3: 404 Not Found
**Error:** `404 Not Found` API calls par

**Solution:**
1. Backend URLs check karo - `/api/projects/`, `/api/invoices/` etc.
2. Django server running hai ya nahi check karo
3. EC2 par logs check karo

## Production Best Practices

1. **HTTPS Use Karo:** EC2 par Nginx + SSL certificate setup karo
2. **Environment Variables:** Sensitive data ke liye `.env` file use karo
3. **Gunicorn:** Production mein `runserver` ki jagah Gunicorn use karo:
```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

4. **Static Files:** Nginx se serve karo

## Help Chahiye?

Agar phir bhi problem ho to:
1. Browser console mein error check karo
2. EC2 par Django logs check karo
3. Network tab mein API calls check karo

