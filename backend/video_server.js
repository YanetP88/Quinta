var net = require('net'),
    Sequelize = require('sequelize'),
    async = require('async'),
    JsonSocket = require('json-socket'),
    fs = require('fs-extra'),
    path = require('path'),
    ffmpeg = require('fluent-ffmpeg');

var exports = module.exports = {};

exports.threads = require('os').cpus().length;
exports.output_folder = '';

function ffmpegConvert(video, output, callback) {
    var filename = path.basename(video).split('.')[0] + '.mp4',
        output = path.resolve(output + '//' + filename);

    ffmpeg(video)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('error', function (err) {
            if (typeof callback === 'function' && callback) callback({status: 'E', 'error': err});
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function (stdout, stderr) {
            if (typeof callback === 'function' && callback) callback({status: 'C', progress: 100});
        })
        .on('progress', function (progress) {
            if (typeof callback === 'function' && callback) callback({
                status: 'R',
                progress: Math.floor(progress.percent)
            });
        })
        .save(output);
}


var kue = require('kue'),
    jobs = kue.createQueue(),
    express = require('express');

exports.task = function newConvertJob(name) {
    name = name || 'Default_Name';
    var job = jobs.create('video conversion', {
        title: name,
        user: 1,
        frames: 100
    });

    job.on('complete', function () {
        console.log('Job', job.id, 'converting', job.data.title, job.data.user, 'is done');
    }).on('failed', function () {
        console.log('Job', job.id, 'converting', job.data.title, job.data.user, 'has failed');
    }).on('error', function () {
        console.log('Job', job.id, 'converting', job.data.title, job.data.user, 'has failed');
    }).removeOnComplete(true).save(function (err) {
        if (!err) console.log(job.id);
    });

};

jobs.process('video conversion', exports.threads, function (job, done) {
    var frames = job.data.frames;
    ffmpegConvert(job.data.title, exports.output_folder, function (status) {
        if (status.status == 'C') done && done();
        if (status.status == 'R') job.progress(status.progress, frames);
        if (status.status == 'E') {
            job.shutdown(1000, function (err) {
                console.error('Kue shutdown result: ', status.error || 'OK');
                process.exit(0);
            });
        }
        ;
    })
});

function videoQueue() {
    convertVideosKue(function (err, videos) {
        if (!err) {
            videos.forEach(function (video) {
                newConvertJob(video.name);
            });
        } else {
            console.log(err)
        }
    })
}

kue.app.listen(3000);
console.log('UI started on port 3000');