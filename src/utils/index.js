const mapAlbumModel = ({
  id,
  name,
  year,
  title,
  performer,
  albumId,
}) => ({
  id: albumId,
  name,
  year,
  songs: [
    id,
    title,
    performer,
  ],
});

const mapSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { mapAlbumModel, mapSongModel };
