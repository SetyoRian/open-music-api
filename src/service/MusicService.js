const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../errors/InvariantError');
const NotFoundError = require('../errors/NotFoundError');
const { mapSongModel } = require('../utils');

class MusicService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const addNewAlbum = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(addNewAlbum);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getOneAlbum(id) {
    const getAlbum = await this._pool.query(
      'SELECT albums.id AS "albumId", albums.name, albums.year, songs.id, songs.title, songs.performer FROM albums LEFT OUTER JOIN songs ON albums.id = songs."albumId" WHERE albums.id = $1',
      [id],
    );

    if (!getAlbum.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan`);
    }

    console.log(getAlbum.rows);
    const result = {
      id: getAlbum.rows[0].albumId,
      name: getAlbum.rows[0].name,
      year: getAlbum.rows[0].year,
      songs: [],
    };

    if (getAlbum.rows[0].id) {
      getAlbum.rows.forEach((element) => {
        const temp = {
          id: element.id,
          title: element.title,
          performer: element.performer,
        };
        result.songs.push(temp);
      });
    }

    return result;
  }

  async editOneAlbum(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const updateAlbum = await this._pool.query('UPDATE albums SET name = $1, year = $2, "updatedAt" = $3 WHERE id = $4 RETURNING id', [name, year, updatedAt, id]);

    if (!updateAlbum.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan`);
    }
  }

  async deleteOneAlbum(id) {
    const deleteAlbum = await this._pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);

    if (!deleteAlbum.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan`);
    }
  }

  async addNewSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const addSong = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(addSong);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllSong(title, performer) {
    if (title && performer) {
      const findSongByTitle = await this._pool.query(`SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' AND lower(performer) LIKE '%${performer}%'`);
      return findSongByTitle.rows;
    }
    if (title) {
      const findSongByTitle = await this._pool.query(`SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%'`);
      return findSongByTitle.rows;
    }
    if (performer) {
      const findSongByPerformer = await this._pool.query(`SELECT id, title, performer FROM songs WHERE lower(performer) LIKE '%${performer}%'`);
      return findSongByPerformer.rows;
    }
    const allSongs = await this._pool.query('SELECT id, title, performer FROM songs');
    return allSongs.rows;
  }

  async getOneSong(id) {
    const getSong = await this._pool.query('SELECT * FROM songs WHERE id = $1', [id]);

    if (!getSong.rows.length) {
      throw new NotFoundError(`Song dengan id ${id} tidak ditemukan`);
    }

    return getSong.rows.map(mapSongModel)[0];
  }

  async editOneSong(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const updateAlbum = await this._pool.query(
      'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, "updatedAt" = $7 WHERE id = $8 RETURNING id',
      [title, year, genre, performer, duration, albumId, updatedAt, id],
    );

    if (!updateAlbum.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan`);
    }
  }

  async deleteOneSong(id) {
    const deleteSong = await this._pool.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id]);

    if (!deleteSong.rows.length) {
      throw new NotFoundError(`Song dengan id ${id} tidak ditemukan`);
    }
  }
}

module.exports = MusicService;
