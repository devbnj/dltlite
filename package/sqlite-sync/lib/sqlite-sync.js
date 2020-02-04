/**
 * sqlite-sync.js
 * 
 */
/*jshint esversion: 6 */
/*jshint node: true*/

'use strict';

/*
if (process.versions.electron) {
	process.stderr.write = console.error.bind(console);
	process.stdout.write = console.log.bind(console);
}
*/

let fs = require('fs');
let SQL = require('sql.js');
let path = require('path');
let events = require('events');

/**
 * sqliteSync Forward declaration
 * 
 */
function sqliteSync() {}

// sqliteSync Variables (declaration)
sqliteSync.prototype.db = null;
sqliteSync.prototype.buffer = null;
sqliteSync.prototype.writer = null;
sqliteSync.prototype.file = null;
sqliteSync.prototype.sql = '';
sqliteSync.prototype.debug = false;

/**
 * Database connection
 *
 * @param {String|Object} dataBase 
 * @return {Object}
 */
sqliteSync.prototype.connect = function(dataBase) {
	if (typeof (dataBase) == 'string') {
		this.file = dataBase;
		if (!dataBase || dataBase === ':memory:' || dataBase.indexOf('file::memory:') === 0) {
			this.buffer = new Buffer(0);
		} else if (fs.existsSync(this.file)) {
			this.buffer = fs.readFileSync(this.file);
		}
	} else if (typeof (dataBase) == "object") {
		this.buffer = dataBase;
	}

	if (this.buffer) {
		try {
			this.db = new SQL.Database(this.buffer);
		} catch (errorx) {
			console.debug('Error (x)', errorx);
			throw errorx;
		}
	} else {
		try {
			this.db = new SQL.Database();
			this.write();
		} catch (errory) {
			console.debug('Error (y)', errory);
			throw errory;
		}
	}
	return this;
}

/**
 * Alternative connection
 */
sqliteSync.prototype.con = sqliteSync.prototype.connect;

/**
 * Runing queries | Sync & Async
 *
 * @param {String} sqlstr - SQL code
 * @param {Array|Function} otherOptions - Array to prepared sql | callback function
 * @param {Function} callback - callback function
 * @return {Array|Object}
 */
sqliteSync.prototype.run = function(sqlstr, otherOptions, callback) {
	if (typeof (otherOptions) == "function") {
		callback = otherOptions;
		otherOptions = [];
	}
	let results;
	// check beyond the sql syntax
	let type = sqlstr.substring(0, 6);
	type = type.toUpperCase();
	switch (type) {
		case "SELECT":
			results = this.pvSELECT(sqlstr, otherOptions);
			break;
		case "INSERT":
			results = this.pvINSERT(sqlstr, otherOptions);
			break;
		
		// ** ensuring updates and deletes are stopped
		case "UPDATE":
			results = this.pvUPDATE(sqlstr, otherOptions);
			break;
		case "DELETE":
			results = this.pvDELETE(sqlstr, otherOptions);
			break;
		
		case "PRAGMA":
			results = this.pvPRAGMA(sqlstr, otherOptions);
			break;
		default:
			results = this.runAll(sqlstr)
	}
	if (callback) {
		callback(results);
		return this;
	} else {
		return results;
	}
}

/**
   * Runing queries Async
   *
   * @param {String} sqlstr - SQL code
   * @param {Array|Function} otherOptions - Array to prepared sql | callback function
   * @param {Function} callback - callback function
   * @return {Array|Object} 

   * @deprecated This function will no longer be used soon!
   */
sqliteSync.prototype.runAsync = function(sqlstr, otherOptions, callback) {
	this.sql = sqlstr;
	if (typeof (otherOptions) == "function") {
		otherOptions(this.run(sqlstr));
	} else if (typeof (callback) == "function") {
		callback(this.run(sqlstr, otherOptions));
	} else {
		this.run(sqlstr, otherOptions);
	}
	return this;
}

