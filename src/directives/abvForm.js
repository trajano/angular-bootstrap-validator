/* globals $ */
angular.module('angular.bootstrap.validator')
  .directive('abvForm', $compile => {
    function addNameNgModelToControlAndGetControlName(controlElement) {
      var control = $(controlElement)
      var controlName = control.attr('name')
      if (!controlName) {
        controlName = control.attr('id')
        control.attr('name', controlName)
      }
      if (!control.attr('ng-model') && !control.data('ng-model')) {
        control.attr('ng-model', controlName)
      }
      return controlName

    }

    function ngClassAttribute(formName, controlName) {
      return `{'has-success': ${formName}.$submitted && ${formName}.${controlName}.$valid, 'has-error': ${formName}.$submitted && ${formName}.${controlName}.$invalid }`
    }

    return {
      require: 'form',
      restrict: 'A',
      terminal: true,
      compile: () => (scope, element, attr, controller) => {
        // reset form function
        scope.resetForm = function() {
          controller.$commitViewValue()
          controller.$setPristine()
        }

        var formName = controller.$name

        // disable submit buttons when the form is invalid after submit
        element.find('button[type="submit"]').attr('ng-disabled', `${formName}.$submitted && ${formName}.$invalid`)

        // associate the reset button with the reset form function
        element.find('button[type="reset"]').attr('ng-click', 'resetForm()')

        // disable native form validation because the validation is handled by Angular
        element.attr('novalidate', 'novalidate')

        // for each form-control in a form group
        element.find('.form-group').each((index, formGroup) => {
          var controls = $(formGroup).find('.form-control')
          // Only input text areas should have feedback, textarea must not have feedback
          // only support one control per form-group as per Bootstrap CSS examples
          controls.each((index, control) => {
            // set the name. and ng-model appropriately
            var controlName = addNameNgModelToControlAndGetControlName(control)

            // add feedback icons
            if ($(formGroup).hasClass('has-feedback')) {
              angular.element(control).after(`<span class="glyphicon form-control-feedback" ng-class="{'glyphicon-ok' : ${formName}.${controlName}.$valid, 'glyphicon-remove' : ${formName}.${controlName}.$invalid }" ng-if="${formName}.$submitted" aria-hidden="true"></span>`)
            }

            // set the has-error CSS if the form has been submitted
            angular.element(formGroup).attr('ng-class', ngClassAttribute(formName, controlName))
          })
        })

        // for each checkbox, wrap in a container div
        element.find('.checkbox').each((index, checkbox) => {
          var controls = $(checkbox).find('input[type="checkbox"]')
          if (controls.length === 1) {
            // set the name. and ng-model appropriately
            var controlName = addNameNgModelToControlAndGetControlName(controls[0])
            angular.element(checkbox).wrap(`<div ng-class="${ngClassAttribute(formName, controlName)}"></div>`)
          }
        })
        $compile(element.contents())(scope)
      }
    }
  })
