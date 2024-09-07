const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Replace with your Telegram bot token
const TELEGRAM_BOT_TOKEN = '7220992961:AAGDpY7KEHI3t4FCdHrMPwAx55vPQx3dAx0';

// Replace with the chat ID you want to send the image to
const CHAT_ID = '@myhubo';


async function sendImageFromUrl(imageUrl, caption) {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            chat_id: CHAT_ID,
            photo: imageUrl,
            caption: caption,
        });

        console.log('Image sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending image:', error.response ? error.response.data : error.message);
    }
}


// Example usage
const imageUrl = "http://localhost:8800/download?url=http://159.69.47.129:8080/download/noco/pe5my6ktgt5htyb/m30o94hsi5b24ce/czzr1pg1riapm9g/download_UFvxx&ext=jpeg"
sendImageFromUrl(imageUrl, 'Here is an image!');


