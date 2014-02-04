var facts = angular.module('facts', []);

function mainController($scope, $http) {
	$scope.formData = {};


	//when landing on the page, get all facts and show them
	$http.get('/api/facts')
		.success(function(data) {
			console.log(data);
			$scope.allFacts = data;

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/facts', $scope.formData)
			.success(function(data) {
				$('input[type=text],textarea').val('');
				$scope.insert = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
		    });
	};

	// delete a facts after checking it
	$scope.deleteTodo = function(id) {

		$http.delete('/api/facts/' + id)
			.success(function(data) {
				$scope.deleted = data;
				$("#"+id).fadeOut();

			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	// edit a facts after checking it
	$scope.editTodo = function(id,facts) {
      $http.put('/api/facts', facts)
		.success(function(data) {
			$scope.updated = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	    });
	};
}
