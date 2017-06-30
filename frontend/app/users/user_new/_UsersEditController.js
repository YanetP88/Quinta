define(['app', 'angular_upload'], function (app) {
    app.controller('UsersEditController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', '$timeout',
        function ($scope, $rootScope, $routeParams, $location, $http, $timeout) {
            $rootScope.showError = false;
            $rootScope.doFade = false;

            $scope.formData = {};
            $scope.action = "Actualizar";

            $scope.Back = function () {
                $('#myModal').modal('hide');
                $(".modal-backdrop").hide();
                $location.url('/Users');
            };

            $http.get('/api/users/' + $routeParams.id).then(function (response) {
                user_data = response.data;

                //user_data.createdAt = response.data.createdAt;

                $scope.formData = user_data;

                console.log(user_data)
            });
            if ($routeParams.id) {
                $scope.updateUser = function () {


                    $http.post('/api/users/' + $routeParams.id, $scope.formData).then(function (response) {
                        $rootScope.showError = false;
                        $rootScope.doFade = false;
                        $rootScope.showError = true;

                        $rootScope.successmessage = response.data.mess;

                        $timeout(function () {
                            $rootScope.doFade = true;
                            $rootScope.showError = false;
                        }, 2500);

                        $location.url('/Users');


                    });
                }
            }

        }
    ])
});
