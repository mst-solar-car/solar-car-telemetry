/**
 * Data structure for registering a telemetry module
 */
interface ITelemetryModuleRegistration { 
  Name: string; // Name of the module (must be unique)
  NeedsPolling: boolean; // True if the module needs to be polled for data, false if it gets it automagically (WebSockets)
  Data: ITelemetryDataRegistration[]; // Array of the values that this telemetry module provides
  Module: ITelemetryModule;
}


/**
 * Module for providing telemetry data
 */
interface ITelemetryModule { 
  UpdateData?: () => Promise<ITelemetryData>; // Function used if the module needs to be polled for data
}



/**
 * Registering telemetry data
 */
interface ITelemetryDataRegistration { 
  Name: string; 
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
  Name: string; 
  Value: any;
}



