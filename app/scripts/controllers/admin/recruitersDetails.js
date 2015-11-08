'use strict';

angular.module('cvsApp').controller('AdminRecruitersDetailsCtrl', ['$scope', '$state', 'Restangular','Upload','ENV',
  function($scope, $state, Restangular, Upload, ENV) {

    $scope.recruiter = {};
    $scope.user = {};
    $scope.companies = [];
    $scope.recruiterInterviews = {};
    $scope.documents = [];

    $scope.form = {
      documents: false,
      documentIsBeingSent: false
    };


    function refreshInterviews() {
      Restangular.one('interviews/recruiter', $scope.recruiter.ido).get().then(function(recruiterInterviews) {
        $scope.recruiterInterviews = recruiterInterviews.plain();
      });
      console.log($scope.user.ido);

      console.log('Interviews refreshed');
    }

    // Documents
    function getDocuments() {
      Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
        $scope.documents = documents.plain();
      });
    };

    // Recruiter details
    Restangular.one("recruiters", $state.params.id).get().then(function(recruiter) {
      $scope.recruiter = recruiter;
      $scope.user = recruiter.user;
      getDocuments();
      // Interviews
      refreshInterviews();
    });

    // Companies
    Restangular.all('companies').getList().then(function(companies) {
      $scope.companies = companies;
    });

    // Saving updated recruiter
    $scope.updateRecruiter = function() {
      $scope.recruiter.put();
    };

    $scope.freeInterview = function(interview) {
      Restangular.one("interviews", interview.ido).customPOST(undefined, 'free')
        .then(function() {
          refreshInterviews();
        });
    };

    $scope.deleteInterview = function(interview) {
      Restangular.one('interviews', interview.ido).remove().then(function() {
        refreshInterviews();
      });
    };

    $scope.createInterview = function(interview) {
      Restangular.all('interviews').customPOST({slot: interview.slot.ido, recruiter: $scope.recruiter.ido})
        .then(function() {
          refreshInterviews();
        });
    };

    $scope.bookInterview = function(interview) {
      console.log(interview);
      //TODO
    };

    $scope.$watch('form.documents', function() {
      $scope.uploadDocuments($scope.form.documents);
    });

    $scope.uploadDocuments = function(files) {
/*      $scope.form.documentIsBeingSent = true;
      console.log($scope.user);
      //DocumentService.uploadDocuments();
      $scope.form.documentIsBeingSent = false;*/
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
            $scope.documents.push(document);
            $scope.form.documentIsBeingSent = false;
          }).error(function(data, status, headers, config) {
            console.log('ERROR', data, status, headers, config);
            $scope.form.documentIsBeingSent = false;
          });
        }
      }
    };

    $scope.deleteDocument = function(document) {
      Restangular.one("documents", document.ido).remove().then(function() {
        $scope.documents.splice($scope.documents.indexOf(document), 1);
      });
    };

    $scope.downloadDocument = function(document) {
      Restangular.one("documents/request-token", document.ido).get().then(function(download) {
        window.open(ENV.apiEndpoint + '/documents/' + download.plain().token);
      });
    };

  }
]);