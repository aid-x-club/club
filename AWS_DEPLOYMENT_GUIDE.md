# AWS Deployment Guide for AID-X Club

This guide will walk you through deploying the full-stack AID-X Club application to AWS.

## Architecture Overview

- **Frontend (React + Vite):** AWS Amplify
- **Backend (Express.js API):** AWS Elastic Beanstalk
- **Database:** MongoDB Atlas (free tier available)
- **Static Assets:** AWS S3

---

## Prerequisites;

1. **AWS Account** - Create one at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** - Install from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **MongoDB Atlas Account** - Create at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **GitHub Repository** - Your code should be in a GitHub repo

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a new **FREE** M0 cluster
4. Choose AWS as cloud provider
5. Select nearest region (e.g., Mumbai/Singapore)
6. Name your cluster (e.g., `aidx-club-prod`)

### Step 2: Configure Database Access

1. In Atlas Dashboard → **Database Access**
2. Add a new database user:
   - Username: `aidx-admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: **Read and write to any database**

### Step 3: Configure Network Access

1. In Atlas Dashboard → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to your AWS region IPs later

### Step 4: Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://aidx-admin:<password>@aidx-club-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://aidx-admin:<password>@aidx-club-prod.xxxxx.mongodb.net/aidx-club?retryWrites=true&w=majority`

---

## Part 2: Backend Deployment (AWS Elastic Beanstalk)

### Step 1: Prepare Backend for Deployment

1. Install EB CLI:
```powershell
pip install awsebcli
```

2. Navigate to backend directory:
```powershell
cd backend
```

### Step 2: Initialize Elastic Beanstalk

3. Initialize EB application:
```powershell
eb init -p node.js aidx-club-backend --region us-east-1
```
   - Select your AWS region
   - Configure AWS credentials when prompted

### Step 3: Create Environment

4. Create production environment:
```powershell
eb create aidx-club-prod-env --single
```

### Step 4: Configure Environment Variables

5. Set environment variables (replace with your actual values):
```powershell
eb setenv MONGODB_URI="your-mongodb-atlas-connection-string"
eb setenv JWT_SECRET="your-jwt-secret-key"
eb setenv NODE_ENV="production"
eb setenv FRONTEND_URL="https://your-frontend-domain.com"
eb setenv PORT="8080"
```

Add all your environment variables from `.env` file:
```powershell
eb setenv GITHUB_CLIENT_ID="your-github-client-id"
eb setenv GITHUB_CLIENT_SECRET="your-github-client-secret"
eb setenv FIREBASE_API_KEY="your-firebase-key"
```

### Step 5: Deploy Backend

6. Deploy your backend:
```powershell
eb deploy
```

7. Get your backend URL:
```powershell
eb status
```
   - Note the CNAME/URL (e.g., `aidx-club-prod-env.eba-xxxxx.us-east-1.elasticbeanstalk.com`)

8. Open your backend in browser:
```powershell
eb open
```
   - Test health endpoint: `https://your-backend-url/api/health`

---

## Part 3: Frontend Deployment (AWS Amplify)

### Option A: Deploy via AWS Amplify Console (Recommended)

1. **Prepare Frontend:**
   - Update `.env` or create `.env.production` with backend URL:
     ```env
     VITE_API_URL=https://your-backend-url.elasticbeanstalk.com
     ```

2. **Push to GitHub:**
   - Ensure your code is pushed to GitHub
   - Make sure `.env` is in `.gitignore`

3. **AWS Amplify Console:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click **New app** → **Host web app**
   - Connect your GitHub repository
   - Select repository and branch (usually `main`)

4. **Configure Build Settings:**
   - Amplify should auto-detect React/Vite
   - Verify `amplify.yml` build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

5. **Add Environment Variables:**
   - In Amplify Console → App Settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.elasticbeanstalk.com`
   - Add all other `VITE_` prefixed variables

6. **Deploy:**
   - Click **Save and Deploy**
   - Amplify will build and deploy automatically
   - You'll get a URL like: `https://main.xxxxx.amplifyapp.com`

7. **Custom Domain (Optional):**
   - In Amplify Console → Domain management
   - Add your custom domain (e.g., `aidx-club.tech`)
   - Follow DNS configuration instructions

### Option B: Deploy via S3 + CloudFront (Manual)

If you prefer manual control:

1. **Build Frontend:**
```powershell
cd ..
npm run build
```

