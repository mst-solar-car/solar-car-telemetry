interface IModuleLoader { 
  Load(): Promise<any>;
  Resolve(name: string): ITelemetryModuleRegistration;
}
