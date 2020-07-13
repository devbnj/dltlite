var Redis = require('ioredis');

// var redis = new Redis();
var authedRedis = new Redis(6379, 'localhost', { password: 'abcd' });

authedRedis.publish('dk001', 'Hello world from node');
