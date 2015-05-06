var app = angular.module('Comment',[]);

	app.controller('add_comment', function($scope){
		//$scope.comment_input='';
		$scope.list=["This is the first comment!",
			"Here's the second one!",
			"And this is one more.",
			"Here is another one!"];
		$scope.add = function(data){
			$scope.list.push(data);			
		}
	});