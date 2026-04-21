app.controller('AuthController', function($scope, $http, $location, Auth) {
  $scope.username = ''; $scope.password = ''; $scope.error = ''; $scope.role = 'student';
  $scope.login = function() {
    if (!$scope.username || !$scope.password) { $scope.error = 'Please enter username and password.'; return; }
    $http.post('http://127.0.0.1:8000/api/auth/login/', { username:$scope.username, password:$scope.password })
    .then(function(res) {
      var payload = JSON.parse(atob(res.data.access.split('.')[1]));
      Auth.save(res.data.access, $scope.username, payload.is_staff);
      $location.path(payload.is_staff ? '/instructor/dashboard' : '/student/dashboard');
    }, function() { $scope.error = 'Invalid username or password.'; });
  };
});
