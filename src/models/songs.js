/* src/models/songs.js */
module.exports = (sequelize, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
    };
  
    const SongModel = sequelize.define('Song', schema); //model name is Song. Sequelize automatically pluralizes to give the table name Songs
    return SongModel;
  };