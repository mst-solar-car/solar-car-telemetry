/**
 *  The RequireJS Config File
 */
require.config({
  baseUrl: "scripts",
  paths: {
    knockout: '../lib/knockout',
    chart: "../lib/chart",
    knockoutChart: "../lib/knockout.chart"
  }
});



/**
 * Load initial module
 */
require(['knockout', 'chart', 'knockoutChart', 'SolarCarTelemetry'], (ko, chartjs, knockoutchart, main) => {
  ko.applyBindings(new main());
});