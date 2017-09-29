/**
 * To register a module add a path to your module here
 * Example: if your module name is "TestModule" then create a folder called "TestModule" in the
 * modules folder and add "TestModule" to the list below.
 * In that folder you should have a "TestModuleRegistration.ts" file that will contain an implementation of
 * ITelemetryModuleRegistration
 */
let modules: string[] = [
  "Sample"
];



// Map each module to the full path to the registration file
export = modules.map((moduleName) => { return "modules/" + moduleName; });