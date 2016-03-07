(function() {
  'use strict';
  var NG_HIDE_CLASS = 'ng-hide';
  var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

  angular.module('angular.bootstrap.validator', [])
    .directive('abvError', function($animate, $compile, $interpolate) {
      return {
        restrict: 'A',
        scope: {
          validatorName: '@abvError'
        },
        require: '^form',
        terminal: true,
        link: (scope, element, attrs, form) => {
          var controlName = element.siblings('.form-control')[0].name;
          var formName = `$parent.${form.$name}`;
          var watchExpr = `${formName}.$submitted && ${formName}.${controlName}.$error.${scope.validatorName}`;
          scope.$watch(watchExpr, (value) => {
            $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
              tempClasses: NG_HIDE_IN_PROGRESS_CLASS
            });
          });
        }
      };
    })
    .directive('abvIdentical', function() {
      return {
        restrict: 'A',
        scope: {
          targetModel: '=abvIdentical'
        },
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {

          ngModel.$validators.abvIdentical = function(modelValue) {
            return modelValue == scope.targetModel;
          };

          scope.$watch("targetModel", function() {
            ngModel.$validate();
          });
        }

      };
    })
    .directive('abvDifferent', function() {
      return {
        restrict: 'A',
        scope: {
          targetModel: '=abvDifferent'
        },
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {

          ngModel.$validators.abvDifferent = function(modelValue) {
            return modelValue != scope.targetModel;
          };

          scope.$watch("targetModel", function() {
            ngModel.$validate();
          });
        }

      };
    })
    .directive('abvForm', function($compile) {
      return {
        require: 'form',
        restrict: 'A',
        terminal: true,
        compile: function(tElement, tAttrs) {
          return (scope, element, attr, controller) => {
            var formName = controller.$name;

            // disable submit buttons when the form is invalid after submit
            element.find('button[type="submit"]').attr("ng-disabled", `${formName}.$submitted && ${formName}.$invalid`);

            // disable native form validation because the validation is handled by Angular
            element.attr('novalidate', 'novalidate');

            // for each form-control in a form group
            element.find('.form-group').each((index, formGroup) => {
              var controls = $(formGroup).find('.form-control');
              // Only input text areas should have feedback, textarea must not have feedback
              // only support one control per form-group as per Bootstrap CSS examples
              if (controls.length == 1) {
                // set the name. and ng-model appropriately
                var control = $(controls[0]);
                var controlName = control.attr('name');
                if (!controlName) {
                  controlName = control.attr('id');
                  control.attr('name', controlName);
                }
                if (!control.attr('ng-model') && !control.data('ng-model')) {
                  control.attr('ng-model', controlName);
                }

                // add feedback icons
                if ($(formGroup).hasClass('has-feedback')) {
                  control.after(`<span class="glyphicon glyphicon-ok form-control-feedback" ng-if="${formName}.$submitted && ${formName}.${controlName}.$valid" aria-hidden="true"></span>`);
                  control.after(`<span class="glyphicon glyphicon-remove form-control-feedback" ng-if="${formName}.$submitted && ${formName}.${controlName}.$invalid" aria-hidden="true"></span>`);
                }

                // set the has-error CSS if the form has been submitted
                $(formGroup).attr('ng-class', `{"has-error": ${formName}.$submitted && ${formName}.${controlName}.$invalid }`);
              }
            });
            $compile(element.contents())(scope);
          };
        }
      };
    });
})();