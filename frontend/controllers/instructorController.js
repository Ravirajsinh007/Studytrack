app.controller('InstructorController', function($scope, $http, $location) {
  var token = localStorage.getItem('access_token');
  var userRole = localStorage.getItem('user_role');

  if (!token || userRole !== 'instructor') {
    $location.path('/login');
    return;
  }

  $scope.username = localStorage.getItem('username') || 'Instructor';
  $scope.selectedCourse = null;
  $scope.newAnnouncement = { title: '', message: '' };

  $scope.logout = function() {
    localStorage.clear();
    $location.path('/login');
  };

  // ================= DASHBOARD =================
  
  // Fetch instructor courses
  $http.get('http://127.0.0.1:8000/api/courses/', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(function(response) {
    if (response.data && response.data.length > 0) {
      $scope.courses = response.data.map(function(c, i) {
        var colors = ['blue', 'teal', 'amber', 'purple'];
        var icons = ['⚙️', '🌐', '🗄️', '🔧'];
        return {
          id: c.id,
          title: c.title,
          description: c.description,
          instructor_name: c.instructor_name,
          module_count: c.module_count || 0,
          color: colors[i % colors.length],
          icon: icons[i % icons.length]
        };
      });
      
      // Load first course details
      if ($location.path() === '/instructor/grading' && $scope.courses.length > 0) {
        $scope.selectCourse($scope.courses[0]);
      }
    }
  }, function(error) {
    console.log('Error loading courses:', error);
  });

  // Fetch announcements
  $http.get('http://127.0.0.1:8000/api/courses/announcements/', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(function(response) {
    $scope.allAnnouncements = response.data || [];
    $scope.announcements = $scope.allAnnouncements.slice(0, 3);
  }, function() {
    $scope.announcements = [];
  });

  // ================= GRADING MANAGEMENT =================

  $scope.selectCourse = function(course) {
    $scope.selectedCourse = course;
    $scope.loadSubmissions(course.id);
  };

  $scope.loadSubmissions = function(courseId) {
    $http.get('http://127.0.0.1:8000/api/assignments/instructor/course/' + courseId + '/', {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(response) {
      $scope.submissions = response.data || [];
      
      // Count pending grades
      $scope.pendingGradesCount = $scope.submissions.filter(function(s) {
        return s.status !== 'graded';
      }).length;
    }, function(error) {
      console.log('Error loading submissions:', error);
      $scope.submissions = [];
    });
  };

  $scope.openGradeModal = function(submission) {
    $scope.editingSubmission = angular.copy(submission);
    $scope.showGradeModal = true;
  };

  $scope.closeGradeModal = function() {
    $scope.showGradeModal = false;
    $scope.editingSubmission = null;
  };

  $scope.submitGrade = function() {
    if (!$scope.editingSubmission.marks_obtained && $scope.editingSubmission.marks_obtained !== 0) {
      alert('Please enter marks');
      return;
    }

    $http.patch('http://127.0.0.1:8000/api/assignments/grade/' + $scope.editingSubmission.id + '/', {
      marks_obtained: $scope.editingSubmission.marks_obtained,
      feedback: $scope.editingSubmission.feedback || ''
    }, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(response) {
      alert('Submission graded successfully!');
      $scope.closeGradeModal();
      if ($scope.selectedCourse) {
        $scope.loadSubmissions($scope.selectedCourse.id);
      }
    }, function(error) {
      alert('Error: ' + (error.data.error || 'Failed to grade submission'));
    });
  };

  // ================= ANNOUNCEMENTS MANAGEMENT =================

  $scope.createAnnouncement = function() {
    if (!$scope.newAnnouncement.title || !$scope.newAnnouncement.message) {
      alert('Please fill in all fields');
      return;
    }

    if (!$scope.selectedCourse) {
      alert('Please select a course');
      return;
    }

    $http.post('http://127.0.0.1:8000/api/courses/announcements/create/', {
      course_id: $scope.selectedCourse.id,
      title: $scope.newAnnouncement.title,
      message: $scope.newAnnouncement.message
    }, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(response) {
      alert('Announcement created successfully!');
      $scope.newAnnouncement = { title: '', message: '' };
      $scope.showAnnouncementModal = false;
      
      // Refresh announcements
      $http.get('http://127.0.0.1:8000/api/courses/announcements/', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(function(response) {
        $scope.allAnnouncements = response.data || [];
        $scope.announcements = $scope.allAnnouncements.slice(0, 3);
      });
    }, function(error) {
      alert('Error: ' + (error.data.error || 'Failed to create announcement'));
    });
  };

  $scope.openAnnouncementModal = function() {
    $scope.showAnnouncementModal = true;
  };

  $scope.closeAnnouncementModal = function() {
    $scope.showAnnouncementModal = false;
    $scope.newAnnouncement = { title: '', message: '' };
  };

  // ================= FILTER FUNCTIONS =================

  $scope.getUngraded = function() {
    return $scope.submissions ? $scope.submissions.filter(function(s) {
      return s.status !== 'graded';
    }) : [];
  };

  $scope.getGraded = function() {
    return $scope.submissions ? $scope.submissions.filter(function(s) {
      return s.status === 'graded';
    }) : [];
  };

  $scope.getStatusClass = function(status) {
    switch(status) {
      case 'graded': return 'status-graded';
      case 'under_review': return 'status-pending';
      case 'submitted': return 'status-submitted';
      default: return '';
    }
  };
});