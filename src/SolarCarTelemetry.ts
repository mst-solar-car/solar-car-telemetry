import "Utils"; 
import "Enums";

import ModuleLoader = require("framework/ModuleLoader");
import TelemetryProvider = require("framework/TelemetryProvider");

let ko: KnockoutStatic = require("knockout"); 


/**
 * Main Class that starts everything
 */
class SolarCarTelemetry { 
  
  public Providers: KnockoutObservableArray<ITelemetryProvider>; // List of providers





  constructor() { 
    this.Providers = ko.observableArray([]); 

    ModuleLoader.Load().then((modules: ITelemetryModuleRegistration[]) => {
      // Create telemetry providers for every module
      for (let i = 0; i < modules.length; i++) { 
        this.Providers.push(new TelemetryProvider(modules[i]));
      }
    });

    
  }

}




export = SolarCarTelemetry;