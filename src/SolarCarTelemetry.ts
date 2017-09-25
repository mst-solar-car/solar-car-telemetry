import "polyfills"; 

import ModuleLoader = require("framework/ModuleLoader");


/**
 * Main Class that starts everything
 */
class SolarCarTelemetry { 
  constructor() { 
    ModuleLoader.Load().then(() => {
      // All modules are done loading
      
      console.log(mod);
    });
  }

}




export = SolarCarTelemetry;