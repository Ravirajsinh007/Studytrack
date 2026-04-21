app.controller('StudentForumController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.tab = 'all'; $scope.showNewThread = false;
  $scope.courses = ['Data Structures & Algorithms','Web Technologies','Database Management','Software Engineering'];
  $scope.newThread = {};
  $scope.threads = [
    {title:'How to handle null pointer in BST delete?',course:'DSA',preview:'I keep getting null pointer exception when deleting leaf nodes...',replies:5,views:24,time:'2h ago',author:'Priya S.',initials:'PS',avatarColor:'a'},
    {title:'Responsive navbar not working on mobile',course:'Web Tech',preview:'My navbar collapses correctly but the hamburger menu does not toggle...',replies:3,views:18,time:'5h ago',author:'Rohan M.',initials:'RM',avatarColor:'b'},
    {title:'Difference between 2NF and 3NF?',course:'DBMS',preview:'Can someone explain with a practical example? I understand the theory but...',replies:8,views:41,time:'1d ago',author:'Ananya P.',initials:'AP',avatarColor:'c'},
    {title:'SRS document format — which template to use?',course:'Soft Engg',preview:'Professor mentioned IEEE standard but I found two different templates online...',replies:2,views:12,time:'2d ago',author:'Dev J.',initials:'DJ',avatarColor:'d'}
  ];
  $scope.postThread = function(){
    if(!$scope.newThread.title||!$scope.newThread.body) return;
    $scope.threads.unshift({title:$scope.newThread.title,course:$scope.newThread.course,preview:$scope.newThread.body,replies:0,views:1,time:'just now',author:$scope.username,initials:$scope.username[0],avatarColor:'a'});
    $scope.newThread={};$scope.showNewThread=false;
  };
});
