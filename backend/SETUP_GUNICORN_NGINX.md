# Gunicorn aur Nginx Setup Guide - EC2 Par

## Prerequisites
- EC2 instance running (16.171.199.158)
- Django backend code deployed
- Python aur pip installed
- Nginx installed

## Step 1: Gunicorn Install Karein

```bash
# Virtual environment activate karo (agar hai to)
cd ~/invoicing-system/backend
source venv/bin/activate  # ya python3 -m venv venv (agar nahi hai)

# Gunicorn install karo
pip install gunicorn
```

## Step 2: Gunicorn Configuration

1. **gunicorn_config.py file ko backend folder mein copy karo**

2. **Log directories banao:**
```bash
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo chown ubuntu:ubuntu /var/log/gunicorn
sudo chown ubuntu:ubuntu /var/run/gunicorn
```

3. **Test karo (manually):**
```bash
cd ~/invoicing-system/backend
gunicorn --config gunicorn_config.py backend.wsgi:application
```

Agar kaam kare to Ctrl+C se stop karo.

## Step 3: Systemd Service Setup (Auto-start ke liye)

1. **Service file copy karo:**
```bash
sudo cp ~/invoicing-system/backend/gunicorn.service /etc/systemd/system/invoice_backend.service
```

2. **Service file edit karo (paths check karo):**
```bash
sudo nano /etc/systemd/system/invoice_backend.service
```

**Important:** Apne actual paths update karo:
- `WorkingDirectory`: Backend folder ka full path
- `ExecStart`: Gunicorn ka full path
- `User` aur `Group`: Apna username (usually `ubuntu`)

3. **Service enable aur start karo:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable invoice_backend
sudo systemctl start invoice_backend
sudo systemctl status invoice_backend
```

4. **Service commands:**
```bash
# Service start
sudo systemctl start invoice_backend

# Service stop
sudo systemctl stop invoice_backend

# Service restart
sudo systemctl restart invoice_backend

# Service status
sudo systemctl status invoice_backend

# Logs dekhne ke liye
sudo journalctl -u invoice_backend -f
```

## Step 4: Nginx Install Karein

```bash
sudo apt update
sudo apt install nginx -y
```

## Step 5: Nginx Configuration

1. **Nginx config file copy karo:**
```bash
sudo cp ~/invoicing-system/backend/nginx.conf /etc/nginx/sites-available/invoice_backend
```

2. **Config file edit karo:**
```bash
sudo nano /etc/nginx/sites-available/invoice_backend
```

**Important settings update karo:**
- `server_name`: Apna domain/IP (16.171.199.158)
- `alias` paths: Static files ka actual path
- `upstream`: Gunicorn port (8000)

3. **Site enable karo:**
```bash
sudo ln -s /etc/nginx/sites-available/invoice_backend /etc/nginx/sites-enabled/
```

4. **Default site disable karo (optional):**
```bash
sudo rm /etc/nginx/sites-enabled/default
```

5. **Nginx config test karo:**
```bash
sudo nginx -t
```

6. **Nginx restart karo:**
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

## Step 6: Firewall Setup

```bash
# UFW firewall enable karo
sudo ufw allow 'Nginx Full'
sudo ufw allow 22  # SSH
sudo ufw enable
sudo ufw status
```

## Step 7: Django Static Files Collect Karein

```bash
cd ~/invoicing-system/backend
python manage.py collectstatic --noinput
```

## Step 8: Testing

1. **Gunicorn test:**
```bash
curl http://localhost:8000/api/projects/
```

2. **Nginx test:**
```bash
curl http://16.171.199.158/api/projects/
```

3. **Browser mein test:**
- http://16.171.199.158/api/projects/
- http://16.171.199.158/health

## Troubleshooting

### Gunicorn start nahi ho raha:
```bash
# Logs check karo
sudo journalctl -u invoice_backend -n 50

# Permissions check karo
ls -la /var/log/gunicorn/
ls -la /var/run/gunicorn/

# Manual test karo
cd ~/invoicing-system/backend
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Nginx 502 Bad Gateway:
```bash
# Gunicorn running hai ya nahi check karo
sudo systemctl status invoice_backend

# Nginx error logs
sudo tail -f /var/log/nginx/invoice_backend_error.log

# Gunicorn logs
sudo tail -f /var/log/gunicorn/error.log
```

### Port already in use:
```bash
# Port 8000 kaun use kar raha hai check karo
sudo lsof -i :8000

# Process kill karo
sudo kill -9 <PID>
```

## Production Best Practices

1. **HTTPS Setup:** Let's Encrypt se SSL certificate
2. **Log Rotation:** Logrotate setup karo
3. **Monitoring:** System monitoring tools use karo
4. **Backup:** Database regular backup karo

## Quick Commands Reference

```bash
# Gunicorn
sudo systemctl start invoice_backend
sudo systemctl stop invoice_backend
sudo systemctl restart invoice_backend
sudo systemctl status invoice_backend

# Nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx
sudo nginx -t

# Logs
sudo journalctl -u invoice_backend -f
sudo tail -f /var/log/nginx/invoice_backend_error.log
sudo tail -f /var/log/gunicorn/error.log
```

## Security Notes

1. **Firewall:** Sirf zaroori ports open karo
2. **SSL:** Production mein HTTPS zaroor use karo
3. **Secrets:** Environment variables use karo, hardcode mat karo
4. **Updates:** Regular security updates karo

