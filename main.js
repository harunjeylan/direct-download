const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const port = 8800;

app.get('/download', async (req, res) => {
    const fileUrl = req.query.url;

    if (!fileUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream'
        });

        // Get the filename from the Content-Disposition header or use a default name
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_file';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        // Create a temporary file path
        const tempFilePath = path.join(os.tmpdir(), filename);

        // Pipe the response to a file
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        // Wait for the download to finish
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send the file
        res.sendFile(tempFilePath, {}, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
            // Delete the temporary file after sending
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temporary file:', unlinkErr);
            });
        });

    } catch (error) {
        console.error('Error downloading file:', error);
        if (error.response) {
            res.status(error.response.status).send(`Error: ${error.response.statusText}`);
        } else if (error.request) {
            res.status(503).send('Error: No response received from the server');
        } else {
            res.status(500).send('Error downloading file');
        }
    }
});

app.listen(port, () => {
    console.log(`Download server running at http://localhost:${port}`);
});