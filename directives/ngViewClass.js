angular.module('newApp')
  .directive('ngViewClass', function($location) {
    return {
      link: function(scope, element, attrs, controllers) {
        var classes = attrs.ngViewClass ? attrs.ngViewClass.replace(/ /g, '').split(',') : [];
        setTimeout(function() {
          if ($(element).hasClass('ng-enter')) {
            for (var i = 0; i < classes.length; i++) {
              var route = classes[i].split(':')[1];
              var newclass = classes[i].split(':')[0];

              if (route === $location.path()) {
                $(element).addClass(newclass);
              } else {
                $(element).removeClass(newclass);
              }
            }
          }
        })

      }
    };
  }).directive('customValidationName', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function(inputValue) {

          var transformedInput = inputValue.replace(/[^\u4e00-\u9fa5\w]+/g, ''); //只保留中文
          // var transformedInput = inputValue.replace(/[\w]+/g, '');

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  }).directive('customValidationVal', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function(inputValue) {

          var transformedInput = inputValue.replace(/[\W]+/g, '');

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });
