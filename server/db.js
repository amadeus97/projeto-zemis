"use strict";
const sqlite3 = require('sqlite3').verbose();

class Db {
  constructor(file) {
    this.db = new sqlite3.Database(file);
    this.createTableUser();
    this.createTableCol();
    this.createTableItem()
  }

  createTableUser() {
    const sql = `
    	CREATE TABLE IF NOT EXISTS user (
    		id integer PRIMARY KEY, 
    		name text NOT NULL, 
    		email text NOT NULL UNIQUE, 
        user_pass text NOT NULL,
        reset_pass_token text,
        is_admin integer NOT NULL DEFAULT 0
      )`
	  return this.db.run(sql);
  }

  createTableCol() {
    const sql = `
      CREATE TABLE IF NOT EXISTS collection (
      id integer PRIMARY KEY,
      name text NOT NULL,
      total integer NOT NULL,
      created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status integer NOT NULL DEFAULT 0,
      owner integer NOT NULL,
      FOREIGN KEY (owner) REFERENCES user(id)
      )`
    return this.db.run(sql);
  }

  createTableItem() {
    const sql = `
      CREATE TABLE IF NOT EXISTS item (
        id integer primary key,
        order_num integer not null,
        name text not null,
        created_at text not null DEFAULT CURRENT_TIMESTAMP,
        collection_id integer not null,
        foreign key (collection_id) references collection(id)
      )`
    return this.db.run(sql);
  }

  selectByEmail(email, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE email = ?`,
      [email],function(err,row){
    	callback(err,row)
    })
  }

  selectAll(callback) {
    return this.db.all(`SELECT * FROM user`, function(err,rows){
    	callback(err,rows)
    })
  }

  insert(user, callback) {
    return this.db.run(
      'INSERT INTO user (name,email,user_pass) VALUES (?,?,?)',
      user, (err) => {
    	callback(err)
    })
  }

  insertAdmin(user, callback) {
    return this.db.run(
      'INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)',
      user, (err) => {
      callback(err)
    })
  }

  insertCollection(collection, callback) {
    return this.db.run(
      'INSERT INTO collection (name, total, owner) VALUES (?,?,?)',
      collection, (err) => {
    	callback(err)
    })
  }

  insertItem(item, callback) {
    return this.db.run(
      'INSERT INTO item (order_num, name, collection_id) VALUES (?,?,?)',
      item, (err) => {
        callback(err)
      }
    )
  }

  selectCollections(id, callback) {
    return this.db.all(`
      SELECT
        id,name,total,status,datetime(created_at,'localtime') as created_at
      FROM
        collection where owner = ?;`,
      id, (err, rows) => {
      let arr = [];
      rows.forEach((row) => {
        arr.push(row);
      })
      callback(err, arr);
    });
  }

  selectItems(id, callback) {
    return this.db.all(`
      SELECT
        id, order_num, name, created_at
      FROM
        item WHERE collection_id = ? ORDER BY order_num`,
      id, (err, rows) => {
        let arr = []
        rows.forEach((row) => {
          arr.push(row);
        })
        callback(err, arr);
      }
    )
  }

  deleteItem(id, callback) {
    return this.db.run(`
      DELETE FROM item WHERE id = ?;`,
      id, (err) => {
        callback(err);
      })
  }

  selectCollection(id, callback) {
    return this.db.get(
      `SELECT name,total,status FROM collection WHERE id = ?;`,
      id, (err,collection) => {
        callback(err, collection);
      }    
    )
  }

  deleteCollection(id, callback) {
    return this.db.run('DELETE FROM item WHERE collection_id = ?', id)
    .run('DELETE FROM collection WHERE id = ?', id, (err) => {
      callback(err);
    });
  }

  updateStatus(id, callback) {
    return this.db.run('UPDATE collection SET status = ? WHERE id = ?',
    id, (err) => {
      callback(err);
    })
  }

  updateToken(token, callback) {
    return this.db.run(`
      UPDATE user SET reset_pass_token = ? WHERE email = ?`,
    token, (err) => {
      callback(err);
    });
  }

  selectToken(token, callback) {
    return this.db.get(`SELECT * FROM user WHERE reset_pass_token = ?`,
    token, (err, row) => {
      callback(err, row);
    })
  }

  updatePass(info, callback) {
    return this.db.run(`UPDATE user SET user_pass = ?, reset_pass_token = null WHERE id = ?`,
    info, (err) => {
      callback(err);
    })
  }

  updateProfile(info, callback) {
    return this.db.run(`UPDATE user SET name = ?, email = ? WHERE id = ?`,
    info, (err) => {
      callback(err);
    })
  }
}

module.exports = Db