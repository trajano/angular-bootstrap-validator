angular.module('angular.bootstrap.validator')
  .directive('abvError', ($animate, $log) => ({
    restrict: 'A',
    scope: {
      validatorName: '@abvError',
      oldControlName: '@abvModel',
      controlName: '@abvFor'
    },
    require: '^form',
    terminal: true,
    link: (scope, element, attrs, form) => {
      var controlName
      if (scope.oldControlName) {
        $log.warn('abv-model is deprecated use abv-for')
        scope.controlName = scope.oldControlName
      }
      if (scope.controlName) {
        controlName = scope.controlName
      } else {
        if (element.siblings('.form-control')[0]) {
          controlName = element.siblings('.form-control')[0].name
        } else {
          controlName = element.parent().find('input[type="checkbox"]')[0].name
        }
      }
      var formName = `$parent.${form.$name}`
      var watchExpr = `${formName}.$submitted && ${formName}.${controlName}.$error.${scope.validatorName}`
      scope.$watch(watchExpr, value => {
        $animate[value ? 'removeClass' : 'addClass'](element, 'ng-hide', {
          tempClasses: 'ng-hide-animate'
        })
      })
    }
  }))
