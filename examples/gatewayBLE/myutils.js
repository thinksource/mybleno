var os = require('os');
var uuid = require('uuid');
var MY_NAMESPACE= '1b671a64-40d5-491e-99b0-da01ff1f3341';

exports.hostname = os.hostname();
exports.device_id = uuid.v5(os.hostname(), MY_NAMESPACE);