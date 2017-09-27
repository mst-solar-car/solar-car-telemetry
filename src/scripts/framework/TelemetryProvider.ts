let ko: KnockoutStatic = require("knockout");

import PubSub = require("framework/PubSub");
/**
 * The Telemetry Provider class will wrap around a Telemetry Module and update the main program (UI)
 * when new data is received, it will also be responisble for polling new data when desired
 */
class TelemetryProvider implements ITelemetryProvider {

  public Id: string;
  public Name: string;
  public LatestValues: any; // Hashmap of observables key -> IDataValue<any>

  private _registration: ITelemetryModuleRegistration;

  private _data: any; // Hash map for data registration key -> ITelemetryDataRegistration


  /**
   * Construct a new Telemetry Provider
   * @param moduleRegistration Registration for the module that this class should wrap
   */
  constructor(moduleRegistration: ITelemetryModuleRegistration) {
    this.Id = Guid();

    this._registration = moduleRegistration;

    this.Name = this._registration.Name;

    this.LatestValues = {};
    this._data = {};


    // Loop through each of the data items registered by this module
    for (let i = 0; i < moduleRegistration.Data.length; i++) {
      let dataRegistration = moduleRegistration.Data[i];

      this._data[dataRegistration.Key] = dataRegistration; // Add to the data hash map

      // Subscribe to this key and monitor the value
      this._registration.Module.Subscribe(dataRegistration.Key, this._monitorValue);

      // Give the default value
      this._updateValue(dataRegistration.Key, (dataRegistration.Default != undefined ? dataRegistration.Default : ''), false);
    }


    // Initialize the module for getting data
    this._registration.Module.Load();


    // Start polling if needed
    if (this._registration.NeedsPolling) {
      if (this._registration.Module.UpdateData) {
        this._registration.Module.UpdateData();
        this._startPolling();
      }
      else {
        console.warn("Module " + this.Name + " has no UpdateData() method and requires polling");
      }
    }
  }


  /**
   * Creates an array of a custom type specific for the UI
   */
  public* GetDataValues(): Generator {
    for (let key in this.LatestValues) {
      if (this.LatestValues.hasOwnProperty(key) && this._data[key] != undefined) {
        yield {
          Key: key,
          Registration: this._data[key],
          Data: this.LatestValues[key]
        };
      }
    }
  }


  /**
   * Montiors a value
   */
  private _monitorValue = (data: ITelemetryData) => {
    if (this._data[data.Key] == undefined) return;

    let registration = this._data[data.Key] as ITelemetryDataRegistration;

    let invalid: boolean = false;

    // Compare against minimum and maximum values if available
    if (registration.DataType != TelemetryDataType.String && registration.DataType != TelemetryDataType.Image) {
      // Compare minimum
      if (registration.Min && data.Value < registration.Min) {
        PubSub.PublishError(registration.Name + ' is less than minimum value (' + data.Value + ' < ' + registration.Min + ')', data);
        invalid = true;
      }
      // Compare maximum
      else if (registration.Max && data.Value > registration.Max) {
        PubSub.PublishError(registration.Name + ' is more than maximum value (' + data.Value + ' > ' + registration.Max + ')', data);
        invalid = true;
      }
      // Minimum Warning
      else if (registration.Min && data.Value == registration.Min) {
        PubSub.PublishWarning(registration.Name + ' is equal to the minimum value (' + data.Value + ')', data);
      }
      // Maximum Warning
      else if (registration.Max && data.Value == registration.Max) {
        PubSub.PublishWarning(registration.Name + ' is equal to the maximum value (' + data.Value + ')', data);
      }
    }

    // Update the value
    this._updateValue(data.Key, data.Value, invalid);
  };


  /**
   * Updates the value for a key
   */
  private _updateValue(key: string, value: any, invalid: boolean): void {
    if (this._data[key] == undefined) {
      console.warn("Tried to update value for " + key + " but that's an unregistered data value");
      return; // Not a valid key
    }

    let registration = this._data[key] as ITelemetryDataRegistration;

    let newVal = { Value: value , Invalid: invalid, Updated: (new Date()).toISOString() }; // New value to add

    switch (registration.Display) {
      case DisplayType.Table:
      case DisplayType.Graph:
        if (this.LatestValues[key] == undefined) {
          this.LatestValues[key] = ko.observableArray([]);
        }

        this.LatestValues[key].push(newVal);

        break;

      case DisplayType.Image:
        if (this.LatestValues[key] == undefined) {
          this.LatestValues[key] = ko.observable(null);
        }

        this.LatestValues[key](newVal);

        break;
    }


  }


  /**
   * Starts polling at the registered interval
   */
  private _startPolling(): void {
    this._registration.PollingInterval = this._registration.PollingInterval || 1000; // Default to 1000ms

    // Hit the update function every PollingInterval
    setInterval(() => {
      this._registration.Module.UpdateData();
    }, this._registration.PollingInterval);
  }




}


export = TelemetryProvider;