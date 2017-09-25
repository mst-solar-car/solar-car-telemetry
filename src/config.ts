/**
 *  The RequireJS Config File
 */
require.config({ 
  baseUrl: "dist"
});



/**
 * Load initial module
 */
require(['SolarCarTelemetry'], (main) => {
  new main();
});