#!/usr/bin/env node

// Load required modules
var express = require('express')
  , app = express()
  , spawn = require('child_process').spawn
  , exec = require('child_process').exec;


// Express options
app.use(express.bodyParser());
app.engine('html', require('ejs').__express);


// The directory to search for videos from
var root_dir = process.argv[2] || process.cwd();


// Boot mplayer
var mplayer;

(function bootMplayer(){
  mplayer = spawn('mplayer', ['-slave', '-idle']);

  mplayer.stdout.on('data', function(data){
    process.stdout.write(data);
  });
  mplayer.stderr.on('data', function(data){
    process.stderr.write(data);
  });

  mplayer.on('exit', function(){
    bootMplayer();
  });
})();


// Get array of playable files
var file_list = [];
(function(){
  var ls = exec(
    'find "'+root_dir+'" -iname *.avi',
    function(error, stdout, stderr){
      console.log(error)
      console.log(stdout);
      console.log(stderr);
      file_list = stdout.split("\n");
      file_list.pop();
    }
  );
})();



// output controller
app.get('/', function(req, res){
    res.render('interface.html', {list: file_list});
});


// accept commands
app.post('/command', function(req,res){
    var command = req.body.command;

    console.log('Sending command: '+command);
    mplayer.stdin.write(command+"\n");

    res.send({"return":"ok"});
});

// output list of playable files
app.get('/list', function(req, res){
  res.send(JSON.stringify(file_list));
});


// Attach server
app.listen(3001);
