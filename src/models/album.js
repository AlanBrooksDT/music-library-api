/* src/models/album.js */
module.exports = (sequelize, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
      year: DataTypes.INTEGER,
    };
  
    const AlbumModel = sequelize.define('Album', schema);
    return AlbumModel;
  };
  