/**
 * Data structure for registering a telemetry module
 */
interface ITelemetryModuleRegistration { 
  Name: string; // Name of the module (must be unique)
  NeedsPolling: boolean; // True if the module needs to be polled for data, false if it gets it automagically (WebSockets)
  PollingInterval?: number; // Optional interval to poll data at (in milliseconds; minimum: 500, maximum: 5000, default: 1000)
  Data: ITelemetryDataRegistration[]; // Array of the values that this telemetry module provides
  Module: any;
}


/**
 * Module for providing telemetry data
 */
interface ITelemetryModule { 
  Subscribe(key: string, callbackFn: (data: ITelemetryData) => void);
  Notify(data: ITelemetryData);
  Load(): void; // Abstract method
  UpdateData?: () => void; // Function used if the module needs to be polled for data
}



/**
 * Registering telemetry data
 */
interface ITelemetryDataRegistration { 
  Name: string; 
  Key: string; // Unique Key to identify data
  Description?: string; // Optional description 
  DataType: string; // Name of the type (int, string, float, boolean, etc) 
  Units?: string; // Unit of this type, 
  Min?: any; // Minimum value this should be
  Max?: any; // Maximum value this should be
}


/**
 * Telemetry Data that gets returned
 */
interface ITelemetryData { 
  Key: string; 
  Value: any;
}



