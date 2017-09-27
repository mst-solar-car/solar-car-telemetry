/**
 *  The RequireJS Config File
 */
require.config({
  baseUrl: "scripts",
  paths: {
    knockout: '../lib/knockout'
  }
});



/**
 * Load initial module
 */
require(['knockout', 'SolarCarTelemetry'], (ko, main) => {
  ko.applyBindings(new main());
});