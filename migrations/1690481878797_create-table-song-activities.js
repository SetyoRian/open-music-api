exports.up = (pgm) => {
  pgm.createTable('activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"',
      referencesConstraintName: 'fk_collaborations.playlist_id_playlist.id',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
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
  pgm.dropTable('activities');
};
