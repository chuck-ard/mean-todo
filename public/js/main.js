/**
 * Created by chuck on 8/31/16.
 */
var app = angular.module('WebTodo', []);

app.controller('MainController', function($scope, $http) {
    $http.get("/tasks")
        .success(function(response){
            $scope.tasks = response;
        });
    $scope.remove = function(id) {
        $http.delete("/task/" + id)
            .success(function(response) {
                $scope.tasks = response;
            });
    };
    $scope.addTask = function() {
        $http.post("/task", $scope.todo)
            .success(function (response) {
                $scope.tasks = response;
                $scope.todo.title = "";
                $scope.todo.description = "";
                $scope.todo.due = "";
                $scope.todo.priority = "";
                $scope.todo.status = "";
            });
    };
    $scope.todo = {
        title: "",
        description: "",
        due: "",
        priority: "",
        status: ""
    };
    $scope.priorityLevels = ["Low", "Moderate", "High", "Oh SHIT!"];
    $scope.statusLevels = ["Not Started", "In Progress", "Almost Done", "Completed"];
});