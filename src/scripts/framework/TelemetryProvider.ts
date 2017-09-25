let ko: KnockoutStatic = require("knockout"); 


/**
 * The Telemetry Provider class will wrap around a Telemetry Module and update the main program (UI) 
 * when new data is received, it will also be responisble for polling new data when desired
 */
class TelemetryProvider implements ITelemetryProvider { 
  
  public Name: string; 
  public LatestValues: KnockoutObservable<any>;; // Hashmap of observables key -> value

  private _registration: ITelemetryModuleRegistration;

  private _data: any; // Hash map for data registration key -> ITelemetryDataRegistration


  /**
   * Construct a new Telemetry Provider
   * @param moduleRegistration Registration for the module that this class should wrap
   */
  constructor(moduleRegistration: ITelemetryModuleRegistration) {
    this._registration = moduleRegistration;

    this.Name = this._registration.Name; 

    this.LatestValues = ko.observable({});
    this._data = {};


    // Loop through each of the data items registered by this module
    for (let i = 0; i < moduleRegistration.Data.length; i++) { 
      let dataRegistration = moduleRegistration.Data[i]; 

      this._data[dataRegistration.Key] = dataRegistration; // Add to the data hash map
      
      // Subscribe to this key
      this._registration.Module.Subscribe(dataRegistration.Key, (data: ITelemetryData) => {
        console.log(data);

        // Update value
        this._updateValue(data.Key, data.Value);
      });

      // Give the default value
      this._updateValue(dataRegistration.Key, (dataRegistration.Default != undefined ? dataRegistration.Default : null));
    }

    // Initialize the module for getting data
    this._registration.Module.Load();

    // Start polling if needed
    if (this._registration.NeedsPolling) { 
      if (this._registration.Module.UpdateData) { 
        this._registration.Module.UpdateData();
        this._startPolling();
      }
      else { 
        console.warn("Module " + this.Name + " has no UpdateData() method and requires polling"); 
      }
    }
  }


  /**
   * Updates the value for a key 
   */
  private _updateValue(key: string, value: any): void { 
    let vals = this.LatestValues(); 
    vals[key] = value; 

    this.LatestValues(vals);
  }


  /**
   * Starts polling at the registered interval
   */
  private _startPolling(): void { 
    this._registration.PollingInterval = this._registration.PollingInterval || 1000; // Default to 1000ms 

    // Hit the update function every PollingInterval
    setInterval(() => {
      console.info("Polling " + this.Name);
      this._registration.Module.UpdateData();
    }, this._registration.PollingInterval);
  }




}


export = TelemetryProvider;