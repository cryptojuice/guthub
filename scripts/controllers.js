var app = angular.module('guthub', ['guthub.directives', 'guthub.services', 'firebase']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {

        templateUrl:'/guthub/views/list.html',
        controller: 'ListCtrl'

    }).when('/guthub/edit/:recipeId', {

        templateUrl:'/guthub/views/recipeForm.html',
        controller: 'EditCtrl'

    }).when('/guthub/view/:recipeId', {

        templateUrl:'/guthub/views/viewRecipe.html',
        controller: 'ViewCtrl'

    }).when('/guthub/new', {

        templateUrl: '/guthub/views/recipeForm.html',
        controller: 'NewCtrl'

    }).otherwise({redirectTo:'/'})
});



app.controller('ListCtrl', ['$scope', 'angularFire', function($scope, angularFire) {
    var url = "https://guthub.firebaseio.com/recipes";
    var promise = angularFire(url, $scope, 'recipes');
}]);

app.controller('ViewCtrl', ['$scope', '$location', 'angularFire', '$route', function($scope, $location, angularFire, $route) {
    var recipeId = $route.current.params.recipeId;
    var url = "https://guthub.firebaseio.com/recipes/" + recipeId;
    var promise = angularFire(url, $scope, 'recipe', {});

    $scope.edit = function() {
        $location.path('/edit/' + $scope.recipe.id);
    };
}]);

app.controller('EditCtrl', ['$scope', '$location', 'angularFire', '$route', function($scope, $location, angularFire, $route) {
    var recipeId = $route.current.params.recipeId;
    var url = "https://guthub.firebaseio.com/recipes/" + recipeId;
    var promise = angularFire(url, $scope, 'recipe', {});
    $scope.remove = function(recipe) {
        $scope.recipe = null;
    };

    $scope.save = function() {
        $location.path('/view/' + $scope.recipe.id);
    };
}]);

app.controller('NewCtrl', ['$scope', '$location', 'angularFire', function($scope, $location, angularFire) {
    var url = "https://guthub.firebaseio.com/recipes";
    angularFire(url, $scope, 'recipes', []).then(function(){

        $scope.recipe = {
            id:$scope.recipes.length, 
            description:"", 
            ingredients:[{amount:"", amountUnits:"", ingredientName:""}], 
            instructions:"",
            title:""
        };

        $scope.save = function() {
            $scope.recipes.push($scope.recipe);
            $location.path('/view/' + $scope.recipe.id);
        };
    });
}]);

app.controller('IngredientsCtrl', ['$scope', function($scope) {
    $scope.addIngredient = function() {
        var ingredients = $scope.recipe.ingredients;
        if(ingredients.length){
            ingredients[ingredients.length] = {};
        } else {
            ingredients[0] = {};
        }
    };
    $scope.removeIngredient = function(index) {
        $scope.recipe.ingredients.splice(index, 1);
    };
}]);
