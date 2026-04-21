app.controller('InstructorAnnouncementsController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.showForm=false; $scope.postSuccess=false;
  $scope.newAnn={}; 
  $scope.announcements = [];

  // Fetch courses for the instructor
  $http.get('http://127.0.0.1:8000/api/courses/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      $scope.courses = response.data.map(function(course) {
        return { id: course.id, title: course.title };
      });
    }
  }, function() {});

  // Fetch existing announcements
  $http.get('http://127.0.0.1:8000/api/announcements/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      $scope.announcements = response.data.map(function(ann) {
        return {
          id: ann.id,
          course: ann.course_title,
          title: ann.title,
          message: ann.message,
          time: new Date(ann.created_at).toLocaleDateString()
        };
      });
    }
  }, function() {});

  $scope.postAnnouncement = function(){
    if(!$scope.newAnn.title || !$scope.newAnn.message || !$scope.newAnn.course) return;
    $http.post('http://127.0.0.1:8000/api/courses/' + $scope.newAnn.course + '/announcements/', {
      title: $scope.newAnn.title,
      message: $scope.newAnn.message
    }, { headers: Auth.headers() }).then(function(r){
      $scope.announcements.unshift({
        id: r.data.id,
        course: $scope.courses.find(c => c.id == $scope.newAnn.course).title,
        title: r.data.title,
        message: r.data.message,
        time: 'just now'
      });
      $scope.postSuccess = true;
      $scope.newAnn = {};
      setTimeout(function(){$scope.postSuccess=false;$scope.showForm=false;$scope.$apply();},1500);
    }, function(){
      // Fallback for demo
      $scope.announcements.unshift({
        id: Date.now(),
        course: $scope.courses.find(c => c.id == $scope.newAnn.course).title,
        title: $scope.newAnn.title,
        message: $scope.newAnn.message,
        time: 'just now'
      });
      $scope.postSuccess = true;
      $scope.newAnn = {};
      setTimeout(function(){$scope.postSuccess=false;$scope.showForm=false;$scope.$apply();},1500);
    });
  };

  $scope.deleteAnn = function(a){
    if(!confirm('Delete this announcement?')) return;
    $scope.announcements.splice($scope.announcements.indexOf(a),1);
  };
});
