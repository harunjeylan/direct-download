const express = require('express');
const axios = require('axios');
const { PassThrough } = require('stream');
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

        // Set appropriate headers
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment');

        // Pipe the response directly to the client
        response.data.pipe(res);

    } catch (error) {
        console.error('Error downloading file:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).send(`Error: ${error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            res.status(503).send('Error: No response received from the server');
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).send('Error downloading file');
        }
    }
});

app.listen(port, () => {
    console.log(`Download server running at http://localhost:${port}`);
});