define(['app'], function (app) {
    app.controller('ProfileHomeController', ['$scope', '$rootScope', '$location', '$http', '$timeout',
        function ($scope, $rootScope, $location, $http, $timeout) {
            $scope.formData = {};
            $rootScope.showError = false;
            $rootScope.doFade = false;
            //Cambiar contraseña
            $scope.changePass = function () {

                $http.post('/api/changepass/', $scope.formData).then(function (response) {
                    $scope.showError = false;
                    $scope.doFade = false;
                    $scope.showError = true;
                    $scope.message = response.data.mess;
                    $timeout(function () {
                        $scope.doFade = true;
                        $scope.showError = false;
                    }, 2500);
                    $scope.custom = true;
                    $scope.formData = {};
                    //  $location.url('/Profile');

                }).catch(function (response) {
                    $scope.showError = false;
                    $scope.doFade = false;
                    $scope.showError = true;


                    $timeout(function () {
                        $scope.doFade = true;
                        $scope.showError = false;
                    }, 2500);


                });

            };
            //Toggle
            $scope.custom = true;
            $scope.toggleCustom = function () {
                $scope.custom = $scope.custom === false ? true : false;
            };

            //Password match directive       
        }])
        .directive('pwCheck', [function () {
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.pwCheck;
                    elem.add(firstPassword).on('keyup', function () {
                        scope.$apply(function () {
                            var v = elem.val() === $(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            }
        }]);


});