2. **Create S3 Bucket:**
   - Go to S3 Console
   - Create bucket: `aidx-club-frontend`
   - Enable static website hosting
   - Upload `dist/` folder contents

3. **Create CloudFront Distribution:**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set custom domain

---

## Part 4: Post-Deployment Configuration

### Update CORS Settings

1. Update backend CORS to include your frontend domain:
   - Edit `backend/server.js`
   - Add your Amplify URL to `allowedOrigins`
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',
     'https://main.xxxxx.amplifyapp.com',  // Add this
     'https://aidx-club.tech',  // Add custom domain
     process.env.FRONTEND_URL
   ].filter(Boolean);
   ```

2. Redeploy backend:
```powershell
cd backend
eb deploy
```

### Seed Database (Optional)

If you need to populate initial data:

```powershell
cd backend
node seedData.js
```

Or create admin user:
```powershell
node createAdmin.js
```

### Update OAuth Redirect URIs

Update your GitHub OAuth app settings:
- Add callback URL: `https://your-frontend-url/auth/callback`
- Same for Firebase/Google OAuth

---

## Part 5: Monitoring & Maintenance

### Monitor Backend

1. **View Logs:**
```powershell
cd backend
eb logs
```

2. **Check Health:**
```powershell
eb health
```

3. **View Metrics:**
   - Go to Elastic Beanstalk Console
   - Check CloudWatch metrics

### Monitor Frontend

1. **Amplify Console:**
   - View build logs
   - Monitor traffic
   - Check errors

### Update Application

**Backend:**
```powershell
cd backend
eb deploy
```

**Frontend:**
- Just push to GitHub
- Amplify auto-deploys on push

---

## Cost Estimation

### Free Tier (First 12 Months)
- **Elastic Beanstalk:** Free (you pay for underlying EC2)
- **EC2 t2.micro:** 750 hours/month free
- **MongoDB Atlas:** M0 cluster free forever
- **Amplify:** 1000 build minutes + 15GB hosting free
- **S3:** 5GB storage free

### After Free Tier (~$10-20/month)
- EC2 t2.micro: ~$8/month
- Amplify: ~$0-5/month (depending on traffic)
- Data transfer: ~$2/month
- MongoDB Atlas: Free M0 or ~$9/month for M10

---

## Troubleshooting

### Backend Issues

1. **503 Errors:**
   - Check environment variables are set
   - Check MongoDB connection string
   - View logs: `eb logs`

2. **CORS Errors:**
   - Verify frontend URL in CORS settings
   - Redeploy backend

### Frontend Issues

1. **API Connection Failed:**
   - Check `VITE_API_URL` environment variable
   - Verify backend is running
   - Check CORS configuration

2. **Build Failures:**
   - Check build logs in Amplify Console
   - Verify all dependencies are in `package.json`
   - Check Node version compatibility

---

## Custom Domain Setup

### For Backend (Optional)

1. **Route 53:**
   - Create hosted zone for your domain
   - Add CNAME record pointing to EB URL

### For Frontend

1. **In Amplify Console:**
   - Domain management
   - Add custom domain
   - Follow DNS verification steps

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use AWS Secrets Manager for sensitive data

2. **Database:**
   - Restrict MongoDB Atlas IP whitelist to AWS IPs
   - Use strong passwords
   - Enable database encryption

3. **HTTPS:**
   - Amplify provides free SSL
   - Enable HTTPS only in production

4. **API Security:**
   - Implement rate limiting
   - Use helmet.js (already included)
   - Keep dependencies updated

---

## Useful Commands

### Backend (Elastic Beanstalk)

```powershell
eb status                    # Check environment status
eb health                    # Check health
eb logs                      # View logs
eb deploy                    # Deploy application
eb open                      # Open app in browser
eb ssh                       # SSH into instance
eb printenv                  # View environment variables
eb terminate                 # Delete environment
```

### AWS CLI

```powershell
aws configure               # Configure AWS credentials
aws s3 ls                   # List S3 buckets
aws elasticbeanstalk describe-environments  # List EB environments
```

---

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Elastic Beanstalk
3. ✅ Deploy frontend to Amplify
4. ✅ Configure environment variables
5. ✅ Update CORS settings
6. ✅ Test application
7. ✅ Set up custom domain (optional)
8. ✅ Configure monitoring

---

**Good luck with your deployment! 🚀**
