'use strict';

angular.module('cvsApp').controller('RecruitersCtrl', ['$scope', 'Restangular',

  function($scope, Restangular) {
    Restangular.all('recruiters').getList().then(function(recruiters) {
      $scope.recruitersCollection = recruiters;
      $scope.recruitersDisplayedCollection = [].concat($scope.recruitersCollection);
    });
  }

]);