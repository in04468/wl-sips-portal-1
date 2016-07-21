/**
 * Home controllers.
 */
define([], function() {
  'use strict';

  /** Controls the index page */
  var HomeCtrl = function($scope, $rootScope, $location, $analytics, helper) {
    console.log(helper.sayHi());
  /**  Example analytics calls to do custom page/event tracking
    $analytics.pageTrack('/my/url');
    $analytics.eventTrack('eventName');
    $analytics.eventTrack('eventName', {  category: 'category', label: 'label' });
  **/
    $rootScope.pageTitle = 'Worldline UK Payment Acceptance Portal';
  };
  HomeCtrl.$inject = ['$scope', '$rootScope', '$location', '$analytics', 'helper'];

  /** Controls the header */
  var HeaderCtrl = function($scope, $rootScope, $window, userService, helper, $location, $http) {
    // Wrap the current user from the service in a watch expression
    $scope.$watch(function() {
      var user = userService.getUser();
      return user;
    }, function(user) {
      $scope.user = user;
    }, true);

    $scope.logout = function() {
      userService.logout();
      $scope.user = undefined;
      $location.path('/');
    };

    // Get the environment variables, set in the root scope and configure analytics
    $scope.setEnvironment = function() {
      $http.get('/environment')
        .success(function(data) {
          // Setup environment and return Url for Salesforce web-to-lead
          $rootScope.environment = data;
          $rootScope.environment.salesforceCallbackUrl = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("/") + 1) + 'confirmation';
          // Configure google analytics tracking id
          $window.ga('create', $rootScope.environment.googleAnalyticsId, 'auto');
      });
    };
    $scope.setEnvironment();
  };
  HeaderCtrl.$inject = ['$scope', '$rootScope', '$window', 'userService', 'helper', '$location', '$http'];

  /** Controls the footer */
  var FooterCtrl = function(/*$scope*/) {
  };
  //FooterCtrl.$inject = ['$scope'];

   /** FAQ Controller */
  var FaqCtrl = function($scope, $http) {
    $scope.getFaqs = function() {
      $http.get('/assets/json/faqs.json')
        .success(function(data) {
          $scope.faqs = data;
      });
    };
    $scope.toggleFaq = function(thisFaq) {
      if (thisFaq.visible) {
          thisFaq.visible = false;
      } else {
        $scope.faqs.forEach(function(faq) {
          faq.visible = false;
        });
        thisFaq.visible = true;
      }
    };
    $scope.getFaqs();
  };
  FaqCtrl.$inject = ['$scope', '$http'];

  /** Controls the captcha */
  var CaptchaCtrl = function ($scope, $rootScope, $http, vcRecaptchaService, $location, $window) {
     //console.log("this is your app's RequestCtrl controller");
     $scope.response = null;
     $scope.widgetId = null;
     $scope.model = {
        //key: '6LcdLiQTAAAAAGeklxqogZwJ9F8NAF-BRzos6xzA'
        key : $rootScope.environment.captchaSiteKey
     };
     $scope.setResponse = function (response) {
           $scope.response = response;
     };
     $scope.setWidgetId = function (widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
     };
     $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
     };

     $scope.submit = function () {
        var success = false;
        if($scope.response === null) {
           $window.alert("Please resolve the captcha and submit!");
           vcRecaptchaService.reload($scope.widgetId);
        } else {
           console.log('sending the captcha response to the server', $scope.response);
           $http.get('/verifycaptcha', {params : {response : $scope.response}})
           .success(function (data) {
              success = data.success;
              console.log("Response is "+success);
              if(success) {
                 console.log('Validation Successful )))):');
                 //$window.location.href = 'https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
              } else {
                 console.log('Validation Failed )))):');
                 $window.alert("Incorrect captcha, Please resolve the captcha and submit!");
                 $window.location.href = $location.absUrl();
                 vcRecaptchaService.reload($scope.widgetId);
              }
           });
        }
     };
  };
  CaptchaCtrl.$inject = ['$scope', '$rootScope', '$http', 'vcRecaptchaService', '$location', '$window'];

  return {
    HeaderCtrl: HeaderCtrl,
    FooterCtrl: FooterCtrl,
    HomeCtrl: HomeCtrl,
    FaqCtrl: FaqCtrl,
    CaptchaCtrl: CaptchaCtrl
  };

});
