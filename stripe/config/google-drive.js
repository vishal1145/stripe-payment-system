// import { google } from 'googleapis';

// const getDriveClient = async () => {
//     try {
//         // Create a new JWT client using the service account credentials
//         const auth = new google.auth.GoogleAuth({
//             credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
//             scopes: ['https://www.googleapis.com/auth/drive.file']
//         });

//         // Create the drive client
//         const drive = google.drive({ version: 'v3', auth });
//         return drive;
//     } catch (error) {
//         console.error('Error creating Google Drive client:', error);
//         throw new Error('Failed to initialize Google Drive client');
//     }
// };

// export { getDriveClient };



import { google } from 'googleapis'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Reconstruct __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_PATH = path.join(__dirname, 'token.json');
console.log("********token");
console.log(TOKEN_PATH);
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

async function authorize() {
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    if (fs.existsSync(TOKEN_PATH)) {
        let token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
        oAuth2Client.setCredentials(token);
        // Automatically refresh token and save updated credentials
        oAuth2Client.on('tokens', (newTokens) => {
            const updatedToken = { ...token, ...newTokens };
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedToken, null, 2));
        });
        // Trigger token refresh if needed
        try {
            await oAuth2Client.getAccessToken(); // This will trigger the refresh if expired
        } catch (err) {
            throw new Error(":x: Failed to refresh token: " + err.message);
        }
        return oAuth2Client;
    } else {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: SCOPES,
        });
        throw new Error(`:key: Authorize this app by visiting this URL:\n${authUrl}`);
    }
  }


export const handleCallback = async (req, res) => {
    const code = req.query.code;
    console.log(code);
    try {
        // Exchange authorization code for an access token
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save the token to disk for future use
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

        res.send('Authorization successful! Token has been saved.');
    } catch (err) {
        res.status(400).send('Error retrieving access token: ' + err.message);
    }
}



export const getDriveClient = async () => {
    const auth = await authorize();
    return google.drive({ version: 'v3', auth });
};