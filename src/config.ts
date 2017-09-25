/**
 *  The RequireJS Config File
 */
require.config({ 
  baseUrl: "dist", 
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