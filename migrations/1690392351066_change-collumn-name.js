exports.up = (pgm) => {
  pgm.renameColumn('songs', 'albumId', 'album_id');

  pgm.renameColumn('songs', 'createdAt', 'created_at');

  pgm.renameColumn('songs', 'updatedAt', 'updated_at');

  pgm.renameColumn('albums', 'createdAt', 'created_at');

  pgm.renameColumn('albums', 'updatedAt', 'updated_at');
};
