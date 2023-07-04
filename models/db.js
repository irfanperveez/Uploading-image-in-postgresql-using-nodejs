const { Sequelize, DataTypes } = require('sequelize');

// Replace 'your_database_name', 'your_username', 'your_password', and 'your_host' with your actual PostgreSQL credentials
const sequelize = new Sequelize('postgres', 'postgres', 'irfan123', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the 'images' model
const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Synchronize the model with the database and create the table if it doesn't exist
(async () => {
  try {
    await sequelize.authenticate();
    await Image.sync(); // Sync only the Image model
    console.log('Database connected and table synchronized successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

module.exports = { sequelize, Image };