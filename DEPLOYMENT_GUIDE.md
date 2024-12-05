# Deployment Guide - AWS S3 aur EC2

## Problem Kya Hai?

Frontend S3 par hai aur Backend EC2 par, lekin dono communicate nahi kar rahe.

## Solutions

### 1. Frontend Configuration (S3)

Frontend mein ab `config.js` file hai jo API URL handle karti hai.

**Production Build ke liye:**

1. `.env` file banao frontend folder mein:
```bash
REACT_APP_API_URL=http://your-ec2-ip-or-domain:8000
```

Ya agar EC2 par domain hai:
```bash
REACT_APP_API_URL=https://your-ec2-domain.com
```

2. Frontend rebuild karo:
```bash
cd frontend
npm run build
```

3. Build folder ko S3 par upload karo.

### 2. Backend Configuration (EC2)

**EC2 Instance par:**

1. `settings.py` mein `ALLOWED_HOSTS` update karo:
```python
ALLOWED_HOSTS = ['your-ec2-ip', 'your-ec2-domain.com']
```

Ya environment variable se:
```bash
export ALLOWED_HOSTS=your-ec2-ip,your-ec2-domain.com
```

2. CORS settings already sahi hain (`CORS_ALLOW_ALL_ORIGINS = True`)

3. Django server ko run karo:
```bash
python manage.py runserver 0.0.0.0:8000
```

**Important:** Security Group mein port 8000 allow karna zaroori hai!

### 3. Security Group Settings (EC2)

EC2 Security Group mein:
- Inbound Rule: Port 8000 (HTTP) - Source: 0.0.0.0/0 (ya sirf S3 bucket ka IP)
- Outbound Rule: All traffic allow

### 4. Testing

1. Browser console mein check karo koi CORS error to nahi
2. Network tab mein API calls check karo
3. EC2 par logs check karo:
```bash
tail -f /var/log/django.log
```

### 5. Common Issues

**Issue:** CORS Error
**Solution:** Backend mein `CORS_ALLOW_ALL_ORIGINS = True` already hai

**Issue:** Connection Refused
**Solution:** 
- EC2 Security Group check karo
- Django server `0.0.0.0:8000` par run ho raha hai ya nahi
- Firewall rules check karo

**Issue:** 404 Not Found
**Solution:** 
- API endpoints sahi hain ya nahi check karo
- Backend URLs check karo

### 6. Production Best Practices

1. **HTTPS Use Karo:** EC2 par Nginx + SSL certificate setup karo
2. **Environment Variables:** Sensitive data ke liye `.env` file use karo
3. **Gunicorn:** Production mein `runserver` ki jagah Gunicorn use karo
4. **Static Files:** Nginx se serve karo

### Quick Checklist

- [ ] Frontend `.env` file mein API URL set hai
- [ ] Frontend rebuild ho chuka hai
- [ ] Backend `ALLOWED_HOSTS` update ho chuka hai
- [ ] EC2 Security Group mein port 8000 open hai
- [ ] Django server `0.0.0.0:8000` par run ho raha hai
- [ ] Browser console mein koi error nahi

