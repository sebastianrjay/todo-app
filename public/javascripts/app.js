'use strict';

angular.module('todo-app.todo-fetcher', [])
  .service('todoFetcher', function($http) {
  	this.fetchTodos = function($scope, todoType) {
  		var queryString = '/api/users/' + encodeURIComponent(username) + 
  			'/todos/?todoType=' + todoType;

  		$http.get(queryString)
  			.success(function(data, status, headers, config) {
  				if(data.error) {
  					$scope.error = data.error;
  					$scope.todos = {};
  				} else {
  					$scope.error = '';
  					$scope.todos = data.todos;
  				}
  			})
  			.error(function(data, status, headers, config) {
  				$scope.error = 'A server error occurred while fetching todos.';
  				$scope.todos = {};
  			});
  	};

  	this.toggleDone = function() {

  	};
  });

angular.module('todo-app.todo-ctrl', ['todo-app.todo-fetcher'])
	.controller('TodoCtrl', function($scope, todoFetcher) {
		$scope.todo.toggleDone = function() {
			
		};
	});

angular.module('todo-app.todos-ctrl', ['todo-app.todo-ctrl'])
	.controller('TodosCtrl', function($location, $scope, todoFetcher) {
    // Freely browse someone else's todos if they send a link; clicking the 
    // orange tutu home icon in the upper left corner automatically switches
    // the app's rootPath to correspond to the current user again.
    if(rootPath !== $location.path()) window.rootPath = $location.path();

		$scope.todos = todoFetcher.fetchTodos($scope, $location.path().slice(1));
	});

angular.module('todo-app', [
 	'ngRoute',
 	'todo-app.todo-ctrl',
 	'todo-app.todos-ctrl',
	'todo-app.todo-fetcher'
]);

angular.module('todo-app')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "/templates/todos.html"
      })
      .when('/:someSelectionCriteria', {
        templateUrl: "/templates/todos.html"
      });
  });
