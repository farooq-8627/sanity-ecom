# Setting Up Reel Likes Functionality

The error you're seeing (`Failed to update like status. Your token may be read-only.`) occurs because the application needs a Sanity API token with **write permissions** to update the likes count in your Sanity database.

## How to Fix the Issue

### Step 1: Create a Sanity API Token with Write Permissions

1. Go to your [Sanity project dashboard](https://www.sanity.io/manage)
2. Select your project
3. Navigate to API > Tokens
4. Click "Add API token"
5. Name it something like "Reel Likes Token"
6. **Important**: Select "Editor" permissions (not "Viewer" which is read-only)
7. Copy the generated token

### Step 2: Add the Token to Your Environment

#### Option 1: Using the Setup Script (Recommended)

1. Run the setup script:
   ```bash
   node setup-env.js
   ```
2. Paste your Sanity API token when prompted
3. Restart your development server:
   ```bash
   npm run dev
   ```

#### Option 2: Manual Setup

1. Open or create the `.env.local` file in the root of your project
2. Add the following line:
   ```
   SANITY_API_TOKEN=your_token_here
   ```
   Replace `your_token_here` with the token you copied
3. Save the file
4. Restart your development server:
   ```bash
   npm run dev
   ```

## Common Issues

### "Your token may be read-only"

If you're seeing this error, it means:

1. You have a token set, but it only has "Viewer" permissions
2. Go back to the Sanity dashboard and check your token's permissions
3. Create a new token with "Editor" permissions if needed

### "Server is not configured properly"

This means:

1. No token is set in your environment variables
2. Follow the steps above to add a token

## Verifying It Works

After setting up the token:

1. Open the reels page
2. Sign in to your account
3. Try liking a reel
4. You should see a success message and the likes count should update

## Troubleshooting

If you're still having issues:

1. Make sure the token has the correct permissions (Editor, not just Viewer)
2. Check that the token is correctly added to the `.env.local` file
3. Verify that you've restarted the development server after adding the token
4. Check the browser console for any error messages

If problems persist, you may need to check your Sanity project settings or contact support. 