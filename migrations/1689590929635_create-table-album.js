exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    createdAt: {
      type: 'DATE',
      notNull: true,
    },
    updatedAt: {
      type: 'DATE',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
