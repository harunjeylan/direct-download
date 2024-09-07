const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const port = 8800;

app.get('/download', async (req, res) => {
    const fileUrl = "http://159.69.47.129:8080/download/noco/pe5my6ktgt5htyb/m30o94hsi5b24ce/czzr1pg1riapm9g/Leonardo_Phoenix_IOyS_.jpg" //req.query.url; // Get the file URL from the query params
    if (!fileUrl) {
        return res.status(400).send('File URL is required.');
    }

    try {
        // Get the file name and extension from the URL
        const fileName = path.basename(fileUrl);
        const fileExtension = path.extname(fileName);

        // Download the file
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });

        // Set appropriate headers for displaying inline based on the file type
        let contentType;
        switch (fileExtension) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
            default:
                contentType = 'application/octet-stream';
        }

        // Set the content type and serve the file inline
        res.setHeader('Content-Type', contentType);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error downloading the file:', error);
        res.status(500).send('Error downloading the file.');
    }
});

app.listen(port, () => {
    console.log(`Download server running at http://localhost:${port}`);
});