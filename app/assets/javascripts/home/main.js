/**
 * Main, shows the start page and provides controllers for the header and the footer.
 * This the entry module which serves as an entry point so other modules only have to include a
 * single module.
 */
define(['angular', './routes', './controllers'], function(angular, routes, controllers) {
  'use strict';

  var mod = angular.module('yourprefix.home', ['ngRoute', 'home.routes']);
  mod.controller('HeaderCtrl', controllers.HeaderCtrl);
  mod.controller('HomeCtrl', controllers.HomeCtrl);
  mod.controller('FooterCtrl', controllers.FooterCtrl);
  mod.controller('FaqCtrl', controllers.FaqCtrl);
  mod.controller('CaptchaCtrl', controllers.CaptchaCtrl);
  return mod;
});
