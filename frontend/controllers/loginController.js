app.controller('LoginController', function($scope, $http, $location) {
  $scope.username = '';
  $scope.password = '';
  $scope.error = '';

  $scope.login = function() {
    if (!$scope.username || !$scope.password) {
      $scope.error = 'Please enter your username and password.';
      return;
    }

    $http.post('http://127.0.0.1:8000/api/auth/login/', {
      username: $scope.username,
      password: $scope.password
    }).then(function(response) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('username', $scope.username);

      try {
        var payload = JSON.parse(atob(response.data.access.split('.')[1]));
        var isStaff = payload.is_staff || false;
        localStorage.setItem('is_staff', isStaff ? 'true' : 'false');
        localStorage.setItem('user_role', isStaff ? 'instructor' : 'student');

        if (isStaff) {
          $location.path('/instructor/dashboard');
        } else {
          $location.path('/student/dashboard');
        }
      } catch(e) {
        $scope.error = 'Error processing token. Please try again.';
      }
    }, function(error) {
      $scope.error = 'Invalid username or password. Please try again.';
    });
  };
});