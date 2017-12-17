let ko: KnockoutStatic = require("knockout");

import PubSub = require("framework/PubSub");
import SourceMonitor = require("framework/SourceMonitor");


/**
 * The Telemetry Provider class will wrap around a Telemetry Module and update the main program (UI)
 * when new data is received, it will also be responisble for polling new data when desired
 */
class TelemetryProvider implements ITelemetryProvider {

  public Id: string;
  public Name: string;
  public Scope: string;

  private _registration: ITelemetryModuleRegistration;

  public LatestValues: any; // Object: key -> KnockoutObservableArray<IDataValue>
  private _dataRegistration: any; // Object: key -> ITelemetryDataRegistration


  /**
   * Construct a new Telemetry Provider
   * @param moduleRegistration Registration for the module that this class should wrap
   */
  constructor(moduleRegistration: ITelemetryModuleRegistration) {
    this.Id = Guid();
    this.Scope = moduleRegistration.Key;
    this._registration = moduleRegistration;
    this.Name = this._registration.Name;
    this.LatestValues = {};
    this._dataRegistration = {};

    // Monitor the source of the module
    moduleRegistration.Source = new SourceMonitor(moduleRegistration.Source, moduleRegistration.PollingInterval, this._monitorValue);

    // Make copy of registration details and give default values
    for (let i = 0; i < moduleRegistration.Data.length; i++) {
      let dataRegistration = moduleRegistration.Data[i];

      this._dataRegistration[dataRegistration.Key] = dataRegistration; // Keep a copy

      // Give the default value
      this._updateValue(dataRegistration.Key, (dataRegistration.Default != undefined ? dataRegistration.Default : ''), false);
    }

  }

  /**
   * Gets the value history of a single key
   * @param key Key to get the value of
   */
  public GetDataValuesByKey(key: string): ITelemetryDataDTO {
    if (this.LatestValues.hasOwnProperty(key) && this._dataRegistration[key] != undefined) {
      return <ITelemetryDataDTO>{
        Key: key,
        Scope: this.Scope,
        Registration: this._dataRegistration[key],
        Data: this.LatestValues[key]
      };
    }

    return null as ITelemetryDataDTO;
  }


  /**
   * Generator that yields ITelemetryDataDTO
   */
  public* GetDataValues(): Generator {
    for (let key in this.LatestValues) {
      if (this.LatestValues.hasOwnProperty(key) && this._dataRegistration[key] != undefined) {
        yield <ITelemetryDataDTO>{
          Key: key,
          Scope: this.Scope,
          Registration: this._dataRegistration[key],
          Data: this.LatestValues[key]
        };
      }
    }

  }


  /**
   * Returns data for a chart
   * @param registration data registration
   */
  public GetChartData(dto: ITelemetryDataDTO): KnockoutComputed<LinearChartData> {
    return ko.computed(() => {
      let data = dto.Data(); // These creates a dependency in knockout so anytime this updates so will anything that uses data in this function

      // Only keep 10 data points on the graph
      if (data.length > 10) {
        data = data.slice(data.length - 10);
      }

      // Get timestamps
      let timestamps = data.map((v) => {
        let date = new Date(v.Updated);

        return date.getMinutes() + ":" + date.getSeconds();
      });
      let values = data.map((v) => v.Value);

      // Return the data object for the graph
      return <LinearChartData>{
          labels: timestamps,
          datasets: [
            {
              label: dto.Registration.Name,
              backgroundColor: 'rgb(255, 99, 132)',
              data: values
            }
          ]
        };
    });
  }


  /**
   * Montiors a value, is executed when new
   * data is published
   */
  private _monitorValue = (data: ITelemetryData) => {
    if (this._dataRegistration[data.Key] == undefined) return;

    let registration = this._dataRegistration[data.Key] as ITelemetryDataRegistration;

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
    if (this._dataRegistration[key] == undefined) {
      console.warn("Tried to update value for " + key + " but that's an unregistered data value");
      return; // Not a valid key
    }

    let registration = this._dataRegistration[key] as ITelemetryDataRegistration;

    let newVal = <IDataValue>{ Value: value , Invalid: invalid, Updated: (new Date()).toISOString()  }; // New value to add

    switch (registration.Display) {
      case DisplayType.Table:
      case DisplayType.Graph:
        if (this.LatestValues[key] == undefined) {
          this.LatestValues[key] = ko.observableArray([]);
        }

        if (registration.Display == DisplayType.Graph)
          this.LatestValues[key].push(newVal);
        else
          this.LatestValues[key].unshift(newVal); // Tables get data put into the beginning of the array

        break;

      case DisplayType.Image:
        if (this.LatestValues[key] == undefined) {
          this.LatestValues[key] = ko.observable(null);
        }

        this.LatestValues[key](newVal);
        break;
    }


  }




}


export = TelemetryProvider;