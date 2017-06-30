var configDB = require('./database.js');
var express = require('express');
const usuariosController = require('../app/controllers/usuarios');
const proyectosController = require('../app/controllers/proyectos');

var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url, {logging: false});
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var multer = require('multer'),
    fs = require('fs-extra'),
    path = require('path'),
    Finder = require('fs-finder'),
    ffmpeg = require('fluent-ffmpeg');

var User = sequelize.import('../app/models/users');

var UPLOAD_DIR = "d:\\IDooPro\\Este\\upload_files\\";
;
var video_process = require('../video_server.js');

User.sync();
var Project = sequelize.import('../app/models/project');
Project.sync();
module.exports = function (app, passport) {

// normal routes ===============================================================


// LOGIN ==============================

    app.post('/api/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (user === false) {
                res.status(401).send("Los datos insertados son incorrectos");
            } else {
                res.status(200).send("success!");
            }
        })(req, res, next);
    });


    app.post('/api/register', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (user === false) {
                res.status(401).send('El usuario ' + req.body.email + ' ya existe');
            } else {
                res.status(200).send("success!");
            }
        })(req, res, next);
    });
//Check if user is logged in
    app.get('/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
        console.log(req.body.email)
    });

    // LOGOUT ==============================


// =============================================================================
// PASSWORD FORGOT & RESET   ==================================================
// =============================================================================

    app.post('/forgot', function (req, res) {
        var email = req.body.email;

        var callback = {
            error: function (err) {
                res.end('Error sending message: ' + err);
            },
            success: function (success) {
                res.end('Check your inbox for a password reset message.');
            }
        };
        var reset = forgot(email, callback);

        reset.on('request', function (req_, res_) {
            req_.session.reset = {
                email: email,
                id: reset.id
            };
            fs.createReadStream(__dirname + '/forgot.html').pipe(res_);
        });
    });

//CHANGE PASSWORD
    app.post('/api/changepass', function (req, res) {
        var password = req.body.pw1;
        var email = req.body.email;
        User.update({
            password: bcrypt.hashSync(password)


        }, {
            where: {
                email: email
            }
        }).then(function (user) {
            res.json({mess: 'Contraseña actualizada satisfactoriamente'});
        });
    });


// =============================================================================
// CRUD MODEL USERS ==================================================
// =============================================================================

    app.get('/api/users', function (req, res) {
        /*       if (!req.isAuthenticated()) {
         res.status(401).json({result: 'UnAuthorized'});
         } else {*/
        User.findAll().then(function (users) {
            res.json(users);
        });
        //}   
    });

    app.get('/api/users/:user_id', function (req, res) {
        User.findOne(
            {
                where: {
                    id: req.params.user_id
                }
            }
        ).then(function (user) {
            res.json(user);
        });
    });


    app.delete('/api/users/:user_id', function (req, res) {
        User.findOne(
            {
                where: {
                    id: req.params.user_id
                }
            }
        ).then(function (user) {

            User.destroy({
                where: {
                    id: req.params.user_id
                }
            }).then(function () {
                User.findAll().then(function (users) {
                    res.json(users);

                });
            });
        });


    });

    app.post('/api/users/:user_id', function (req, res) {

        User.update({
            name: req.body.name,
            user: req.body.user,
            email: req.body.email,
            last_name: req.body.last_name,
            type: req.body.type,
            status: req.body.status


        }, {
            where: {
                id: req.params.user_id
            }
        }).then(function (user) {
            res.json({mess: 'Usuario ' + req.body.name + ' actualizado satisfactoriamente'});
        });
    });

