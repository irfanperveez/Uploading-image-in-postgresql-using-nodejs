const express = require('express');
const path = require('path');
const imageController = require('./controllers/imageController');

const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.get('/', imageController.renderHomePage);
app.post('/upload', imageController.upload.single('profileimage'), imageController.uploadImage);
app.get('/uploads/:filename', imageController.getImageByFilename);
app.get('/image/:id', imageController.getImageById);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));