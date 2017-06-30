define(['app'], function (app) {

    app.controller('ClientsNewController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', '$timeout',
        function ($scope, $rootScope, $routeParams, $location, $http, $timeout) {
            $rootScope.showError = false;
            $rootScope.doFade = false;

            $scope.formData = {};

            $scope.action = "Crear";


            if ($routeParams.id) {
                $http.get('/api/clients/' + $routeParams.id).then(function (response) {
                    console.log(response.data);
                   client_data = response.data;

                    client_data.last_access_date = new Date(response.data.last_access_date);
                    
                    $scope.formData = client_data;

                    $scope.action = "Actualizar";

                    console.log(client_data)

                });
            }
            $scope.Back = function () {

                //       data-dismiss="modal" 
                $('#myModal').modal('hide');
                $(".modal-backdrop").hide();
                $location.url('/Clients');

            };

            $scope.createClient = function () {
                if ($routeParams.id) {
                    $http.post('/api/clients/' + $routeParams.id, $scope.formData).then(function (err, response) {
                        //$rootScope.successmessage=response.data.mess;

                        $rootScope.showError = false;
                        $rootScope.doFade = false;
                        $rootScope.showError = true;

                        $rootScope.message = response.data.mess;

                        $timeout(function () {
                            $scope.doFade = true;
                            $scope.showError = false;
                        }, 2500);
                        $location.url('/Clients');

                    });
                } else {
                    $http.post('/api/clients', $scope.formData).then(function (err, response) {
                        // $scope.formData = {};

                        $rootScope.successmessage = response.data.mess;
                        // alert(response.data.mess);
                        $location.url('/Clients', response.data.mess);
                    });
                }


            };


            // CALLBACKS


        }])
})