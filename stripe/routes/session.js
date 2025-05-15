import express from 'express';
import Session from '../models/Session.js';
import Order from '../models/Order.js';
import { getDriveClient } from '../config/google-drive.js';

const router = express.Router();

const getURL = async (body) => {
    const { fileId, emailAddress, role = 'reader' } = body;
    if (!fileId || !emailAddress) {
        throw new Error('fileId and emailAddress are required');
    }
console.log("****************body",body)
    try {
        const drive = await getDriveClient();

        await drive.permissions.create({
            fileId,
            requestBody: {
                role,
                type: 'user',
                emailAddress,
            },
        });

        return { 
            message: `✅ Permission granted to ${emailAddress}`, 
            fileId, 
            role, 
            link: `https://drive.google.com/drive/folders/${fileId}?usp=drive_link
` 
        };
    } catch (err) {
        console.error("Permission Error:", err.message);
        throw new Error('❌ Permission grant failed: ' + err.message);
    }
}

// Session validation and redirect endpoint
router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        // Validate session exists
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).send('Session not found');
        }

        // Check if session is expired
        if (new Date() > new Date(session.expiryDate)) {
            return res.status(403).send('Session has expired');
        }

        // Get order details using orderId from session
        const order = await Order.findById(session.orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Get file URL using order details
        const urlResult = await getURL({
             fileId: order.folderId, 
           // fileId: '1N_3cYGhUB4RiR3RjAYX2BU7sHsM6jiuP',
            emailAddress: order.customerEmail,
            role: 'reader'
        });

        // Redirect to the Google Drive file
        res.redirect(urlResult.link);

    } catch (error) {
        console.error('Error processing session:', error);
        res.status(500).send('Internal server error');
    }
});

export default router; 