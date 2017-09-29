let ko: KnockoutStatic = require("knockout");

import PubSub = require("framework/PubSub");
/**
 * The Telemetry Provider class will wrap around a Telemetry Module and update the main program (UI)
 * when new data is received, it will also be responisble for polling new data when desired
 */
class TelemetryProvider implements ITelemetryProvider {

  public Id: string;
  public Name: string;
  public LatestValues: any; // Hashmap of observables key -> KnockoutObservableArray<IDataValue>

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
   * Generator that yields ITelemetryDataDTO
   */
  public* GetDataValues(): Generator {
    for (let key in this.LatestValues) {
      if (this.LatestValues.hasOwnProperty(key) && this._data[key] != undefined) {
        yield <ITelemetryDataDTO>{
          Key: key,
          Registration: this._data[key],
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

        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
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

    let newVal = <IDataValue>{ Value: value , Invalid: invalid, Updated: (new Date()).toISOString()  }; // New value to add

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