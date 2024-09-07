const http = require('http');
const https = require('https');

const fetchUrlAsArrayBuffer = (url) => {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;

        lib.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch URL. Status Code: ${response.statusCode}`));
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                try {
                    // Concatenate chunks to form a Buffer
                    const buffer = Buffer.concat(chunks);

                    // Convert Buffer to ArrayBuffer
                    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

                    resolve(arrayBuffer);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
};

const code = async (inputs) => {
    try {
        const { url } = inputs; // Assuming 'inputs' contains the 'url' field

        if (!url) {
            throw new Error('URL is required');
        }

        const arrayBuffer = await fetchUrlAsArrayBuffer(url);
        console.log(arrayBuffer);
        return arrayBuffer; // or handle the ArrayBuffer as needed
    } catch (error) {
        console.error('Error in code function:', error);
        throw error; // Rethrow or handle the error as appropriate
    }
};

const buffer = code({ url: "http://159.69.47.129:8080/download/noco/pe5my6ktgt5htyb/m30o94hsi5b24ce/czzr1pg1riapm9g/download_UFvxx.jpeg" })

