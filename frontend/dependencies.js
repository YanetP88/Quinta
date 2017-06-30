require.config({
    baseUrl: '/',
    paths: {
        jquery: 'libs/jquery/dist/jquery.min',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',

        angular: 'libs/angular/angular',
        angularAMD: 'libs/angularAMD/dist/angularAMD.min',
        ngload: 'libs/angularAMD/dist/ngload.min',
        angular_animate: 'libs/angular-animate/angular-animate.min',
        angular_resource: 'libs/angular-resource/angular-resource',
        angular_route: 'libs/angular-route/angular-route',
        angular_css: 'libs/angular-css/angular-css',
        angular_middle: 'libs/angular-middle/angular-middle',
        angular_upload: 'libs/angular-file-upload/dist/angular-file-upload.min',
        es5_shim: 'libs/es5-shim/es5-shim.min',
        es5_sham: 'libs/es5-shim/es5-sham.min',
        cropper: 'libs/cropper/cropper',
        u_datatables: 'libs/Ultimate-DataTable/dist/3.3.1-SNAPSHOT/js/ultimate-datatable-3.3.1-SNAPSHOT.min',
        moment: 'libs/moment/min/moment.min',
        fancybox: 'libs/fancybox/jquery.fancybox.min',
        videojsie8: 'libs/videojs/videojs-ie8.min',
        videojs: 'libs/videojs/videojs',

        // APP MODULES SERVICE, CONTROLLERS, and PERSONAL SCRIPTS
        // HOME
        HomeController: 'app/main/_HomeController',
        HomeServices: 'app/main/_HomeServices',
        //HomeDirectives      : 'app/main/_HomeDirectives',
        //PROFILE
        ProfileHomeController: 'app/profile/profile_home/_ProfileHomeController',
        ProfileDirectives: 'app/profile/profile_home/_ProfileDirectives',
        // USERS
        UsersController: 'app/users/_UsersController',
        UsersLoginController: 'app/users/_UsersLoginController',
        UsersServices: 'app/users/_UsersServices',
        UserHomeController: 'app/users/user_home/_UserHomeController',
        UsersEditController: 'app/users/user_new/_UsersEditController',
        // CLIENTS
        ClientHomeController: 'app/clients/client_home/_ClientHomeController',
        ClientsNewController: 'app/clients/clients_new/_ClientsNewController',
        //PROJECTS
        ProjectsHomeController: 'app/projects/projects_home/_ProjectsHomeController',
        ProjectsNewController: 'app/projects/projects_new/_ProjectsNewController',


        //  MapsNewController            : 'app/maps/_MapsNewController'

    },
    shim: {
        jquery: {
            exports: '$'
        },
        angular: ['jquery'],
        bootstrap: ['jquery'],
        cropper: ['jquery', 'bootstrap'],
        u_datatables: ['jquery', 'bootstrap', 'moment'],
        angularAMD: ['angular'],
        ngload: ['angularAMD'],
        angular_animate: ['angular'],
        angular_resource: ['angular'],
        angular_route: ['angular'],
        angular_css: ['angular', 'angular_route'],
        angular_middle: ['angular'],
        angular_upload: ['angular', 'bootstrap', 'es5_shim', 'es5_sham'],
        videojs: ['videojsie8']
    },
    deps: ['app']
});