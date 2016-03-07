var NG_HIDE_CLASS = 'ng-hide';
var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

angular.module('angular.bootstrap.validator', [])
  .directive('abvIdentical', function() {
    return {
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
      terminal: true,
      compile: (element, attrs) => {
        return {
          pre: (scope, element, attr, controller) => {
            var formName = controller.$name;
            var formNameSubmittedAnd = formName + '.$submitted && ';

            // disable submit buttons when the form is invalid after submit
            element.find('button[type="submit"]').attr("ng-disabled", formNameSubmittedAnd + formName + '.$invalid');
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
                if (!control.attr('ng-model') && !control.attr('data-ng-model')) {
                  control.attr('ng-model', controlName);
                }

                // add feedback icons
                if ($(formGroup).hasClass('has-feedback')) {
                  control.after('<span class="glyphicon glyphicon-ok form-control-feedback" ng-if="' + formNameSubmittedAnd + formName + '.' + controlName + '.$valid' + '" aria-hidden="true"></span>');
                  control.after('<span class="glyphicon glyphicon-remove form-control-feedback" ng-if="' + formNameSubmittedAnd + formName + '.' + controlName + '.$invalid' + '" aria-hidden="true"></span>');
                }

                $(formGroup).attr('ng-class', '{"has-error": ' + formNameSubmittedAnd + formName + '.' + controlName + '.$invalid }');
                // help blocks for error messages

                $(formGroup).find('.help-block[data-abv-error],.help-block[abv-error]').each((index, helpBlock) => {
                  var errorField = $(helpBlock).attr('data-abv-error');
                  if (!errorField) {
                    errorField = $(helpBlock).attr('abv-error');
                  }
                  $(helpBlock).attr('ng-show', formNameSubmittedAnd + formName + '.' + controlName + '.$error.' + errorField);
                });
              }
              //                          element.unbind();
            });
            //       element.removeAttr('abv-form');
            //$compile(element.contents())(scope);

            // disable native form validation because the validation is handled by Angular
          },
          post: (scope, element, attr, controller) => {
            var formName = attr.name;
            var formNameSubmittedAnd = formName + '.$submitted && ';
            $compile(element.contents())(scope);
          }
        };
      }
    };
  });