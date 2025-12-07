# EC2 Connection Timeout Fix

## Error: `connect ETIMEDOUT 16.171.199.158:8000`

Yeh error ka matlab hai ki:
1. Backend server running nahi hai, YA
2. EC2 Security Group mein port 8000 open nahi hai, YA
3. Django server sahi tarah bind nahi hua

## Step-by-Step Fix:

### Step 1: EC2 Par SSH Karke Check Karo

```bash
ssh -i your-key.pem ubuntu@16.171.199.158
```

### Step 2: Backend Server Running Hai Ya Nahi Check Karo

```bash
# Port 8000 par koi process chal raha hai?
sudo lsof -i :8000

# Ya
sudo netstat -tulpn | grep 8000

# Ya
ps aux | grep python
```

**Agar kuch nahi dikha to server running nahi hai!**

### Step 3: Backend Server Start Karo

```bash
cd ~/invoicing-system/backend

# Virtual environment activate karo (agar hai to)
source venv/bin/activate

# Dependencies check karo
pip install -r requirements.txt

# Database migrations
python manage.py migrate

# Server start karo (0.0.0.0 par bind karo - IMPORTANT!)
python manage.py runserver 0.0.0.0:8000
```

**Important:** `0.0.0.0:8000` use karo, sirf `localhost:8000` nahi!

### Step 4: EC2 Par Locally Test Karo

EC2 par hi terminal mein:
```bash
curl http://localhost:8000/api/projects/
```

Agar yeh kaam kare to server running hai.

### Step 5: EC2 Security Group Check Karo

AWS Console mein:

1. **EC2 Dashboard** → **Instances**
2. Apni instance select karo (16.171.199.158)
3. **Security** tab → **Security groups** click karo
4. Security group open karo
5. **Inbound rules** tab check karo

**Agar port 8000 nahi hai to add karo:**
- **Type:** Custom TCP
- **Port:** 8000
- **Source:** 0.0.0.0/0 (ya specific IP)
- **Description:** Django Backend
- **Save rules**

### Step 6: EC2 Firewall Check Karo

EC2 par:
```bash
# UFW firewall status
sudo ufw status

# Agar active hai to port 8000 allow karo
sudo ufw allow 8000/tcp
sudo ufw reload
```

### Step 7: External Test Karo

Apne local machine se (Postman ya browser se):
```bash
curl http://16.171.199.158:8000/api/projects/
```

Ya browser mein:
```
http://16.171.199.158:8000/api/projects/
```

## Common Issues:

### Issue 1: Server `localhost` par bind hai
**Problem:** `python manage.py runserver` (without 0.0.0.0)
**Solution:** `python manage.py runserver 0.0.0.0:8000`

### Issue 2: Security Group mein port nahi hai
**Problem:** Port 8000 blocked hai
**Solution:** Security Group mein port 8000 add karo

### Issue 3: Firewall block kar raha hai
**Problem:** UFW ya iptables block kar raha hai
**Solution:** `sudo ufw allow 8000/tcp`

### Issue 4: Server crash ho gaya
**Problem:** Server start hua lekin crash ho gaya
**Solution:** Logs check karo aur error fix karo

## Production Setup (Gunicorn + Nginx):

Agar simple `runserver` se kaam nahi chal raha to Gunicorn use karo:

```bash
cd ~/invoicing-system/backend
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## Quick Checklist:

- [ ] EC2 par SSH ho sakte ho?
- [ ] Backend code EC2 par hai?
- [ ] Dependencies install ho chuki hain?
- [ ] Database migrations run ho chuki hain?
- [ ] Server `0.0.0.0:8000` par start hua?
- [ ] EC2 par locally test kiya (`curl localhost:8000`)?
- [ ] Security Group mein port 8000 open hai?
- [ ] Firewall allow kar raha hai?
- [ ] External se test kiya (Postman/browser)?

## Debugging Commands:

```bash
# Server status
sudo systemctl status invoice_backend  # Agar Gunicorn use kar rahe ho

# Logs check
tail -f /var/log/gunicorn/error.log  # Gunicorn logs
# Ya Django console output

# Port check
sudo lsof -i :8000
sudo netstat -tulpn | grep 8000

# Process check
ps aux | grep python
ps aux | grep gunicorn

# Network test
curl http://localhost:8000/api/projects/
curl http://127.0.0.1:8000/api/projects/
```

## Most Likely Issue:

**90% chance:** Security Group mein port 8000 open nahi hai!

AWS Console → EC2 → Security Groups → Inbound Rules → Port 8000 add karo!

