import PubSub = require("framework/PubSub");

/**
 * The SourceMonitor is responsible for
 * monitoring a Source for a telemetry provider
 */
class SourceMonitor {

  private _original: any;
  private _originalType: string;
  private _pollingInterval: number;

  private _callback: (data: ITelemetryData) => void;

  private _pollingEvent = null; // setInterval for polling
  private _errorCount: number = 0;
  private _pollingLock: boolean = false;

  private _errorLimit:number = 10;

  constructor(original: any, pollingInterval: number, callback: (data: ITelemetryData) => void) {
    this._original = original;
    this._originalType = typeof original;
    this._pollingInterval = pollingInterval;

    this._callback = callback;

    this._decideHowToMonitorSource();
  }


  /**
   * Decides how to handle any given source
   */
  private _decideHowToMonitorSource() {
    // Decide what to do based on the type of the source provided
    switch (this._originalType) {
      case "function":
        this._original = this._original(); // Update original with return value of the function
        this._originalType = typeof this._original;
        this._decideHowToMonitorSource(); // Decide what to do based on the type just returned by the function
        break;

      case "object":
        this._monitorObject();
        break;

      case "string":
        this._original = ParseURL(this._original);
        this._monitorURL();
        break;

      default:
        PubSub.PublishError("'" + this._originalType + "' is an unkown type of module source");
    }
  }


  /**
   * Monitor an object
   */
  private _monitorObject(): void {
    // Make sure the object has a .Poll method
    if (this._original.Poll == undefined || typeof this._original.Poll != "function") {
      PubSub.PublishWarning("Object provided as Module Source does not provide a '.Poll' method");
      return;
    }

    this._pollingEvent = setInterval(() => {
      // Do not do anything if locked
      if (this._pollingLock)
        return;

      // Check for too many errors
      if (this._errorCount > this._errorLimit) {
        PubSub.PublishError('Failed to get data from Poll() method ' + this._errorLimit + ' times, will stop attempting');
        clearInterval(this._pollingEvent);
        return;
      }

      this._pollingLock = true; // Lock polling

      let result = this._original.Poll(); // Poll the object

      // Handle no return value
      if (result == undefined || result == null) {
        this._pollingLock = false;
        this._errorCount++;
        PubSub.PublishWarning('Poll() method did not return a value');
        return;
      }

      // Handle a promise being returned
      if (result.then && typeof result.then == "function" && result.catch && typeof result.catch == "function") {
        result.then((data) => {
          this._receiveData(data);
          this._errorCount = 0;
          this._pollingLock = false;
        })
        .catch(() => {
          this._errorCount++;
          this._pollingLock = false;
        });
      }
      else {
        // Use as a regular value
        this._receiveData(result);

        this._pollingLock = false;
        this._errorCount = 0;
      }


    }, this._pollingInterval);
  }


  /**
   * Decides the best way to monitor the given url
   */
  private _monitorURL(): void {
    switch (this._original.Protocol) {
      case "ws":
        // Yay! Web Sockets
        this._handleWebSocket();
        break;

      case "http":
      case "https":
        this._handleNetworkURL();
        break;

      default:
        PubSub.PublishError("Module Source with protocol '" + this._original.Protocl + "' is an unkown protocol");
    }
  }


  /**
   * Source URL is a web socket :)
   */
  private _handleWebSocket() {
    try {
      let connection = new WebSocket(this._original.Complete);

      // Wait for a message
      connection.addEventListener('message', (e) => {
        try {
          let data = JSON.parse(e.data);
          this._receiveData(data);
        }
        catch (e) {
          PubSub.PublishError('Received malformed data from websocket', e);
        }
      });

      // Handle errors
      connection.addEventListener('error', (e) => {
        PubSub.PublishError('WebSocket received error', e);
      });

      // Handle close
      connection.addEventListener('close', (e) => {
        PubSub.PublishWarning('WebSocket closed', e);
      });
    }
    catch (e) {
      PubSub.PublishError('Error in web socket connection', e);
    }
  }


  /**
   * Handles fetching the using a network request
   */
  private _handleNetworkURL(): void {
    this._pollingEvent = setInterval(() => {
      // Do not make another request while one has not finished
      if (this._pollingLock)
        return;

      // Stop polling if more than 10 errors
      if (this._errorCount > this._errorLimit) {
        PubSub.PublishError('Failed to get data from ' + this._original.Complete + ' ' + this._errorLimit + ' times, will stop attempting');
        this._pollingLock = false;
        clearInterval(this._pollingEvent);
      }

      this._pollingLock = true; // Lock polling

      NetworkRequest(this._original.Complete)
        .then((parsedData: any) => {
          this._errorCount = 0; // Reset error count
          this._pollingLock = false; // Release lock

          this._receiveData(parsedData);
        })
        .catch(() => {
          this._errorCount++;
          this._pollingLock = false; // Release lock

          PubSub.PublishError('Error completing network request to ' + this._original.Complete);
        });

    }, this._pollingInterval);
  }


  /**
   * Method for receing and validating data
   * @param data data to handle
   */
  private _receiveData(data: any): void {
    // Recursively call on array elements
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        this._receiveData(data[i]);
      }
      return;
    }

    // Check if invalid
    if (data.Key == undefined || data.Value == undefined) {
      PubSub.Publish('Value in array result from ' + this._original.Complete + ' is not formatted as ITelemetryData');
      return;
    }

    // Not invalid, send to callback whenever possible
    ASAP(() => {
      this._callback({
        Key: data.Key,
        Value: data.Value
      });
    });
  }




}


export = SourceMonitor;