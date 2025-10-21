const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // ڕێگەدان بە ماڵپەڕی Netlify کە پەیوەندی بکات
app.use(express.json());

// ئەمە ڕووکاری سەرەکییە، بۆ دڵنیابوون لەوەی سێرڤەرەکە ئیش دەکات
app.get('/', (req, res) => {
    res.send('سێرڤەری بۆت کاردەکات!');
});

// کاتێک داتاکان لە ماڵپەڕەکەوە دێت بۆ ئەم لینکە
app.post('/start-bot', (req, res) => {
    const { token, chatId } = req.body;

    if (!token || !chatId) {
        return res.status(400).json({ success: false, message: 'تۆکن یان ناسنامەی چات بەتاڵە' });
    }

    try {
        const bot = new TelegramBot(token, { polling: true });

        // ناردنی نامەیەکی تاقیکاری بۆ دڵنیابوونەوە
        bot.sendMessage(chatId, '✅ سڵاو! بۆتەکەت بە سەرکەوتوویی کارا کرا.')
            .then(() => {
                console.log(`بۆت کارا کرا بۆ chatId: ${chatId}`);
                // وەستاندنی polling دوای ناردنی نامەکە بۆ ئەوەی سێرڤەرەکە قورس نەبێت
                // ئەگەر دەتەوێت بۆتەکە بەردەوام بێت، ئەم دێڕە بسڕەوە
                bot.stopPolling(); 
            })
            .catch(error => {
                console.error('هەڵە لە ناردنی نامە:', error.response.body.description);
                res.status(500).json({ success: false, message: error.response.body.description });
            });
            
        res.json({ success: true, message: 'داواکاری وەرگیرا، هەوڵی کارپێکردنی بۆت دەدرێت' });

    } catch (error) {
        console.error('هەڵە لە دروستکردنی بۆت:', error);
        res.status(500).json({ success: false, message: 'تۆکنەکە هەڵەیە' });
    }
});

app.listen(port, () => {
    console.log(`سێرڤەر لەسەر پۆرتی ${port} کاردەکات`);
});