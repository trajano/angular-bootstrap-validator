angular.module('angular.bootstrap.validator')
  .directive('abvIdentical', () => ({
    restrict: 'A',
    scope: {
      targetModel: '=abvIdentical'
    },
    require: 'ngModel',
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.abvIdentical = modelValue => modelValue === scope.targetModel

      scope.$watch('targetModel', () => {
        ngModel.$validate()
      })
    }
  }))