// =============================================================================
// CRUD MODEL CLIENTS ==================================================
// =============================================================================    

    app.get('/api/clients', function (req, res) {
        User.findAll(
            {
                where: {
                    type: 'cliente'
                }
            }
        ).then(function (users) {
            res.json(users);
        });
    });
    app.get('/api/clients/:client_id', function (req, res) {
        console.log('aaaaa');
        User.findOne(
            {
                where: {
                    id: req.params.client_id
                }
            }
        ).then(function (user) {
            res.json(user);
        });
    });

    app.post('/api/clients', function (req, res) {


        User.create({
            user: req.body.user,
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email,
            telephone: req.body.telephone,
            type: 'Cliente',
            // createdAt: createdAt
        }).then(function (user) {
            res.json({mess: 'Cliente ' + user.name + ' creado satisfactoriamente'});

        });
    });

    app.post('/api/clients/:client_id', function (req, res) {
        last_access_date = new Date(req.body.last_access_date);
        User.update({
            name: req.body.name,
            user: req.body.user,
            email: req.body.email,
            last_name: req.body.last_name,
            type: req.body.type,
            status: req.body.status,
            last_access_date: last_access_date

        }, {
            where: {
                id: req.params.user_id
            }
        }).then(function (user) {
            res.json({mess: 'Cliente ' + user.name + ' actualizado satisfactoriamente'});
        });
    });

    app.delete('/api/clients/:client_id', function (req, res) {
        User.findOne(
            {
                where: {
                    id: req.params.user_id
                }
            }
        ).then(function (user) {

            User.destroy({
                where: {
                    id: req.params.user_id
                }
            }).then(function () {
                User.findAll().then(function (users) {
                    res.json(users);

                });
            });
        });


    });
