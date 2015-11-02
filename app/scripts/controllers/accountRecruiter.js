'use strict';

angular.module('cvsApp').controller('AccountRecruiterCtrl',
  ['$scope','Upload','ENV','Restangular',
    function($scope,Upload,ENV, Restangular) {

      $scope.user = $scope.$parent.user;
      $scope.accountPopover = {templateUrl: 'popover.html'};

      $scope.documents = [];

      $scope.form = {
        documents: false,
        documentIsBeingSent: false
      };

      $scope.setSelectedAccountInterview = function(interview) {
        $scope.selectedAccountInterview = interview;
      };

      $scope.$watch('form.documents', function() {
        $scope.uploadDocuments($scope.form.documents);
      });

      $scope.uploadDocuments = function(files) {
        /*jshint -W083 */
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            $scope.form.documentIsBeingSent = true;
            var file = files[i];
            Upload.upload({
              url: ENV.apiEndpoint + '/documents',
              file: file,
              data:{
                'user':$scope.user.ido},
              sendFieldsAs: 'form',
              skipAuthorization: true
            }).success(function(document) {
              console.log(document);
              $scope.documents.push(document);

              console.log($scope.documents);
              $scope.form.documentIsBeingSent = false;
            }).error(function(data, status, headers, config) {
              console.log('ERROR', data, status, headers, config);
              $scope.form.documentIsBeingSent = false;
            });
          }
        }
      };

      // Documents
      Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
        $scope.documents = documents.plain();
      });

      $scope.deleteDocument = function(document) {
        Restangular.one("documents", document.ido).remove().then(function() {
          $scope.documents.splice($scope.documents.indexOf(document), 1);
          });
      };

    }

  ]
);