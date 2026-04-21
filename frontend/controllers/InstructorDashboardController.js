app.controller('InstructorDashboardController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.goAnnounce = function(){ $location.path('/instructor/announcements'); };
  $scope.totalStudents = 0;
  $scope.pendingGrades = 0;
  $scope.classAvg = 0;
  $scope.courses = [];
  $scope.pendingList = [];
  $scope.announcements = [];

  function mapStatusLabel(status) {
    if (status === 'under_review') return 'Under Review';
    if (status === 'resubmit') return 'Resubmit';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  $http.get('http://127.0.0.1:8000/api/courses/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      var colors = ['blue', 'teal', 'amber', 'purple', 'green'];
      var icons = ['⚙️', '🌐', '🗄️', '🔧', '📊'];
      $scope.courses = response.data.map(function(course, index) {
        return {
          id: course.id,
          title: course.title,
          students: course.student_count || 0,
          modules: course.module_count || 0,
          submissions: 0,
          avg: 0,
          color: colors[index % colors.length],
          icon: icons[index % icons.length]
        };
      });
      $scope.totalStudents = $scope.courses.reduce(function(sum, course) {
        return sum + (course.students || 0);
      }, 0);
    }
  }, function() {});

  $http.get('http://127.0.0.1:8000/api/courses/analytics/', { headers: Auth.headers() }).then(function(response) {
    if (response.data) {
      $scope.classAvg = response.data.avg || 0;
      var analytics = response.data.courses || [];
      $scope.courses = $scope.courses.map(function(course) {
        var analyticsItem = analytics.find(function(item) { return item.id === course.id; });
        if (analyticsItem) {
          course.avg = analyticsItem.avg || 0;
        }
        return course;
      });
    }
  }, function() {});

  $http.get('http://127.0.0.1:8000/api/submissions/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      var pending = response.data.filter(function(sub) { return sub.status !== 'graded'; });
      $scope.pendingGradesCount = pending.length;
      $scope.pendingList = pending.slice(0, 5).map(function(sub, index) {
        return {
          student: sub.student_name,
          assignment: sub.assignment_title,
          course: sub.course,
          student_name: sub.student_name,
          assignment_title: sub.assignment_title,
          initials: (sub.student_name || '').split(' ').map(function(p) { return p[0]; }).join('').substring(0, 2).toUpperCase(),
          color: ['a', 'b', 'c', 'd', 'e'][index % 5]
        };
      });
      var submissionsByCourse = {};
      response.data.forEach(function(sub) {
        submissionsByCourse[sub.course] = (submissionsByCourse[sub.course] || 0) + 1;
      });
      $scope.courses.forEach(function(course) {
        course.submissions = submissionsByCourse[course.title] || 0;
      });
    }
  }, function() {});

  $http.get('http://127.0.0.1:8000/api/announcements/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      $scope.announcements = response.data.map(function(ann) {
        return {
          id: ann.id,
          course_title: ann.course_title || 'Course',
          title: ann.title,
          message: ann.message,
          created_at: ann.created_at
        };
      });
    }
  }, function() {});

  $scope.getUngraded = function() {
    if (!$scope.selectedCourse) return [];
    // Filter submissions for the selected course that are not graded
    return $scope.pendingList.filter(function(sub) {
      return sub.course === $scope.selectedCourse.title;
    });
  };

  $scope.selectCourse = function(course) {
    $scope.selectedCourse = course;
  };
});
