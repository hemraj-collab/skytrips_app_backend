# Render Deployment Guide for NestJS Backend

## Render Configuration

### Build Command

Use this in Render dashboard:

```
yarn install && yarn build
```

**Do NOT use** `--frozen-lockfile` flag as it's too strict for cloud deployments.

### Start Command

```
yarn start:prod
```

### Environment Variables

Add these in Render Dashboard → Environment:

| Key                 | Value                       |
| ------------------- | --------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL   |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `NODE_ENV`          | `production`                |
| `APP_PORT`          | `8080`                      |

**Important**: Render automatically provides a `PORT` environment variable. Update your main.ts to use it.

## Steps to Deploy

### 1. Update yarn.lock

Already done! The yarn.lock file has been updated. Commit it:

```bash
git add yarn.lock package.json
git commit -m "Update dependencies for Render deployment"
git push origin master
```

### 2. Create Web Service on Render

1. Go to https://render.com/
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `skytrips-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Runtime**: `Node`
   - **Build Command**: `yarn install && yarn build`
   - **Start Command**: `yarn start:prod`
   - **Instance Type**: Free (or paid for better performance)

### 3. Add Environment Variables

In Render dashboard:

- Click **Environment** tab
- Add all variables from table above
- Click **Save Changes**

### 4. Deploy

Render will automatically deploy when you push to master.

## Troubleshooting

### Error: "tsc-alias: not found"

**Fixed!** The build command now installs dependencies first.

### Error: "Lockfile needs to be updated"

**Fixed!** Committed the updated yarn.lock file.

### Error: "Port already in use"

Update your main.ts to use `process.env.PORT` provided by Render:

```typescript
const port = process.env.PORT || process.env.APP_PORT || 8080;
```

### Build takes too long

Consider moving `@nestjs/cli` to dependencies if build fails:

```bash
yarn add @nestjs/cli
```

## Alternative Build Commands

If you still have issues, try:

**Option 1: Simpler (without tsc-alias)**

```
yarn install
```

Build Command in Render: `yarn build`
And update package.json build script to just: `"build": "nest build"`

**Option 2: With explicit path resolution**
Keep current setup but ensure tsc-alias is installed before build runs.

## Verification

After deployment, test your API:

```bash
curl https://your-app.onrender.com/customer
```

## Free Tier Limitations

Render's free tier:

- ✅ 750 hours/month free
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds

For production, consider upgrading to a paid instance.
