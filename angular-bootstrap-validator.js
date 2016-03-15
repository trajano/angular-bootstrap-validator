angular.module('angular.bootstrap.validator', [])
  .directive('abvError', function($animate) {
    return {
      restrict: 'A',
      scope: {
        validatorName: '@abvError',
        controlName: '@abvModel'
      },
      require: '^form',
      terminal: true,
      link: (scope, element, attrs, form) => {
        var controlName;
        if (scope.controlName) {
          controlName = scope.controlName;
        } else {
          if (element.siblings('.form-control')[0]) {
            controlName = element.siblings('.form-control')[0].name;
          } else {
            controlName = element.parent().find('input[type="checkbox"]')[0].name;
          }
        }
        var formName = `$parent.${form.$name}`;
        var watchExpr = `${formName}.$submitted && ${formName}.${controlName}.$error.${scope.validatorName}`;
        scope.$watch(watchExpr, (value) => {
          $animate[value ? 'removeClass' : 'addClass'](element, 'ng-hide', {
            tempClasses: 'ng-hide-animate'
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
    function addNameNgModelToControlAndGetControlName(controlElement) {
      var control = $(controlElement);
      var controlName = control.attr('name');
      if (!controlName) {
        controlName = control.attr('id');
        control.attr('name', controlName);
      }
      if (!control.attr('ng-model') && !control.data('ng-model')) {
        control.attr('ng-model', controlName);
      }
      return controlName;

    }

    function ngClassAttribute(formName, controlName) {
      return `{'has-success': ${formName}.$submitted && ${formName}.${controlName}.$valid, 'has-error': ${formName}.$submitted && ${formName}.${controlName}.$invalid }`;
    }

    return {
      require: 'form',
      restrict: 'A',
      terminal: true,
      compile: () => {
        return (scope, element, attr, controller) => {
          // reset form function
          scope.resetForm = function() {
            controller.$commitViewValue();
            controller.$setPristine();
          };

          var formName = controller.$name;

          // disable submit buttons when the form is invalid after submit
          element.find('button[type="submit"]').attr("ng-disabled", `${formName}.$submitted && ${formName}.$invalid`);

          // associate the reset button with the reset form function
          element.find('button[type="reset"]').attr("ng-click", "resetForm()");

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
              var controlName = addNameNgModelToControlAndGetControlName(controls[0]);

              // add feedback icons
              if ($(formGroup).hasClass('has-feedback')) {
                control.after(`<span class="glyphicon form-control-feedback" ng-class="{'glyphicon-ok' : ${formName}.${controlName}.$valid, 'glyphicon-remove' : ${formName}.${controlName}.$invalid }" ng-if="${formName}.$submitted" aria-hidden="true"></span>`);
              }

              // set the has-error CSS if the form has been submitted
              $(formGroup).attr('ng-class', ngClassAttribute(formName, controlName));
            }
          });

          // for each checkbox, wrap in a container div
          element.find('.checkbox').each((index, checkbox) => {
            var controls = $(checkbox).find('input[type="checkbox"]');
            if (controls.length == 1) {
              // set the name. and ng-model appropriately
              var controlName = addNameNgModelToControlAndGetControlName(controls[0]);
              $(checkbox).wrap(`<div ng-class="${ngClassAttribute(formName, controlName)}"></div>`);
            }
          });
          $compile(element.contents())(scope);
        };
      }
    };
  });
