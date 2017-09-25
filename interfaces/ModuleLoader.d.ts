interface IModuleLoader { 
  Load(): Promise<ITelemetryModuleRegistration[]>;
  Resolve(name: string): ITelemetryModuleRegistration;
}
