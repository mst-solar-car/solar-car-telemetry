import TelemetryModule = require("modules/TelemetryModule"); 
import PubSub = require("framework/PubSub");

/**
 * This is a sample module that provides sample telemetry data in real time
 */
class SampleModule extends TelemetryModule { 

  /**
   * Basic Constructor
   */
  constructor() { 
    super();
  }



  /**
   * Initialize getting telemetry data
   */
  public Load(): void { 
    // Generate random data every two seconds
    setInterval(() => {
      this.Notify({ 
        Key: 'sample-data-1', 
        Value: Math.floor((Math.random() * 100) + 1)
      });
    }, 2000);
  }



}



export = SampleModule;