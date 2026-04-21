app.controller('StudentCoursesController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.courses = [];
  $scope.expandedCourse = null;

  $scope.toggleCourse = function(course) {
    if ($scope.expandedCourse && $scope.expandedCourse.id === course.id) {
      $scope.expandedCourse = null;
    } else {
      $scope.expandedCourse = course;
    }
  };

  var colors = ['blue', 'teal', 'amber', 'purple', 'green'];
  var icons = ['⚙️', '🌐', '🗄️', '🔧', '📊'];

  $http.get('http://127.0.0.1:8000/api/courses/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      $scope.courses = response.data.map(function(course, index) {
        return {
          id: course.id,
          title: course.title,
          instructor: course.instructor_name || 'Instructor',
          modules: course.modules || [],
          moduleCount: course.module_count || (course.modules ? course.modules.length : 0),
          color: colors[index % colors.length],
          icon: icons[index % icons.length]
        };
      });
    }
  }, function() {
    // keep existing behavior if API fails
  });
});
