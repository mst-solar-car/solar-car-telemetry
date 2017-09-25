/**
 *  The RequireJS Config File
 */
require.config({ 
  baseUrl: "build/scripts", 
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