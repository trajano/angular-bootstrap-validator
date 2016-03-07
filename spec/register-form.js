angular.module('registerForm', ['angular.bootstrap.validator'])
  .controller('MyFormController', function($scope) {
    this.update = function(form) {
      if (form.$valid) {
            console.log($scope.email);
      console.log($scope.password);
      }
    };
  });