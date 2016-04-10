'use strict';

var userCanEditAndSubmit = loggedInUsername === viewedUsername;

angular.module('todo-app.todo-api-handler', [])
  .service('todoService', function($http) {
    this.createTodo = function($scope, $rootScope) {
      var todo = $scope.todo, todoService = this;
      var queryString = '/api/users/' + encodeURIComponent(loggedInUsername) + 
        '/todos/?description=' + todo.description +  '&done=' + todo.done + 
        '&starred=' + todo.starred;

      $http.post(queryString)
        .success(function(data, status, headers, config) {
          if(data.error) {
            $scope.error = data.error;
            $scope.success = '';
            $scope.todos = {};
          } else {
            $scope.error = '';
            $scope.success = 'New todo successfully created!';
            $scope.todo = data.todo;
            $rootScope.$broadcast('todoCreated');
          }
        })
        .error(function(data, status, headers, config) {
          $scope.error = 'A server error occurred while fetching todos.';
          $scope.success = '';
          $scope.todo = {};
        });
    };

  	this.fetchTodos = function($scope, todoType) {
  		var queryString = '/api/users/' + encodeURIComponent(viewedUsername) + 
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
      if(!userCanEditAndSubmit) {
        $scope.error = "That's not your todo!";
        return;
      }

      var todo = $scope.todo;
      var queryString = '/api' + rootPath + encodeURIComponent(todo._id) + 
        '/?description=' + todo.description +  '&done=' + todo.done + 
        '&starred=' + todo.starred;

      $http.patch(queryString)
        .success(function(data, status, headers, config) {
          if(data.error) {
            $scope.success = '';
            $scope.error = data.error;
          } else {
            $scope.success = 'Todo successfully updated!';
            $scope.error = '';
            $scope.todo.completedAt = data.todo.completedAt;
          }
        })
        .error(function(data, status, headers, config) {
          $scope.error = 'A server error occurred while fetching todos.';
          $scope.success = '';
        });
    };
  });

angular.module('todo-app.todo-ctrl', ['todo-app.todo-api-handler'])
	.controller('TodoCtrl', function($location, $rootScope, $scope, todoService) {
    $scope.todo = $scope.todo || { description: '', done: false, starred: false};
    $scope.todo.descriptionEditable = false, $scope.error = '';

    $scope.userCanEditAndSubmit = userCanEditAndSubmit;

    $scope.todo.create = function() {
      todoService.createTodo($scope, $rootScope);
    };

    $scope.todo.toggleDescriptionEditable = function() {
      $scope.todo.descriptionEditable = !$scope.todo.descriptionEditable;
    };

		$scope.todo.update = function() {
			todoService.updateTodo($scope, $location.path().slice(1));
		};
	});

angular.module('todo-app.todos-ctrl', ['todo-app.todo-api-handler'])
	.controller('TodosCtrl', function($location, $rootScope, $scope, todoService) {
    
    $scope.viewedUsername = window.viewedUsername;
    
    // Freely browse someone else's todos if they send a link; clicking the 
    // orange tutu home icon in the upper left corner automatically switches
    // the app's rootPath to correspond to the current user again.
    if(rootPath !== $location.path() && ~$location.path().indexOf('/api/users')) {
      window.rootPath = $location.path();
    }

		todoService.fetchTodos($scope, $location.path().slice(1));

    $rootScope.$on('todoCreated', function(event) {
      todoService.fetchTodos($scope, $location.path().slice(1));
    });
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
