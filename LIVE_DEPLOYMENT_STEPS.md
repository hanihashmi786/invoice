# Live Deployment Steps - Production Ready

## Your Configuration:
- **Frontend URL:** http://amzn-invoice-bucket-project.s3-website.eu-north-1.amazonaws.com/
- **Backend IP:** 13.48.56.41
- **Backend Port:** 8000

## ✅ Code Changes (Already Done):

1. ✅ Frontend `config.js` - API URL set to `http://13.48.56.41:8000`
2. ✅ Backend `settings.py` - ALLOWED_HOSTS includes `13.48.56.41`
3. ✅ CORS settings configured

## 📋 Deployment Steps:

### Step 1: Frontend Build & Deploy (S3)

1. **Frontend folder mein jao:**
```bash
cd frontend
```

2. **Build karo:**
```bash
npm run build
```

3. **Build folder ki sabhi files S3 bucket mein upload karo:**
   - `build` folder ki sabhi files select karo
   - S3 bucket `amzn-invoice-bucket-project` mein upload karo
   - Static website hosting enable karo (agar nahi hai to)

### Step 2: Backend Setup (EC2)

1. **EC2 instance par SSH karo:**
```bash
ssh -i your-key.pem ubuntu@13.48.56.41
```

2. **Backend folder mein jao:**
```bash
cd ~/backend
# ya jahan bhi backend code hai
```

3. **Dependencies install karo (agar nahi kiye to):**
```bash
pip install -r requirements.txt
```

4. **Database migrations run karo:**
```bash
python manage.py migrate
```

5. **Django server ko run karo:**
```bash
python manage.py runserver 0.0.0.0:8000
```

**Ya production ke liye Gunicorn use karo:**
```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Step 3: EC2 Security Group

AWS Console mein:
1. EC2 → Instances → Your Instance
2. Security tab → Security Groups
3. Inbound Rules → Edit
4. Add Rule:
   - Type: Custom TCP
   - Port: 8000
   - Source: 0.0.0.0/0 (ya specific IP)
   - Save

### Step 4: Testing

1. **Frontend test:**
   - Browser mein kholo: http://amzn-invoice-bucket-project.s3-website.eu-north-1.amazonaws.com/
   - Browser Console (F12) kholo
   - Network tab check karo

2. **Backend test:**
   - Browser mein kholo: http://13.48.56.41:8000/api/projects/
   - Response check karo

3. **API Connection test:**
   - Frontend se login try karo
   - Dashboard data load ho raha hai ya nahi check karo

## 🔧 Troubleshooting:

### Issue: CORS Error
**Solution:** Backend mein `CORS_ALLOW_ALL_ORIGINS = True` already hai. Agar phir bhi error aaye to:
```python
CORS_ALLOWED_ORIGINS = [
    "http://amzn-invoice-bucket-project.s3-website.eu-north-1.amazonaws.com",
]
```

### Issue: Connection Refused
**Check:**
1. EC2 Security Group mein port 8000 open hai?
2. Django server `0.0.0.0:8000` par run ho raha hai?
3. EC2 firewall rules?

### Issue: 404 Not Found
**Check:**
1. Backend URLs sahi hain? (`/api/projects/`, `/api/invoices/`)
2. Django server running hai?
3. EC2 logs check karo

## 🚀 Production Best Practices:

1. **HTTPS Setup:** EC2 par Nginx + SSL certificate
2. **Gunicorn:** Production mein `runserver` ki jagah Gunicorn
3. **Supervisor/Systemd:** Server auto-start ke liye
4. **Environment Variables:** Sensitive data ke liye `.env` file

## 📝 Quick Commands:

```bash
# Frontend Build
cd frontend && npm run build

# Backend Run (Development)
cd backend && python manage.py runserver 0.0.0.0:8000

# Backend Run (Production)
cd backend && gunicorn backend.wsgi:application --bind 0.0.0.0:8000

# Check if port is open
curl http://13.48.56.41:8000/api/projects/
```

## ✅ Final Checklist:

- [ ] Frontend build ho chuka hai
- [ ] Build files S3 par upload ho chuki hain
- [ ] Backend dependencies install ho chuki hain
- [ ] Database migrations run ho chuki hain
- [ ] Django server `0.0.0.0:8000` par run ho raha hai
- [ ] EC2 Security Group mein port 8000 open hai
- [ ] Frontend website load ho raha hai
- [ ] API calls successful ho rahi hain
- [ ] Login functionality kaam kar raha hai

