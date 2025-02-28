# Deploying Task Management System to Hostinger

This guide will walk you through the process of deploying your Task Management System to your Hostinger domain.

## Step 1: Build Your Application

First, you need to create a production build of your application:

```bash
npm run build
```

This will create a `dist` folder containing optimized static files ready for deployment.

## Step 2: Prepare Your Hostinger Account

1. Log in to your Hostinger control panel
2. Navigate to the "Website" section
3. Select your domain
4. Go to "File Manager" or use FTP access

## Step 3: Upload Your Files

### Option 1: Using File Manager

1. Navigate to the public_html directory (or the directory where you want to host your application)
2. Upload all files from your local `dist` folder to this directory
   - You can use the "Upload" button to upload multiple files at once
   - Make sure to maintain the folder structure

### Option 2: Using FTP

1. Use an FTP client like FileZilla
2. Connect to your Hostinger server using the FTP credentials from your hosting panel
3. Navigate to the public_html directory
4. Upload all files from your local `dist` folder to this directory

## Step 4: Configure URL Rewriting

Since your application uses React Router for client-side routing, you need to ensure all routes redirect to index.html:

1. Create a `.htaccess` file in your public_html directory with the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Step 5: Test Your Deployment

1. Visit your domain in a web browser
2. Test all features of your application:
   - User authentication
   - Task creation and management
   - Profile settings
   - Theme switching

## Troubleshooting

### Issue: White screen or application not loading
- Check browser console for errors
- Ensure all files were uploaded correctly
- Verify the .htaccess file is properly configured

### Issue: Images or assets not loading
- Check file paths in your code
- Ensure all asset files were uploaded
- Verify permissions on uploaded files (should be 644 for files, 755 for directories)

### Issue: API calls failing
- This application uses local storage, so there should be no API issues
- If you've modified the app to use external APIs, check CORS settings

## Important Notes

1. **Local Storage**: This application uses browser local storage for data persistence. This means:
   - User data is stored in the browser
   - Data will not be shared between devices
   - Clearing browser data will reset the application

2. **Security Considerations**:
   - Consider implementing HTTPS for your domain
   - In Hostinger, you can enable free SSL certificates through Let's Encrypt

3. **Performance Optimization**:
   - Enable Gzip compression in Hostinger settings
   - Configure browser caching for static assets