# Frontend Setup for Production

## Environment Variable Setup

Frontend ko production mein deploy karne ke liye:

1. Frontend folder mein `.env` file banao:
```
REACT_APP_API_URL=http://your-ec2-ip:8000
```

Ya agar domain hai:
```
REACT_APP_API_URL=https://your-ec2-domain.com
```

2. Frontend rebuild karo:
```bash
npm run build
```

3. `build` folder ko S3 par upload karo.

## Development

Development mein automatically `http://localhost:8000` use hoga.

