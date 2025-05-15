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
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;


async function authorize() {
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } else {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        throw new Error(`Authorize this app by visiting this URL: ${authUrl}`);
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