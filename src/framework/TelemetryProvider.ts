
/**
 * The Telemetry Provider class will wrap around a Telemetry Module and update the main program (UI) 
 * when new data is received, it will also be responisble for polling new data when desired
 */
class TelemetryProvider implements ITelemetryProvider { 

  private _registration: ITelemetryModuleRegistration;


  /**
   * Construct a new Telemetry Provider
   * @param moduleRegistration Registration for the module that this class should wrap
   */
  constructor(moduleRegistration: ITelemetryModuleRegistration) {
    this._registration = moduleRegistration;

    for (let i = 0; i < moduleRegistration.Data.length; i++) { 
      let dataRegistration = moduleRegistration.Data[i]; 
      
      // Subscribe to this key
      this._registration.Module.Subscribe(dataRegistration.Key, (data: ITelemetryData) => {
        console.log(data);
      });
    }

    this._registration.Module.Load();
    
  }




}


export = TelemetryProvider;