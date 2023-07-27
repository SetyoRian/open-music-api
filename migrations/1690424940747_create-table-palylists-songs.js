exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"',
      referencesConstraintName: 'fk_playlist_songs.playlist_id_playlist.id',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"songs"',
      referencesConstraintName: 'fk_playlist_songs.song_id_song.id',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'DATE',
      notNull: true,
    },
    updated_at: {
      type: 'DATE',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
