/**
 * To register a module add a path to your module here
 * Example: if your module name is "TestModule" then create a file called "TestModule.ts" inside the
 * modules folder, then add "TestModule" to the list below
 *
 * In "TestModule.ts" you should export a single object that implements the ITelemetryModuleRegistration interface
 */
let modules: string[] = [
  "Sample"
];



// Map each module to the full path to the registration file
export = modules.map((moduleName) => { return "modules/" + moduleName; });