/**
 * PRAGMA statements
 *
 * @param {String} preparedSql - SQL statement
 * @param {Array} whereClause - Array ti prepared sql
 * @return {Object}
 */
sqliteSync.prototype.pvPRAGMA = function(preparedSql, whereClause) {
	if ((preparedSql.split('=')).length > 1) {
		// update
		return this.pvUPDATE(preparedSql, whereClause);
	} else {
		// get
		return this.pvSELECT(preparedSql, whereClause);
	}
}

/**
 * Runing selects - PRIVATE
 *
 * @param {String} sqlStatement - SQL code
 * @param {Array} whereClause - Array to prepared sql 
 * @return {Object}
 */
sqliteSync.prototype.pvSELECT = function(sqlStatement, whereClause) {
	if (whereClause) {
		for (var i = 0; i < whereClause.length; i++) {
			sqlStatement = sqlStatement.replace('?', ":arg" + i);
		}
	}
	this.sql = sqlStatement;
	try {
		let sqlStmt = this.db.prepare(sqlStatement);
		let resultArray = [];
		sqlStmt.bind(whereClause);
		while (sqlStmt.step()) {
			resultArray.push(sqlStmt.getAsObject());
		}
		sqlStmt.free();
		return resultArray;
	} catch (errorx) {
		if (this.debug) {
			throw errorx;
		}
		return {
			error: errorx
		}
	}
}

/**
 * Runing deletes - PRIVATE
 *
 * @param {String}  sql - SQL code
 * @param {Array} where - Array to prepared sql 
 * @return {Boo}
 */

sqliteSync.prototype.pvDELETE = function (sql, where) {
	if (where) {
		for (var i = 0; i < where.length; i++) {
			sql = sql.replace('?', ":arg" + i);
		}
	}
	this.sql = sql;
	try {
		var stmt = this.db.prepare(sql);
		stmt.bind(where);
		stmt.step();
		stmt.free();
		this.write();
		return this.db.getRowsModified();
	} catch (x) {
		if (this.debug) {
			throw x;
		}
		return {
			error: x
		};
	}
}


/**
 * Running inserts - PRIVATE
 *
 * @param {String} sqlStatement - SQL code
 * @param {Array} data - Array to prepared sql 
 * @return {Int} last insert id
 */
sqliteSync.prototype.pvINSERT = function(sqlStatement, data) {
	if (data) {
		for (var i = 0; i < data.length; i++) {
			sqlStatement = sqlStatement.replace('?', ":arg" + i);
		}
	}
	this.sql = sqlStatement;
	try {
		let sqlStmt = this.db.prepare(sqlStatement);
		sqlStmt.bind(data);
		sqlStmt.step();
		sqlStmt.free();
		let lastAppendId = this.pvSELECT("SELECT last_insert_rowid()");
		this.write();
		return lastAppendId[0]['last_insert_rowid()'];
	} catch (errorx) {
		if (this.debug) {
			throw errorx;
		}
		return {
			error: errorx
		};
	}

}

/**
 * Runing updates - PRIVATE
 *
 * @param {String}  sql - SQL code
 * @param {Array} data - Array to prepared sql 
 * @return {Boo} 
 */

sqliteSync.prototype.pvUPDATE = function(sql, data) {
	if (data) {
		for (var i = 0; i < data.length; i++) {
			sql = sql.replace('?', ":arg" + i);
		}
	}
	this.sql = sql;
	try {
		var stmt = this.db.prepare(sql);
		stmt.bind(data);
		stmt.step();
		stmt.free();
		this.write();
		return this.db.getRowsModified();
	} catch (x) {
		if (this.debug) {
			throw x;
		}
		return {
			error: x
		};
	}
}


/**
 * Runing INSERT - Publics
 *
 * @param {String} dataTable - Name of database table
 * @param {Object} data - Object to be inserted
 * @param {Function} callback - callback function
 * @return {Int|Object} - insert id | instance
 */
sqliteSync.prototype.insert = function (dataTable, insertData, callback) {
	let keysArray = [];
	let values = []
	let binds = [];
	let indexKey;
	for (indexKey in insertData) {
		if (!insertData.hasOwnProperty(indexKey)) continue;
		keysArray.push(indexKey);
		values.push(insertData[indexKey]);
		binds.push('?');
	}

	let sqlStmt = "INSERT INTO " + dataTable 
	+ " (" + keysArray.join(',') + 
	") VALUES (" + binds.join(",") + ")";
	this.sql = sqlStmt;
	if (callback) {
		callback(this.run(sqlStmt, values));
		return this;
	} else {
		return this.run(sqlStmt, values);
	}
}

/**
 * Runing UPDATE - Publics
 *
 * @param {String}  entity - Name of database table
 * @param {Object} data - Object to be updated
 * @param {Object|Function} clause - Object with wheres | callback function
 * @param {Function} callback - callback function
 * @return {Boo|Object} - result | instance
 */

sqliteSync.prototype.update = function(entity, data, clause, callback) {
	var sets = [];
	var where = [];
	console.debug('sqliteSync', 'update', 'typeof clause', typeof(clause));
	if (typeof (clause) == "function") {
		callback = clause;
		clause = {};
	}
	var values = [];
	for (var key in data) {
		if (!data.hasOwnProperty(key)) continue;
		sets.push(key + " = ?");
		values.push(data[key]);
	}
	for (key in clause) {
		if (!clause.hasOwnProperty(key)) continue;
		where.push(key + " = ?");
		values.push(clause[key]);
	}

	var sql = "UPDATE " + entity + " SET " + sets.join(', ') + (where.length > 0 ? " WHERE " + where.join(" AND ") : "");

	this.sql = sql;

	if (callback) {
		callback(this.run(sql, values));
		return this;
	} else {
		return this.run(sql, values);
	}
}


/**
 * Runing DELETE - Publics
 *
 * @param {String}  entity - Name of database table
 * @param {Object|Function} clause - Object with wheres | callback function
 * @param {Function} callback - callback function
 * @return {Boo|Object} - result | instance
 */

sqliteSync.prototype.delete = function(entity, clause, callback) {
	var where = [];
	if (typeof (clause) == "function") {
		callback = clause;
		clause = [];
	}

	var values = [];
	if (clause) {
		for (var key in clause) {
			if (!clause.hasOwnProperty(key)) continue;
			where.push(key + " = ?");
			values.push(clause[key]);
		}
	}

	var sql = "DELETE FROM " + entity + " WHERE " + where.join(" AND ");

	this.sql = sql;

	var result = this.pvDELETE(sql, values);

	if (callback) {
		callback(result);
		return this;
	} else {
		return result;
	}
}


/**
 * Runing All - PRIVATE
 *
 * @param {String}  sqlStmt - SQL
 * @return {Boo} 
 */
sqliteSync.prototype.runAll = function(sqlStmt) {
	this.sql = sqlStmt;
	try {
		let resultSet = this.db.exec(sqlStmt)
		this.write();
		return resultSet;
	} catch (errorx) {
		if (this.debug) {
			throw errorx;
		}
		return {
			error: errorx
		};
	}
}

/**
 * Writing file or calling buffer callback
 *
 * @return {Object} 
 */
sqliteSync.prototype.write = function() {
	let writeData = this.db.export();
	let writeBuffer = new Buffer(writeData);

	if (this.file) {
		fs.writeFileSync(this.file, writeBuffer);
	} else if (this.writer && typeof (this.writer) == 'function') {
		this.writer(writeBuffer);
	}
	return this;
}

/*
 * Creating functions
 *
 * @param {Function} func - the function
 * @return {Object} 
 */
sqliteSync.prototype.create_function = function(func) {
	this.db.create_function(func.name, func);
}

/**
 * Closing connection
 */
sqliteSync.prototype.close = function() {
	this.db.close();
}

/**
 * Get current sql
 * @return {String}
 */
sqliteSync.prototype.getSql = function() {
	return this.sql;
}

// Exporting module
module.exports = new sqliteSync();