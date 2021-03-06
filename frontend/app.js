define([
    'angularAMD',
    'angular_route',
    'angular_css',
    'angular_middle',
    'UsersServices',
    'u_datatables',
    'angular_upload',
], function (angularAMD) {

    var app = angular.module("iDoo",
        [
            'angularFileUpload',
            'ultimateDataTableServices',
            'ngRoute',
            'door3.css',
            'UsersServices',
            'middle'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/",
                angularAMD.route({
                    templateUrl: 'app/main/_HomeView.html',
                    controller: 'HomeController'
                })
            )

            .when("/UsersList",
                angularAMD.route({
                    templateUrl: 'app/users/users_list/_UsersListView.html',
                    controller: 'UsersController',
                    css: 'app/users/users_list/_UsersList.css'
                })
            )

            .when("/NewUser",
                angularAMD.route({
                    templateUrl: 'app/users/user_new/_NewUserView.html',
                    controller: 'UsersController',
                    css: ['app/users/user_new/_NewUser.css', 'app/users/user_new/cropAvatar.css', 'libs/cropper/cropper.min.css']
                })
            )

            .when("/UserLogin",
                angularAMD.route({
                    templateUrl: 'app/main/_HomeView.html',
                    controller: 'HomeController',
                    css: ['app/users/user_login/_UserLogin.css']
                })
            )
            .when("/UserRegister",
                angularAMD.route({
                    templateUrl: 'app/main/_HomeView.html',
                    controller: 'HomeController',
                    css: ['app/users/user_login/_UserLogin.css']
                })
            )
            .when("/UserHome/:userId",
                angularAMD.route({
                    templateUrl: 'app/users/user_home/_UserHomeView.html',
                    controller: 'UsersController',
                    css: ['app/users/user_new/_NewUser.css', 'app/users/user_home/_UserHome.css', 'app/users/user_new/cropAvatar.css', 'libs/cropper/cropper.min.css']
                })
            )
            .when("/Projects",
                angularAMD.route({
                    templateUrl: 'app/projects/projects_home/_ProjectsHomeView.html',
                    controller: 'ProjectsHomeController',
                    css: ['libs/Ultimate-DataTable/dist/3.3.1-SNAPSHOT/css/ultimate-datatable-3.3.1-SNAPSHOT.min.css', 'app/projects/projects_new/_ProjectsNew.css'] // fix this
                })
            )
            .when("/Project",
                angularAMD.route({
                    templateUrl: 'app/projects/projects_new/_ProjectsNewView.html',
                    controller: 'ProjectsNewController',
                    css: ['app/projects/projects_new/_ProjectsNew.css', 'libs/fancybox/jquery.fancybox.min.css', 'libs/videojs/video-js.css'] // fix this
                })
            )
            .when("/Users",
                angularAMD.route({
                    templateUrl: 'app/users/user_home/_UsersHomeView.html',
                    controller: 'UserHomeController',
                    css: ['libs/Ultimate-DataTable/dist/3.3.1-SNAPSHOT/css/ultimate-datatable-3.3.1-SNAPSHOT.min.css'],// fix this

                })
            )
            .when("/User",
                angularAMD.route({
                    templateUrl: 'app/users/user_new/_UsersNewView.html',
                    controller: 'UsersEditController',
                    css: ['app/projects/projects_new/_ProjectsNew.css'] // fix this
                })
            )
            .when("/Clients",
                angularAMD.route({
                    templateUrl: 'app/clients/client_home/_ClientsHomeView.html',
                    controller: 'ClientHomeController',
                    css: ['libs/Ultimate-DataTable/dist/3.3.1-SNAPSHOT/css/ultimate-datatable-3.3.1-SNAPSHOT.min.css']// fix this
                })
            )
            .when("/Client",
                angularAMD.route({
                    templateUrl: 'app/clients/clients_new/_ClientsNewView.html',
                    controller: 'ClientsNewController',
                    css: ['app/projects/projects_new/_ProjectsNew.css']
                })
            )
            .when("/Profile",
                angularAMD.route({
                    templateUrl: 'app/profile/profile_home/_ProfileHomeView.html',
                    controller: 'ProfileHomeController',
                    css: ['app/projects/projects_new/_ProjectsNew.css']
                })
            )
    });

    return angularAMD.bootstrap(app);
});