var MongoClient = require('mongodb').MongoClient;
var _db;

module.exports = {
	connectDB: function(cb) {
		MongoClient.connect('mongodb://bh3.duckdns.org:27017/sensors', function (err, db) {
			_db = db.db('sensors').collection('dumps_test');
			return cb(err);
		});
	},
	getDB: function() {
		return _db;
	}
};
