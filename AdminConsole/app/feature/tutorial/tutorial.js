/**
 * Created by matt_hung on 2015/9/7.
 */

module_tutorial.compileProvider.directive('keyboardKeys', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope) {
            var keydown = function (e) {
                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$emit('arrow-up');
                }
                if (e.keyCode === 40) {
                    e.preventDefault();
                    scope.$emit('arrow-down');
                }
            };
            $document.on('keydown', keydown);
            scope.$on('$destroy', function () {
                $document.off('keydown', keydown);
            });
        }
    }
}]);

module_tutorial.registerCtrl('MainController', ['$scope', '$window', function ($scope, $window) {
    var index = parseInt($window.location.hash.slice(1), 10);
    $scope.snapAnimation = false; // turn animation off for the initial snap on page load
    if (index && angular.isNumber(index)) {
        $scope.snapIndex = index;
    } else {
        $scope.snapIndex = 0;
    }
    $scope.$on('arrow-up', function () {
        $scope.$apply(function () {
            $scope.snapIndex--;
        });
    });
    $scope.$on('arrow-down', function () {
        $scope.$apply(function () {
            $scope.snapIndex++;
        });
    });
    $scope.swipeUp = function () {
        $scope.snapIndex++;
    };
    $scope.swipeDown = function () {
        $scope.snapIndex--;
    };
    $scope.afterSnap = function (snapIndex) {
        $scope.snapAnimation = true; // turn animations on after the initial snap
        $window.location.hash = snapIndex;
    };
}]);

module_tutorial.registerCtrl('CallbacksController', ['$scope', function ($scope) {
    $scope.beforeSnapMessages = [];
    $scope.afterSnapMessages = [];
    $scope.beforeCallback = function (snapIndex) {
        $scope.beforeSnapMessages.push('Snapping to index ' + snapIndex);
        if (snapIndex === 4) {
            $scope.beforeSnapMessages.push('Snapping to index 4 disabled');
            return false;
        }
    };
    $scope.afterCallback = function (snapIndex) {
        $scope.afterSnapMessages.push('Just snapped to index ' + snapIndex);
    };
}]);

module_tutorial.registerCtrl('NestedSnapscrollController', ['$scope', function ($scope) {
    // these min and max values are only hardcoded for demonstration
    var minNestedSnapIndex = 0,
        maxNestedSnapIndex = 4;
    $scope.nestedSnapIndex = 0;
    $scope.swipeUp = function ($event) {
        if ($scope.nestedSnapIndex + 1 <= maxNestedSnapIndex) {
            $scope.nestedSnapIndex++;
            $event.stopPropagation();
        }
        // else, allow bubbling up since this instance is already scrolled to the end
    };
    $scope.swipeDown = function ($event) {
        if ($scope.nestedSnapIndex - 1 >= minNestedSnapIndex) {
            $scope.nestedSnapIndex--;
            $event.stopPropagation();
        }
        // else, allow bubbling up since this instance is already scrolled to the end
    };
}]);