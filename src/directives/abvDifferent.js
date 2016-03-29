angular.module('angular.bootstrap.validator')
  .directive('abvDifferent', () => ({
    restrict: 'A',
    scope: {
      targetModel: '=abvDifferent'
    },
    require: 'ngModel',
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.abvDifferent = modelValue => modelValue !== scope.targetModel

      scope.$watch('targetModel', () => {
        ngModel.$validate()
      })
    }
  }))
