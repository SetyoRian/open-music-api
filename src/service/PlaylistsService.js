const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../errors/InvariantError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, userId }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, userId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getOwnerPlaylist(userId) {
    const query = {
      text: `SELECT
      playlists.id, playlists.name, users.username 
      FROM playlists
      JOIN users ON playlists.owner = users.id
      WHERE users.id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async removePlaylist(userId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [userId],
    };

    await this._pool.query(query);
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `tracklist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan song ke dalam Playlist');
    }
  }

  async getPlaylistSong(playlistId) {
    const query = {
      text: `SELECT
      playlists.id AS id_playlist, playlists.name, users.username,
      songs.id AS id_song, songs.title, songs.performer 
      FROM playlists
      JOIN users 
      ON playlists.owner = users.id
      JOIN playlist_songs 
      ON playlists.id = playlist_songs.playlist_id 
      JOIN songs
      ON playlist_songs.song_id = songs.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const res = {
      id: result.rows[0].id_playlist,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: [],
    };

    result.rows.forEach((element) => {
      const temp = {
        id: element.id_song,
        title: element.title,
        performer: element.performer,
      };
      res.songs.push(temp);
    });

    return res;
  }

  async removePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menghapus song dari dalam Playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner.toString() !== userId.toString()) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
