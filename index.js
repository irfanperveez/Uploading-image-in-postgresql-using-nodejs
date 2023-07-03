const express = require('express');
const multer = require('multer');
const path = require('path');
const {  Image } = require('./config/db');

const app = express();
const PORT = 4000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.render('homepage');
});


app.post('/upload', upload.single('profileimage'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  // Save the image filename to the 'images' table using the Sequelize model
  try {
    const filename = req.file.filename;
    const result = await Image.create({ filename });
    console.log('Image data saved to the database:', result.toJSON());
    return res.redirect('/');
  } catch (error) {
    console.error('Error saving image data to the database:', error);
    return res.status(500).send('Error uploading the image.');
  }
});
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filePath);
});

app.get('/image/:id', async (req, res) => {
  try {
    const imageId = req.params.id;

    // Retrieve the image data from the database based on the image ID
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Send the image data as a response with appropriate headers
    res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type for the image (change it according to your image type)
    res.sendFile(path.join(__dirname, 'uploads', image.filename));
  } catch (error) {
    console.error('Error fetching image from the database:', error);
    res.status(500).send('Error fetching image from the database');
  }
});


app.listen(PORT, () => console.log('Server started at port:4000'));