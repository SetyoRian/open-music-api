const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../errors/InvariantError');
const NotFoundError = require('../errors/NotFoundError');

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborator(playlistId, userId) {
    const id = `collaboration-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    await this.verifyCollaboratorId(userId);

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, userId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaborator({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    await this._pool.query(query);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async verifyCollaboratorId(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User id tidak ditemukan');
    }
  }
}

module.exports = CollaborationService;
