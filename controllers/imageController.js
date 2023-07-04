const multer = require('multer');
const path = require('path');
const  {Image} = require('../models/db');




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });



const renderHomePage = (req, res) => {
  return res.render('homepage');
};

const uploadImage = async (req, res) => {
  
  try {
    const filename = req.file.filename;
    const result = await Image.create({ filename });
    console.log('Image data saved to the database:', result.toJSON());
    return res.redirect('/');
  } catch (error) {
    console.error('Error saving image data to the database:', error);
    return res.status(500).send('Error uploading the image.');
  }
};

const getImageByFilename = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename); // Assuming the "uploads" folder is located at the root of the project.
  res.sendFile(filePath);
};

const getImageById = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', image.filename));
  } catch (error) {
    console.error('Error fetching image from the database:', error);
    res.status(500).send('Error fetching image from the database');
  }
};

module.exports = { renderHomePage, upload, uploadImage, getImageByFilename, getImageById};