# Gunicorn configuration file
# EC2 par production ke liye

import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "invoice_backend"

# Server mechanics
daemon = False
pidfile = "/var/run/gunicorn/invoice_backend.pid"
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (agar HTTPS chahiye to)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

