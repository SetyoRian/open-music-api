const fs = require('fs');
const { Pool } = require('pg');
const InvariantError = require('../errors/InvariantError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addCoverAlbum(coverURL, albumId) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE albums.id = $2 RETURNING id',
      values: [coverURL, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal Menambahkan Cover');
    }
  }
}

module.exports = StorageService;
