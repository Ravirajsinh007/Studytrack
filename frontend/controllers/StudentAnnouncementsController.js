app.controller('StudentAnnouncementsController', function($scope, $http, $location, Auth, ApiConfig) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.announcements = [];
  $scope.loading = true;
  $scope.error = '';
  $scope.selectedAnnouncement = null;
  $scope.showAnnouncementModal = false;

  function formatAnnDate(dateString) {
    var date = new Date(dateString);
    var now = new Date();
    var diffMs = now - date;
    var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    var diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return diffHours + ' hours ago';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatFullDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  $scope.viewAnnouncement = function(announcement) {
    $scope.selectedAnnouncement = announcement;
    $scope.selectedAnnouncement.fullDate = formatFullDate(announcement.created_at);
    $scope.showAnnouncementModal = true;
  };

  $scope.closeAnnouncementModal = function() {
    $scope.showAnnouncementModal = false;
    $scope.selectedAnnouncement = null;
  };

  $http.get(ApiConfig.getUrl('/api/courses/announcements/'), { headers: Auth.headers() })
    .then(function(response) {
      if (response.data && response.data.length) {
        $scope.announcements = response.data.map(function(ann) {
          return {
            id: ann.id,
            title: ann.title,
            message: ann.message,
            course: ann.course_title,
            created_at: ann.created_at,
            time: formatAnnDate(ann.created_at)
          };
        });
      }
    }, function(error) {
      console.log('[StudentAnnouncements] Failed to load announcements', error);
      $scope.error = 'Unable to load announcements at the moment.';
    }).finally(function() {
      $scope.loading = false;
    });
});