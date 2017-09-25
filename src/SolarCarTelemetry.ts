import "Utils"; 

import ModuleLoader = require("framework/ModuleLoader");
import TelemetryProvider = require("framework/TelemetryProvider");


/**
 * Main Class that starts everything
 */
class SolarCarTelemetry { 
  
  private _providers: ITelemetryProvider[]; 

  constructor() { 
    this._providers = []; 

    ModuleLoader.Load().then((modules: ITelemetryModuleRegistration[]) => {
      // Create telemetry providers for every module
      for (let i = 0; i < modules.length; i++) { 
        this._providers.push(new TelemetryProvider(modules[i]));
      }
    });
  }

}




export = SolarCarTelemetry;