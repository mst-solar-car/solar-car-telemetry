/**
 * This class is a base telemetry module--all other telemetry modules should extend from it and use the methods that it 
 * has, these are used to provide notifications when data is received
 */
abstract class TelemetryModule implements ITelemetryModule { 

  private _subscriptions: any; // Hash map of subscriptions

  constructor() { 
    this._subscriptions = {}; 
  }


  /**
   * All modules that extend this class should 
   * have this method, it exists to initialize 
   * getting telemetry data when the program creates
   * a provider for that module
   */
  abstract Load(): void; 


  /**
   * Subscribes to a telemetry module for when data is received
   * @param key Key of the data to subscribe to
   * @param callbackFn Function to perform when data for that key is received
   */
  public Subscribe(key: string, callbackFn: (data: ITelemetryData) => void): void { 
    // Add to the hash map
    this._subscriptions[key] = callbackFn;
    console.info("Subscribing to " + key);
  }


  /**
   * This function should be called by telemetry modules and happen whenever they receive data
   * @param key Key of telemetry data
   * @param data Data received
   */
  public Notify(data: ITelemetryData): void { 
    if (this._subscriptions[data.Key]) { 
      // Call whenever possible
      setTimeout(() => {
        this._subscriptions[data.Key](data);
      }, 0);
    }

    // Notify a subscription to all the data for this module
    if (this._subscriptions['all']) { 
      // Call whenever possible 
      setTimeout(() => {
        this._subscriptions['all'](data);
      }, 0);
    }
  }

}

export = TelemetryModule; 