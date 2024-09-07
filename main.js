const express = require('express');
const axios = require('axios');
const url = require('url');

const app = express();
const port = 8800;

// 4000

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

        const contentDisposition = response.headers['content-disposition'];
        let filename;
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        if (!filename) {
            filename = url.parse(fileUrl).pathname.split('/').pop();
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        response.data.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Error downloading file');
    }
});

app.listen(port, () => {
    console.log(`Download server running at http://localhost:${port}`);
});