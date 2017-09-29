let registration: ITelemetryModuleRegistration = {
  Name: "Sample Data",
  NeedsPolling: false,
  Source: "ws://localhost:1337",
  Data: [
    {
      Name: "Sample Data 1",
      Key: "sample-data-1",
      Description: "Description of Sample Data 1",
      DataType: TelemetryDataType.Number,
      Units: "meters",
      Default: 0,
      Min: -1,
      Display: DisplayType.Graph,
      GraphType: GraphType.Line
    },
    {
      Name: "Sample Data 2",
      Key: "sample-data-2",
      DataType: TelemetryDataType.Number,
      Display: DisplayType.Table,
      Default: -55
    },
    {
      Name: "Sample Image",
      Key: "sample-image",
      DataType: TelemetryDataType.Image,
      Display: DisplayType.Image,
      Default: 'https://www.hq.nasa.gov/alsj/a16/AS16-117-18734.jpg'
    }
  ]
};


export = registration;