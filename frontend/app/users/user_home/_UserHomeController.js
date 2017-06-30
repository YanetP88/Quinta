define(['app', 'u_datatables'], function (app) {
    app.controller('UserHomeController', ['$scope', '$rootScope', '$location', '$http', 'datatable',
        function ($scope, $rootScope, $location, $http, datatable) {
            $scope.formData = {};

            var datatableConfig = {
                "name": "simple_datatable",
                "columns": [

                    {
                        "header": "Alias",
                        "property": "user",
                        "type": "text",
                    },


                    {
                        "header": "Nombre",
                        "property": "name",
                        "type": "text",
                    },
                    {
                        "header": "Email",
                        "property": "email",
                        "type": "email",
                    },
                    {
                        "header": "Bloqueado",
                        "property": "status",
                        "type": "boolean",

                    },

                    {
                        "header": "Tipo",
                        "property": "type",
                        "type": "checkbox",

                    },
                    {
                        "header": "Rol",
                        "property": "role",
                        "type": "text",

                    }


                ],
                "edit": {
                    "active": true,
                    "columnMode": true
                },
                "filter": {
                    "active": true,
                    "highlight": true,
                    "columnMode": false
                },
                "pagination": {
                    "mode": 'local',
                    "bottom": true,
                    "numberRecordsPerPageList": [{
                        number: 10,
                        clazz: ''
                    }, {
                        number: 25,
                        clazz: ''
                    }]
                },
                "order": {
                    "mode": 'local'
                },
                "remove": {
                    "active": true,
                    "mode": 'remote',
                    "url": function (value) {
                        return '/api/users/' + value.id;
                    }
                },
                "block": {
                    "active": true,
                    "url": function (value) {
                        return '/api/users/' + value.id;
                    }
                },


                "compact": true,
                "hide": {
                    "active": true,
                    "byDefault": [
                        // "address",
                        // "description"
                    ]
                },
                "show": {
                    "active": true,
                    "showButton": true,
                    "add": function (user) {
                        $location.url('/User?id=' + user.id);
                    }
                },
                "select": {
                    "active": true,//Active or not
                    "showButton": true,//Show the select all button in the toolbar,
                },
                "mouseevents": {
                    "active": true,
                    "clickCallback": function (line, data) {
                        console.log("callback select : " + data.name);
                    }
                }
            };

            //GET ALL USERS
            $http.get('/api/users').then(function (response) {
                console.log(response.data);
                $scope.users = response.data;

                $scope.datatable = datatable(datatableConfig);
                $scope.datatable.setData($scope.users);
            });

        }])

});
