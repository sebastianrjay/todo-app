'use strict';

angular.module('todo-app.todo-api-handler', [])
  .service('todoFetcher', function($http) {
    this.createTodo = function($scope) {
      var todo = $scope.todo;
      var queryString = '/api/users/' + encodeURIComponent(username) + 
        '/todos/?description=' + todo.description +  '&done=' + todo.done + 
        '&starred=' + todo.starred;;

      $http.post(queryString)
        .success(function(data, status, headers, config) {
          if(data.error) {
            $scope.error = data.error;
            $scope.todos = {};
          } else {
            $scope.error = '';
            $scope.todo = data.todo;
          }
        })
        .error(function(data, status, headers, config) {
          $scope.error = 'A server error occurred while fetching todos.';
          $scope.todo = {};
        });
    };

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

  	this.updateTodo = function($scope) {
      var todo = $scope.todo;
      var queryString = '/api' + rootPath + encodeURIComponent(todo._id) + 
        '/?description=' + todo.description +  '&done=' + todo.done + 
        '&starred=' + todo.starred;

      $http.patch(queryString)
        .success(function(data, status, headers, config) {
          if(data.error) {
            $scope.error = data.error;
            console.log('error');
          } else {
            $scope.error = '';
            $scope.todo.completedAt = data.todo.completedAt;
          }
        })
        .error(function(data, status, headers, config) {
          $scope.error = 'A server error occurred while fetching todos.';
          console.log('A server error occurred while fetching todos.');
        });
    };
  });

angular.module('todo-app.todo-ctrl', ['todo-app.todo-api-handler'])
	.controller('TodoCtrl', function($scope, todoFetcher) {
    $scope.todo = $scope.todo || { description: '', done: false, starred: false};
    $scope.todo.editable = false, $scope.error = '';

    $scope.todo.create = function() {
      todoFetcher.createTodo($scope);
    };

    $scope.todo.toggleEditable = function() {
      $scope.todo.editable = !$scope.todo.editable;
    };

		$scope.todo.update = function() {
			todoFetcher.updateTodo($scope);
		};
	});

angular.module('todo-app.todos-ctrl', ['todo-app.todo-ctrl'])
	.controller('TodosCtrl', function($location, $scope, todoFetcher) {
    
    $scope.username = window.username;
    
    // Freely browse someone else's todos if they send a link; clicking the 
    // orange tutu home icon in the upper left corner automatically switches
    // the app's rootPath to correspond to the current user again.
    if(rootPath !== $location.path() && ~$location.path().indexOf('/api/users')) {
      window.rootPath = $location.path();
    }

		todoFetcher.fetchTodos($scope, $location.path().slice(1));
	});

angular.module('todo-app', [
 	'ngRoute',
 	'todo-app.todo-ctrl',
 	'todo-app.todos-ctrl',
	'todo-app.todo-api-handler'
]);

angular.module('todo-app')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/:someSelectionCriteria', {
        templateUrl: "/templates/todos.html"
      });
  });
