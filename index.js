#!/usr/bin/env node
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var pathArg = process.argv[2] || './.build/.node-version';
var versionFilePath = path.resolve(process.cwd(), process.argv[2]);

fs.readFile(versionFilePath, { encoding: 'utf8' }, function (err, contents) {
    if (err && err.code !== 'ENOENT') throw err;
    if (err || contents !== process.version) {
        if (err) {
            console.log('version check file missing; rebuilding');
        }
        else {
            console.log('version check unsuccessful: last build for ', contents, ' and current node version is ', process.version);
        }

        var rebuild = exec('npm rebuild');

        rebuild.stdout.on('data', function (data) {
            console.log(data);
        });

        rebuild.stderr.on('data', function (data) {
            console.log(data);
        });

        rebuild.on('close', function (code) {
            if (code) console.log('child process exited with code ', code);
            fs.writeFile(versionFilePath, process.version, function (err) {
                if (err) throw err;
                console.log('wrote version check file: ', process.version);
            });
        });
    }
    else {
        console.log('node version check successful; skipping rebuild');
    }
});