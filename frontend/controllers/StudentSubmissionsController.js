app.controller('StudentSubmissionsController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.statusFilter = '';
  $scope.selectedSub = null;
  $scope.submissions = [];
  $scope.loadingSubmissions = true;

  function formatDate(dateString) {
    if (!dateString) return '';
    var d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function capitalizeStatus(status) {
    var map = {
      'graded': 'Graded',
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'resubmit': 'Resubmit',
      'pending': 'Submitted'
    };
    return map[status] || status;
  }

  function formatMarks(submission) {
    if (submission.marks_obtained !== null && submission.assignment_max_marks) {
      return submission.marks_obtained + '/' + submission.assignment_max_marks;
    }
    return null;
  }

  var token = Auth.getToken();
  var user = Auth.getUser();
  console.log('[Submissions-Init] User:', user, 'Token:', token ? 'YES' : 'NO');

  $scope.viewSubmission = function(sub) {
    console.log('[Submissions] Viewing submission:', sub.title);
    $scope.selectedSub = sub;
  };

  $scope.closeModal = function() {
    console.log('[Submissions] Closing modal');
    $scope.selectedSub = null;
  };

  $http.get('http://127.0.0.1:8000/api/students/submissions/', { headers: Auth.headers() }).then(function(response) {
    var apiData = response.data || [];
    console.log('[Submissions-API] Returned:', apiData.length, 'submissions');
    
    $scope.submissions = apiData.map(function(sub, i) {
      console.log('  [', i, '] Assignment:', sub.assignment_title, 'Course:', sub.course, 'Status:', sub.status, 'Marks:', sub.marks_obtained);
      return {
        id: sub.id,
        title: sub.assignment_title,
        course: sub.course,
        date: formatDate(sub.submitted_at),
        submitted_at: sub.submitted_at,
        status: capitalizeStatus(sub.status),
        status_raw: sub.status,
        marks: formatMarks(sub),
        marks_obtained: sub.marks_obtained,
        max_marks: sub.assignment_max_marks,
        feedback: sub.feedback || null,
        file_url: sub.file_url,
        graded_at: sub.graded_at
      };
    });
    
    console.log('[Submissions] Total mapped:', $scope.submissions.length);
    $scope.loadingSubmissions = false;
  }, function(error) {
    console.error('[Submissions-API] Error:', error);
    $scope.loadingSubmissions = false;
  });
});
