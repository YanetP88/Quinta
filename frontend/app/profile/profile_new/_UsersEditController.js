define(['app', 'angular_upload'], function (app) {
    app.controller('UsersEditController', ['$scope', '$rootScope', '$routeParams', '$location', '$http',
        function ($scope, $rootScope, $routeParams, $location, $http) {

            $scope.formData = {};
            //$scope.formData.images = [];
            $scope.action = "Update";

            // var file_to_delete = [];


            $http.get('/api/users/' + $routeParams.id).then(function (response) {
                user_data = response.data;

                user_data.createdAt = response.data.createdAt;
                /* project_data.creation_date = new Date(response.data.creation_date);
                 project_data.registry_date = new Date(response.data.registry_date);
                 project_data.construction_time = new Date(response.data.construction_time);*/
                $scope.formData = user_data;

                // imgs = $scope.formData.images.split(',').filter(function(n){ return n != "" });

                // $scope.formData.images = imgs;

                $scope.action = "Update";
                console.log(user_data)
            });
            $scope.createUser = function () {
                if ($routeParams.id) {

                    $http.post('/api/users/' + $routeParams.id, $scope.formData).then(function (response) {

                        $location.url('/Users');
                        $scope.messages = 'Hola';
                    });
                }
            }


            // FILTERS

            // an async filter

            // CALLBACKS


        }
    ])
});
