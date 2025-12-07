#!/bin/bash
# Quick setup script for Gunicorn and Nginx
# EC2 par run karo: bash quick_setup.sh

echo "=== Gunicorn aur Nginx Setup ==="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Gunicorn install
echo -e "${YELLOW}Step 1: Gunicorn install kar raha hoon...${NC}"
cd ~/invoicing-system/backend
pip install gunicorn

# Step 2: Log directories
echo -e "${YELLOW}Step 2: Log directories bana raha hoon...${NC}"
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo chown $USER:$USER /var/log/gunicorn
sudo chown $USER:$USER /var/run/gunicorn

# Step 3: Nginx install
echo -e "${YELLOW}Step 3: Nginx install kar raha hoon...${NC}"
sudo apt update
sudo apt install nginx -y

# Step 4: Service file copy
echo -e "${YELLOW}Step 4: Systemd service setup kar raha hoon...${NC}"
sudo cp ~/invoicing-system/backend/gunicorn.service /etc/systemd/system/invoice_backend.service

# Step 5: Nginx config copy
echo -e "${YELLOW}Step 5: Nginx config setup kar raha hoon...${NC}"
sudo cp ~/invoicing-system/backend/nginx.conf /etc/nginx/sites-available/invoice_backend
sudo ln -sf /etc/nginx/sites-available/invoice_backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Step 6: Nginx config test
echo -e "${YELLOW}Step 6: Nginx config test kar raha hoon...${NC}"
sudo nginx -t

# Step 7: Enable services
echo -e "${YELLOW}Step 7: Services enable kar raha hoon...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable invoice_backend
sudo systemctl enable nginx

# Step 8: Start services
echo -e "${YELLOW}Step 8: Services start kar raha hoon...${NC}"
sudo systemctl start invoice_backend
sudo systemctl start nginx

# Step 9: Firewall
echo -e "${YELLOW}Step 9: Firewall setup kar raha hoon...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw --force enable

# Step 10: Status check
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${YELLOW}Service status check kar raha hoon...${NC}"
sudo systemctl status invoice_backend --no-pager
sudo systemctl status nginx --no-pager

echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo "Ab test karo: curl http://16.171.199.158/api/projects/"

