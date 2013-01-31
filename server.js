#!/usr/bin/env node

// Load required modules
var express = require('express');
var app     = express();
var spawn   = require('child_process').spawn
var exec    = require('child_process').exec;


// Express options
app.use(express.bodyParser());
app.engine('html', require('ejs').__express);
app.use("/", express.static(__dirname+'/resources'));
app.set('port',3001);



// The directory to search for videos from
var root_dir = process.argv[2] || process.cwd();


// Boot mplayer
var mplayer = (function(){
    var spawnedProcess;

    // Function sets spawnedProcess to mplayer process
    // When mplayer exits, it sets spawnedProcess to a new mplayer process
    (function generateProcess() {
        spawnedProcess = spawn(
            "mplayer",
            [
                '-slave',
                '-idle',
                '-vfm', 'ffmpeg',
                '-lavdopts', 'lowres=0:fast:skiploopfilter=all',
                '-autosync', '30'
            ],
            { stdio: ['pipe',1,2] }
        );

        spawnedProcess.on('exit', function() {
            generateProcess();
        });

        console.log("Mplayer pid: ", spawnedProcess.pid);
    })();

    // Return function that always writes to the current spawnedProcess
    return function(data) {
        spawnedProcess.stdin.write(data);
    }
})();


// Get array of playable files
var file_list = (function() {
    var file_list = [];
    var ls = exec(
        'find "'+root_dir+'" -iname *.avi',
        function(error, stdout, stderr) {
            //console.log(error)
            //console.log(stdout);
            //console.log(stderr);

            file_list.push.apply(file_list, stdout.split("\n"));
            file_list.pop();
            file_list.sort();
        }
    );

    return file_list;
})();



// output controller
app.get('/', function(req, res) {
    res.render('interface.html', {list: file_list});
});


// accept commands
app.post('/command', function(req,res) {
    var command = req.body.command;

    mplayer(command+"\n");

    res.send({"return":"ok"});
});

// output list of playable files
app.get('/list', function(req, res) {
    res.send(JSON.stringify(file_list));
});


// Attach server
app.listen(app.get('port'));
console.log("Listening to port "+app.get('port'));
