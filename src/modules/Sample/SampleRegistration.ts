import SampleModule = require("modules/Sample/SampleModule");

let registration: ITelemetryModuleRegistration = { 
  Name: "Sample Telemetry Module", 
  NeedsPolling: false, 
  Module: new SampleModule(), 
  Data: [
    {
      Name: "Sample Data 1", 
      Key: "sample-data-1",
      Description: "Description of Sample Data 1", 
      DataType: TelemetryDataType.Float, 
      Units: "meters", 
      Default: 0,
      Display: DisplayType.Table
    }, 
    { 
      Name: "Sample Data 2", 
      Key: "sample-data-2", 
      DataType: TelemetryDataType.Float,
      Display: DisplayType.Table, 
      Default: -55
    }
  ]
};


export = registration;