// =============================================================================
// CRUD MODEL PROJECTS ==================================================
// =============================================================================
    var upload = multer({
        dest: path.resolve(UPLOAD_DIR)
    });


    app.post('/upload_file', upload.array('files'), function (req, res) {
        var save_file = function (file) {
            tmp_path = path.resolve(file.path);
            file_ext = file.originalname.split('.').reverse()[0];
            type = file.mimetype.split('/')[0];
            dir = path.resolve(UPLOAD_DIR + '/' + type + '/');
            if (type === 'video') {
                output_folder = path.resolve(dir + '/videos');
                dir = path.resolve(dir + '/tmp');
            }
            if (!fs.existsSync(dir)) {
                fs.ensureDirSync(dir);
            }
            target_path = path.resolve(dir + '/' + file.filename + '.' + file_ext.toLowerCase());
            src = fs.createReadStream(tmp_path);
            dest = fs.createWriteStream(target_path);
            src.pipe(dest);
            src.on('end', function () {
                console.log('upload OK');
                if (type === 'video') {
                    video_process.output_folder = path.resolve(output_folder);
                    video_process.task(target_path);
                }
                fs.unlink(tmp_path);
                ;
                res.json({mess: 'upload ok', file: path.basename(target_path)});
            });
            src.on('error', function (err) {
                console.log('Upload error' + err)
            });
        };

        if (req.files.length > 1) {
            req.files.map(function (file) {
                save_file(file)
            });
        } else {
            save_file(req.files[0])
        }
    });

    app.get('/video/:filename', function (req, res) {
        var pathToMovie = path.resolve(UPLOAD_DIR + '/video/videos/' + req.params.filename);
        res.contentType('video/mp4');
        var readStream = fs.createReadStream(pathToMovie);
        readStream.on('open', function () {
            readStream.pipe(res);
        });
        readStream.on('error', function (err) {
            res.end();
        });
    });

    app.get('/thumbnail/:filename/:size*?', function (req, res) {

        // make sure you set the correct path to your video file storage
        var pathToMovie = path.resolve(UPLOAD_DIR + '/video/videos/' + req.params.filename),
            size = req.params.size || req.query.size || '1024x720',
            file = path.resolve(UPLOAD_DIR + '/video/thumbs/' + req.params.filename + '_' + size + '.png');

        if (fs.existsSync(file)) {
            var options = {};
            ;
            res.sendFile(file, options, function (err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log('LOCAL' + file)
                }
            })
        } else {
            var proc = ffmpeg(pathToMovie)
                .on('end', function (files) {
                    res.sendFile(file);
                    console.log('FFMPEG')
                })
                .on('error', function (err) {
                    res.json({
                        status: 'error',
                        error: err.message
                    });
                })
                .outputOptions(['-f image2', '-vframes 1', '-vcodec png', '-f rawvideo', '-s ' + size + '', '-ss 00:00:01'])
                .output(file)
                .run();
        }
    });

    app.post('/delete_file', function (req, res) {
        var file = Finder.from(UPLOAD_DIR).findFirst().findFiles(req.body.file);
        fs.unlink(file);
        console.log(req.body.file)
    });

    app.get('/api/projects', function (req, res) {
        Project.findAll().then(function (projects) {
            res.json(projects);
        });
    });

    app.get('/api/projects/:project_id', function (req, res) {
        Project.findOne(
            {
                where: {
                    id: req.params.project_id
                }
            }
        ).then(function (project) {
            res.json(project);
        });
    });

    app.post('/api/projects', function (req, res) {
        registry_date = new Date(req.body.registry_date);
        creation_date = new Date(req.body.creation_date);

        images = req.body.images.join();
        videos = [];

        for (var i = 0; i < req.body.videos.length; i++) {
            videos.push(req.body.videos[i]['video'].split('/')[2].split('.')[0] + '.mp4');
        }

        Project.create({
            name: req.body.name,
            description: req.body.description,
            investment: req.body.investment,
            motivation: req.body.motivation,
            benefits: req.body.benefits,
            address: req.body.address,
            registry_date: registry_date,
            creation_date: creation_date,
            construction_time: req.body.construction_time,
            involved: req.body.involved,
            images: images,
            videos: videos.join(),
        }).then(function (project) {
            res.json({mess: 'Proyecto ' + project.name + ' creado satisfactoriamente'});
            //res.status(200).send('Proyecto creado satisfactoriamente')
        });
    });

    app.post('/api/projects/:project_id', function (req, res) {
        registry_date = new Date(req.body.registry_date);
        creation_date = new Date(req.body.creation_date);

        if (req.body.images.length) {
            images = req.body.images.join();
        }
        else images = '';
        videos = [];

        for (var i = 0; i < req.body.videos.length; i++) {
            videos.push(req.body.videos[i]['video'].split('/')[2].split('.')[0] + '.mp4');
        }

        Project.update({
            name: req.body.name,
            description: req.body.description,
            investment: req.body.investment,
            motivation: req.body.motivation,
            benefits: req.body.benefits,
            address: req.body.address,
            registry_date: registry_date,
            creation_date: creation_date,
            involved: req.body.involved,
            construction_time: req.body.construction_time,
            images: images,
            videos: videos.join(),
        }, {
            where: {
                id: req.params.project_id
            }
        }).then(function (project) {
            res.send({mess: 'El Proyecto ' + req.body.name + ' se actualizó satisfactoriamente'});
        });
    });

    app.delete('/api/projects/:project_id', function (req, res) {
        Project.findOne(
            {
                where: {
                    id: req.params.project_id
                }
            }
        ).then(function (project) {
            if (project.images) {
                images = project.images.split(',').filter(function (n) {
                    return n != ""
                });
                images.map(function (img) {
                    var file = Finder.from(UPLOAD_DIR).findFirst().findFiles(img);
                    fs.unlink(file);
                });
            }
            Project.destroy({
                where: {
                    id: req.params.project_id
                }
            }).then(function () {
                Project.findAll().then(function (projects) {
                    res.json(projects);

                });
            });
        });


    });


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('inicio.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form

    app.post('/login', function (req, res) {
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {

            res.render('inicio', {message: 'errors'});

        }
        else {
            passport.authenticate('local-login', {
                successRedirect: '/projects', // redirect to the secure profile section
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })(req, res); // <---- ADDD THIS
        }
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('inicio.ejs', {message: req.flash('loginMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/projects', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/projects', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.email = null;
        user.password = null;
        user.save()
            .then(function () {
                res.redirect('/projects');
            })
            .catch(function () {
                res.redirect('/projects');
            });
    });

// route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
};