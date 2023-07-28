exports.up = (pgm) => {
  pgm.createTable('collaborations', {
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
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      referencesConstraintName: 'fk_collaborations.user_id_user.id',
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
  pgm.dropTable('collaborations');
};
