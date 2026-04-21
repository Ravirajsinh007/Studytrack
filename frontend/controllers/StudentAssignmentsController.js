app.controller('StudentAssignmentsController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.filterCourse = '';
  $scope.assignmentStatus = 'pending';
  $scope.expandedAssignment = null;
  $scope.selectedAssignment = null;
  $scope.selectedFile = null;
  $scope.submitSuccess = false;
  $scope.submitError = '';
  $scope.submitForm = {};
  $scope.courses = [];
  $scope.assignments = [];
  $scope.completedCount = 0;
  $scope.pendingCount = 0;

  function formatDate(dateString) {
    if (!dateString) return '';
    var d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function isOverdue(assignment) {
    if (assignment.submitted) return false;
    var due = new Date(assignment.due_date);
    return due < new Date();
  }

  function updateCounts() {
    $scope.completedCount = $scope.assignments.filter(function(a) { return a.submitted; }).length;
    $scope.pendingCount = $scope.assignments.filter(function(a) { return !a.submitted; }).length;
    console.log('[Assignments] Updated counts - Total:', $scope.assignments.length, 'Completed:', $scope.completedCount, 'Pending:', $scope.pendingCount);
  }

  $scope.statusFilter = function(assignment) {
    if ($scope.assignmentStatus === 'pending') return !assignment.submitted;
    if ($scope.assignmentStatus === 'completed') return assignment.submitted;
    return true;
  };

  $scope.toggleDetails = function(a) {
    if ($scope.expandedAssignment && $scope.expandedAssignment.id === a.id) {
      $scope.expandedAssignment = null;
      $scope.selectedAssignment = null;
      $scope.selectedFile = null;
      $scope.submitSuccess = false;
      $scope.submitError = '';
      $scope.submitForm = {};
    } else {
      $scope.expandedAssignment = a;
      $scope.selectedAssignment = a;
      $scope.selectedFile = null;
      $scope.submitSuccess = false;
      $scope.submitError = '';
      $scope.submitForm = {};
    }
  };

  $scope.triggerFileInput = function(assignmentId){
    var input = document.getElementById('fileInput-' + assignmentId);
    if (input) input.click();
  };

  $scope.onFileSelect = function(input){
    if (input.files && input.files[0]) {
      $scope.selectedFile = input.files[0];
      $scope.$apply();
    }
  };

  $scope.submitAssignment = function(){
    if (!$scope.selectedAssignment) { $scope.submitError = 'Please select an assignment first.'; return; }
    if (!$scope.selectedFile) { $scope.submitError = 'Please select a file to submit.'; return; }
    var fd = new FormData();
    fd.append('file', $scope.selectedFile);
    fd.append('notes', $scope.submitForm.notes || '');
    var token = Auth.getToken();
    $http.post('http://127.0.0.1:8000/api/assignments/' + $scope.selectedAssignment.id + '/submit/', fd, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': undefined },
      transformRequest: angular.identity
    }).then(function(response) {
      var assignment = $scope.selectedAssignment;
      assignment.submitted = true;
      assignment.submission_id = response.data.id;
      assignment.submission_file_url = response.data.file_url;
      assignment.submission_status = response.data.status;
      assignment.submission_marks = response.data.marks_obtained;
      assignment.submission_date = response.data.submitted_at;
      updateCounts();
      $scope.submitSuccess = true;
      setTimeout(function() {
        $scope.expandedAssignment = null;
        $scope.$apply();
      }, 1800);
    }, function() {
      $scope.submitError = 'Submission failed. Make sure backend is running.';
    });
  };

  $scope.openSubmission = function(a) {
    $scope.toggleDetails(a);
  };

  var token = Auth.getToken();
  var user = Auth.getUser();
  console.log('[Assignments-Init] User:', user, 'HasToken:', !!token);
  
  $http.get('http://127.0.0.1:8000/api/students/submissions/', { headers: Auth.headers() }).then(function(response) {
    var submissions = response.data || [];
    console.log('[Assignments-SubAPI] Returned:', submissions.length, 'submissions');
    submissions.forEach(function(s, i) {
      console.log('  [', i, '] Student:', s.student_name, 'Assignment:', s.assignment_title, 'Status:', s.status);
    });
    var submissionMap = {};
    submissions.forEach(function(sub) {
      submissionMap[sub.assignment] = sub;
    });
    $http.get('http://127.0.0.1:8000/api/assignments/', { headers: Auth.headers() }).then(function(r) {
      if (r.data && r.data.length) {
        console.log('[Assignments-AssignAPI] Returned:', r.data.length, 'assignments');
        $scope.assignments = r.data.map(function(item) {
          var submitted = !!submissionMap[item.id];
          var submission = submissionMap[item.id] || {};
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            course: item.course_title,
            due_date: formatDate(item.due_date),
            raw_due_date: item.due_date,
            max_marks: item.max_marks,
            submitted: submitted,
            overdue: isOverdue({ due_date: item.due_date, submitted: submitted }),
            submission_id: submission.id,
            submission_file_url: submission.file_url,
            submission_status: submission.status,
            submission_marks: submission.marks_obtained,
            submission_date: submission.submitted_at,
            submission_feedback: submission.feedback
          };
        });
        $scope.courses = Array.from(new Set($scope.assignments.map(function(a) { return a.course; }))).map(function(title) { return { title: title }; });
        updateCounts();
      }
    }, function() {});
  }, function() {
    $http.get('http://127.0.0.1:8000/api/assignments/', { headers: Auth.headers() }).then(function(r) {
      if (r.data && r.data.length) {
        $scope.assignments = r.data.map(function(item) {
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            course: item.course_title,
            due_date: formatDate(item.due_date),
            raw_due_date: item.due_date,
            max_marks: item.max_marks,
            submitted: false,
            overdue: isOverdue({ due_date: item.due_date, submitted: false }),
            submission_id: null,
            submission_file_url: null,
            submission_status: null,
            submission_marks: null,
            submission_date: null,
            submission_feedback: null
          };
        });
        $scope.courses = Array.from(new Set($scope.assignments.map(function(a) { return a.course; }))).map(function(title) { return { title: title }; });
        updateCounts();
      }
    }, function() {});
  });
});
