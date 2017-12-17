let ko: KnockoutStatic = require("knockout");

import PubSub = require("framework/PubSub");

import DashboardConfig = require("modules/DashboardConfig");

/**
 * The Dashboard Class implements the dashboard screen
 */
class Dashboard implements ITelemetryProvider {
  public Id: string;
  public Name: string;
  public Scope: string;

  private _dataToShow = DashboardConfig;

  private _providers: any;

  /**
   * Creates a dashboard
   * @param providers List of telemetry providers
   */
  constructor(providers: ITelemetryProvider[]) {
    this.Id = 'dashboard';
    this.Scope = 'dashboard';
    this.Name = 'Dashboard';

    console.log(DashboardConfig);

    this._providers = {};

    // Build map of providers based on scope
    for (let i = 0; i < providers.length; i++) {
      this._providers[providers[i].Scope] = providers[i];
    }
  }


  /**
   * Does not do anything, since the dashboard requires a scope and a key
   * @param key Key to the data value
   */
  public GetDataValuesByKey(key: string): ITelemetryDataDTO {
    return null as ITelemetryDataDTO;
  }


  /**
   * Generator that yields ITelemetryDataDTO
   */
  public* GetDataValues(): Generator {
    for (let i = 0; i < this._dataToShow.length; i++) {
      let parts = this._dataToShow[i].split(":");
      let scope = parts[0];
      parts.shift();
      let key = parts.join(":");

      // Get the data for the value
      if (this._providers.hasOwnProperty(scope)) {
        let data = this._providers[scope].GetDataValuesByKey(key);
        if (data != null) {
          yield data;
        }
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

}


export = Dashboard;