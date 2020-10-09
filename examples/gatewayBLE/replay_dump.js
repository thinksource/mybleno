// Handler handles only single connection at a time.


var util = require('util');
var bleno = require('../..');
var os = require('os');

var args = process.argv.slice(2);

var mqtt = require('mqtt');

// connect to the message server
var qclient = mqtt.connect('mqtt://localhost');
/*
var qclient = mqtt.connect('mqtt://chi-sensors.ddns.net:1883', 
  { username: 'bsuser', password: 'secretCh1Pa66wo4d'
  });

*/
// terminate the client
//qclient.end();

if(args.length != 1) {
	console.log("provide input file as an argument");
	process.exit(1);
}


var fs = require('fs');

var path = require('path'),
	filePath = path.join(__dirname, args[0]);


function split_dumps(data_string) {
  var chunks = [], levels = 0, start = 0;
  var max_level = 0, corrupted = 0; //to detect annomalies, corrupted dumps

  for(var i = 0;i<data_string.length;i++) {
    if(data_string.charAt(i) == '{') {
      levels++;
      if(levels == 1) {
        start = i;
      }
    }

    if(data_string.charAt(i) == '}') {
      levels--;
      if(levels == 0) {
        chunks.push(data_string.substring(start, i+1));
      }
	if(levels < 0) console.log('ERROR negative level at i=' + i);
    }
    
    if(max_level < levels) max_level = levels;

    //if we are on a shifted level at the end of a cycle
    //differe in each cycle is 2 levels
    if(max_level > 2 && levels == max_level-2) {
      levels = 0; max_level = 0; corrupted++;
    }
  }
	console.log('CORRUPTED places: ' + corrupted);
  
  return chunks;
}


fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data.length);
        var splits = split_dumps(data);
        console.log('parsed into: ' + splits.length);
        var i=0;
        for(;i<splits.length ;i++) {
          qclient.publish('dumps', splits[i] ,{qos: 2});
        }
        console.log('published: ' + i);
    } else {
        console.log(err);
    }
	
//	process.exit(0);
});




// publish 'Hello mqtt' to 'test'
/*
var json_dump = JSON.stringify({
      'from': _fromBean,
      'index': index_counter,
      'by_bs': bs_name,
      'timestamp': dumps_timestamp.getTime(),
      'data': ret_json
    });
qclient.publish('dumps', json_dump ,{qos: 2});

//save backup to file
fs.appendFile("dumps.json", json_dump );
fs.appendFile("dumps.json", "\n" );
*/
