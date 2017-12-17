import "Utils";
import "Enums";

import ModuleLoader = require("framework/ModuleLoader");
import TelemetryProvider = require("framework/TelemetryProvider");
import PubSub = require("framework/PubSub");

import Dashboard = require("framework/Dashboard");

let ko: KnockoutStatic = require("knockout");


/**
 * Main Class that starts everything
 */
class SolarCarTelemetry {

  public Providers: KnockoutObservableArray<ITelemetryProvider>; // List of telemetry providers

  public CurrentView: KnockoutObservable<string>;
  public CurrentProvider: KnockoutObservable<ITelemetryProvider>;

  constructor() {
    this.CurrentView = ko.observable('');
    this.Providers = ko.observableArray([]);
    this.CurrentProvider = ko.observable(null);

    ModuleLoader.Load().then((modules: ITelemetryModuleRegistration[]) => {
      // Create telemetry providers for every module
      for (let i = 0; i < modules.length; i++) {
        this.Providers.push(new TelemetryProvider(modules[i]));
      }

      // Register the dashboard
      this.Providers.unshift(new Dashboard(this.Providers()));

      this.ChangeView('dashboard');
    });

  }




  /**
   * Changes the view on the web page
   * @param id ID of the view to change to
   */
  public ChangeView = (id: string): void => {
    if (id == this.CurrentView()) return; // Nothing to change

    let provider = this._findProviderWithId(id);
    this.CurrentProvider(provider);

    this.CurrentView(id);
  };



  /**
   * Finds a provider with an ID
   * @param id ID of the provider
   */
  private _findProviderWithId(id: string): ITelemetryProvider {
    let providers = this.Providers();

    for (let i = 0; i < providers.length; i++) {
      let provider = providers[i];

      if (provider.Id == id)
        return provider;
    }

    return null;
  }

}




export = SolarCarTelemetry;