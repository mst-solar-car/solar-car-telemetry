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
    this.Notify({ 
      Key: 'sample-image', 
      Value: 'https://www.hq.nasa.gov/alsj/a16/AS16-117-18747.jpg'
    });
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