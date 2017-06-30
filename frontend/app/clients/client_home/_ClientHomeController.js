define(['app', 'u_datatables'], function (app) {
    app.controller('ClientHomeController', ['$scope', '$rootScope', '$location', '$http', 'datatable',
        function ($scope, $rootScope, $location, $http, datatable) {


            $scope.formData = {};

            var datatableConfig = {
                "name": "simple_datatable",
                "columns": [

                    {
                        "header": "Usuario",
                        "property": "user",
                        "type": "text",
                    },


                    {
                        "header": "Nombre",
                        "property": "name",
                        "type": "text",
                    },


                    {
                        "header": "Apellidos",
                        "property": "last_name",
                        "type": "text",

                    },

                    {
                        "header": "Email",
                        "property": "email",
                        "type": "email",
                    },


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
                        return '/api/clients/' + value.id;
                    }
                },

                "edit": {
                    "active": true,//Active or not
                    "withoutSelect": false, //edit all line without selected it								
                    "showButton": true,//Show the edit button in the toolbar
                    "showLineButton": false, // Show the edit buttons left of each line
                    "columnMode": true,//Edit column
                    "byDefault": false, //Set in edit mode when the datatable is build
                    "lineMode": function (line) {
                        return boolean;
                    } //function used to define if line is editable
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
                        $location.url('/Client?id=' + user.id);
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
            $http.get('/api/clients').then(function (response) {
                console.log(response.data);
                $scope.clients = response.data;

                $scope.datatable = datatable(datatableConfig);
                $scope.datatable.setData($scope.clients);

            });

        }])

});
