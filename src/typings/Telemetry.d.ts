/**
 * Data structure for registering a telemetry module
 */
interface ITelemetryModuleRegistration {
  Name: string; // Name of the module (must be unique)
  Key: string;
  PollingInterval?: number; // Optional interval to poll data at (in milliseconds; minimum: 500, maximum: 5000, default: 1000)
  Data: ITelemetryDataRegistration[]; // Array of the values that this telemetry module provides
  Source: any;
  DataGroups?: ITelemetryDataDisplayGroups[]; // Groupings for displaying data
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
  Scope?: string;
  Description?: string; // Optional description
  DataType: TelemetryDataType_t; // Name of the type (int, string, float, boolean, etc)
  Units?: string; // Unit of this type,
  Min?: any; // Minimum value this should be
  Max?: any; // Maximum value this should be
  Default?: any;
  Display?: DisplayType_t; // Default = DisplayType.Table
  GraphType?: GraphType_t; // Default = GraphType.Line (if Display is DisplayType.Graph)
}


/**
 * Telemetry Data that gets returned
 */
interface ITelemetryData {
  Key: string;
  Value: any;
}

interface IDataValue {
  Value: any;
  Invalid: boolean;
  Updated: string;
}

/**
 * Represents a connection between display types that
 * should be shown using the same graph/table
 */
interface ITelemetryDataDisplayGroups {
  Keys: string[]; // All the keys to display in this group
}



