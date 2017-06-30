define(['app', 'angular_upload', 'fancybox'], function (app) {
    app.controller('ProjectsNewController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'FileUploader', '$timeout',
        function ($scope, $rootScope, $routeParams, $location, $http, FileUploader, $timeout) {


            $rootScope.showError = false;
            $rootScope.doFade = false;


            $scope.formData = {};

            $scope.formData.images = [];
            $scope.formData.videos = [];
            videos = [];
            $scope.action = "Crear";

            $scope.Back = function () {

                //       data-dismiss="modal"
                $('#myModal').modal('hide');
                $(".modal-backdrop").hide();
                $location.url('/Projects');

            };

            var file_to_delete = [];

            if ($routeParams.id) {
                $http.get('/api/projects/' + $routeParams.id).then(function (response) {
                    project_data = response.data;

                    project_data.creation_date = new Date(response.data.creation_date);
                    project_data.registry_date = new Date(response.data.registry_date);

                    $scope.formData = project_data;

                    imgs = $scope.formData.images.split(',').filter(function (n) {
                        return n != ""
                    });
                    $scope.formData.images = imgs;

                    vids = $scope.formData.videos.split(',').filter(function (n) {
                        return n != ""
                    });
                    $scope.formData.videos = [];
                    ;
                    vids.forEach(function (video) {
                        the_video = {'video': '/video/' + video, 'thumb': '/thumbnail/' + video};
                        ;
                        $scope.formData.videos.push(the_video);
                    });
                    $scope.action = "Actualizar";
                    console.log($scope.formData.videos);
                    //  $location.url('/Projects');
                })
                    .catch(function (response) {

                    });

            }

            angular.element('[data-fancybox="images"]').fancybox({
                // Options will go here
            });

            angular.element('[data-fancybox="videos"]').fancybox({
                // Options will go here
            });


            $scope.createProject = function () {
                if ($routeParams.id) {
                    $http.post('/api/projects/' + $routeParams.id, $scope.formData).then(function (response) {

                        $rootScope.showError = false;
                        $rootScope.doFade = false;
                        $rootScope.showError = true;

                        $rootScope.successmessage = response.data.mess;

                        $timeout(function () {
                            $rootScope.doFade = true;
                            $rootScope.showError = false;
                        }, 2500);

                        $location.url('/Projects');
                    })

                } else {
                    $http.post('/api/projects', $scope.formData).then(function (response) {
                        // $scope.formData = {};

                        $rootScope.showError = false;
                        $rootScope.doFade = false;
                        $rootScope.showError = true;

                        $rootScope.successmessage = response.data.mess;

                        $timeout(function () {
                            $rootScope.doFade = true;
                            $rootScope.showError = false;
                        }, 2500);

                        // alert(response.data.mess);
                        $location.url('/Projects');
                    });
                }

                if (file_to_delete.length != 0) {
                    file_to_delete.map(function (file) {
                        $http.post('/delete_file', {file: file}).then(function (res, req) {
                            console.log('file ' + file + 'Deleted');
                        })
                    })
                }
            };

            $scope.deleteImage = function (image) {
                var index = $scope.formData.images.indexOf(image);
                if (index > -1) {
                    $scope.formData.images.splice(index, 1);
                    file_to_delete.push(image);
                }
            };

            $scope.deleteVideo = function (video) {
                console.log($scope.formData.videos);
                ;
                for (var i = 0; i < $scope.formData.videos.length; i++) {
                    console.log($scope.formData.videos[i]);
                    ;

                    if ($scope.formData.videos[i]['video'] === video) {
                        $scope.formData.videos.splice(i, 1);
                        console.log($scope.formData.videos)
                    }
                }
                file_to_delete.push(video);
            };


            //IMAGE UPLOAD
            $scope.view_images_uploader = false;
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload_file',
                method: 'POST',
                alias: 'files',
                data: $scope.formData
            });

            // FILTERS

            // a sync filter
            uploader.filters.push({
                name: 'syncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    // console.log('syncFilter');
                    return this.queue.length < 10;
                }
            });

            // an async filter
            uploader.filters.push({
                name: 'asyncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                    // console.log('asyncFilter');
                    setTimeout(deferred.resolve, 1e3);
                }
            });

            // CALLBACKS

            uploader.onAfterAddingFile = function (fileItem) {
                $scope.view_images_uploader = true;
                // console.info('onAfterAddingFile', fileItem);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $scope.formData.images.push(response.file);
            };
            uploader.onCompleteAll = function () {
                uploader.clearQueue();
                console.info('Uploaded ALL');
                $scope.view_images_uploader = false;
            };

            console.info('uploader', uploader);

            //VIDEO UPLOAD
            $scope.view_videos_uploader = false;
            var uploader2 = $scope.uploader2 = new FileUploader({
                url: '/upload_file',
                method: 'POST',
                alias: 'files',
                data: $scope.formData
            });

            // FILTERS

            // a sync filter
            uploader2.filters.push({
                name: 'syncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    // console.log('syncFilter');
                    return this.queue.length < 10;
                }
            });

            // an async filter
            uploader2.filters.push({
                name: 'asyncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                    // console.log('asyncFilter');
                    setTimeout(deferred.resolve, 1e3);
                }
            });

            // CALLBACKS

            uploader2.onAfterAddingFile = function (fileItem) {
                $scope.view_videos_uploader = true;
                // console.info('onAfterAddingFile', fileItem);
            };
            uploader2.onCompleteItem = function (fileItem, response, status, headers) {
                video = response.file;
                ;
                the_video = {'video': '/video/' + video, 'thumb': '/thumbnail/' + video};
                ;
                $scope.formData.videos.push(the_video);
            };
            uploader2.onCompleteAll = function () {
                uploader2.clearQueue();
                console.info('Uploaded ALL');
                $scope.view_videos_uploader = false;
            };

            console.info('uploader2', uploader2);


        }
    ]).directive('ngThumb', ['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
});
