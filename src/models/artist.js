/* src/models/artist.js */
module.exports = (connection, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
      genre: DataTypes.STRING,
    };
  
    const ArtistModel = connection.define('Artist', schema);
    return ArtistModel;
  };
  /*Here we are exporting a function which takes a connection to a database, 
  and a set of DataTypes. We then define a schema object and pass it to connection.define, 
  along with what we want the table in our database to be called.*/
