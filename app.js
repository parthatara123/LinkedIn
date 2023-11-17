const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config();
const multer = require('multer');
const { sharePostOnLinkedIn } = require('./linkedIn-share/linkedin.controller')

const app = express();
const port = process.env.PORT || 3000;

app.use(multer().any())

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

// API for posting media on LinkedIn
app.post('/media', async (req, res) => {  
    const imageName = req?.files[0]?.originalname;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if(!imageName || !validTypes.includes(req?.files[0].mimetype)){
        return res.json({
            status: false,
            message: 'Please provide valid image in png or jpeg format.',
        });
    }

    const imagePath = path.join(__dirname, 'Media', imageName);
        await sharePostOnLinkedIn(req, res, imagePath)
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



