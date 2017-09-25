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
      DataType: "int", 
      Units: "meters", 
      Display: DisplayType.Graph
    }
  ]
};


export = registration;