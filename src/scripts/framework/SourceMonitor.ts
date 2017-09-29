import PubSub = require("framework/PubSub");

/**
 * The SourceMonitor is responsible for
 * monitoring a Source for a telemetry provider
 */
class SourceMonitor {

  private _original: any;
  private _originalType: string;
  private _needsPolling: Boolean;

  private _callback: (data: ITelemetryData) => void;

  constructor(original: any, needsPolling: Boolean, callback: (data: ITelemetryData) => void) {
    this._original = original;
    this._originalType = typeof original;
    this._needsPolling = needsPolling;

    this._callback = callback;

    // Decide what to do based on the type of the source provided
    switch (this._originalType) {
      case "function":
        this._original = this._original(); // Get the return value of the function

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
    // Show warning if polling is set to false
    if (this._needsPolling == false) {
      PubSub.PublishWarning("Object provided as Module Source but no polling required. No data can be obtained");
      return;
    }

    // Make sure the object has a .Poll method
    if (this._original.Poll == undefined || typeof this._original.Poll != "function") {
      PubSub.PublishWarning("Object provided as Module Source does not provide a '.Poll' method");
      return;
    }

    // TODO: Poll on set intervals
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
      connection.onmessage = (e) => {
        try {
          let data = JSON.parse(e.data);
          if (data.Key == undefined || data.Value == undefined)
            throw data;

          // Only send the key and value
          this._callback({
            Key: data.Key,
            Value: data.Value
          } as ITelemetryData);
        }
        catch (e) {
          PubSub.PublishError('Received malformed data from websocket', e);
        }
      };
    }
    catch (e) {
      console.error(e);
      PubSub.PublishError('Error in web socket connection', e);
    }
  }




}


export = SourceMonitor;