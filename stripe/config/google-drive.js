import { google } from 'googleapis';

const getDriveClient = async () => {
    try {
        // Create a new JWT client using the service account credentials
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });

        // Create the drive client
        const drive = google.drive({ version: 'v3', auth });
        return drive;
    } catch (error) {
        console.error('Error creating Google Drive client:', error);
        throw new Error('Failed to initialize Google Drive client');
    }
};

export { getDriveClient }; 