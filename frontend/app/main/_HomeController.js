define(['app'], function (app) {
    app.controller('HomeController', ['$scope', '$rootScope', '$location', '$log', '$http', 'Users', '$timeout',
        function ($scope, $rootScope, $location, $log, $http, Users, $timeout) {


            $scope.showError = false;
            $scope.doFade = false;
            // var bgImagesList = ['01.jpg',
            //     '02.jpg', '03.jpg', '04.jpg',
            //     '05.jpg', '06.jpg', '07.jpg',
            //     '08.jpg', '09.jpg', '10.jpg',
            //     '11.jpg'];
            // var bgimg = bgImagesList[Math.floor(Math.random() * bgImagesList.length)];

            // $rootScope.setBackground = function () {
            //     return {
            //         'background-image': 'url(assets/img/backgrounds/' + bgimg + ')'
            //     }
            // };
            $scope.formData = {};

            /*  if ($rootScope.user) {
             $scope.user = $rootScope.user;
             if ($scope.user.role == 0) {
             $scope.user.role_admin = true;
             } else {
             $scope.user.role_default = true;
             }
             console.log($scope.user);
             $scope.login = 'Sign Out';
             $scope.register = 'User Settings';
             } else {*/
            $scope.login = 'Autenticar';
            $scope.register = 'Registrar';
            // }


            /*  $scope.userRegister = function () {
             if (!$rootScope.user) {
             $location.url('/NewUser')
             } else {
             $location.url('api/login' + $rootScope.user._id)
             }
             };*/

            $scope.userLogin = function () {
                //  if (!$rootScope.user) {
                $http.post('/api/login/', $scope.formData).then(function (response) {
                    $rootScope.user = response.config.data.email;
                    $location.url('/Profile');
                }).catch(function (response) {
                    $scope.showError = false;
                    $scope.doFade = false;
                    $scope.showError = true;

                    $scope.authmessage = response.data;

                    $timeout(function () {
                        $scope.doFade = true;
                        $scope.showError = false;
                    }, 2500);


                });


            };
            $scope.userRegister = function () {
                //  if (!$rootScope.user) {
                $http.post('/api/register/', $scope.formData).then(function (response) {
                    $rootScope.user = response.config.data.email;

                    $location.url('/Profile');
                }).catch(function (response) {
                    $scope.showError = false;
                    $scope.doFade = false;
                    $scope.showError = true;

                    $scope.authmessage = response.data;

                    $timeout(function () {
                        $scope.doFade = true;
                        $scope.showError = false;
                    }, 2500);


                });

            };


        }]);
});