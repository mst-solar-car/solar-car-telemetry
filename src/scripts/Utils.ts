/**
 * All things declared in this file are members of the window object
 */


/**
 * Allows for writing promises in a different style; basically JQuery Deferreds
 */
class Deferred implements IDeferred {
  public IsResolved: boolean;
  public Promise: Promise<any>;

  public Resolve: (data?: any) => void;
  public Reject: (data?: any) => void;


  constructor() {
    this.IsResolved = false;

    // Create the promise and wrap the resolve and reject functions
    this.Promise = new Promise((res, rej) => {
      // Setup resolve function
      this.Resolve = (data?: any): void => {
        if (!this.IsResolved) {
          this.IsResolved = true;
          res(data);
        }
      }

      // Setup reject function
      this.Reject = (data?: any): void => {
        if (!this.IsResolved) {
          this.IsResolved = true;
          rej(data);
        }
      };
    });
  }
}



/**
 * Generates a Guid
 */
function Guid(): Guid {
  let gen = () => {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };

  return (gen() + gen() + "-" + gen() + "-4" + gen().substr(0, 3) + "-" + gen() + "-" + gen() + gen() + gen()).toLowerCase();
}



/**
 * Parses a url into different parts
 * @param url URL To parse
 */
function ParseURL(url: string): IParsedURL {
  try {
    let parser = document.createElement('a') as HTMLAnchorElement;
    parser.href = url;

    // Return IParsedURL object
    return {
      Protocol: parser.protocol.replace(':', '').toLowerCase(),
      HostName: parser.hostname,
      Host: parser.host,
      Port: parser.port,
      Path: parser.pathname,
      Hash: parser.hash,
      Query: parser.search,
      Complete: url
    };
  }
  catch (e) {
    return null;
  }
}


/**
 * Retrieves telemetry data after querying a url
 * @param url url to get data from
 */
function NetworkRequest(url: string): Promise<ITelemetryData[]> {
  let dfd = new Deferred();

  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF8-8');

  request.onload = (e) => {
    if (request.readyState != 2)
      return;

    if (request.status >= 200 && request.status < 400) {
      try {
        let data = JSON.parse(request.responseText);
        dfd.Resolve(data);
      }
      catch (e) {
        console.error(e);
        dfd.Reject();
      }
    }
    else {
      dfd.Reject();
    }
  };

  request.onerror = (res: ErrorEvent) => {
      dfd.Reject();
  };

  request.send();

  return dfd.Promise;
}



/**
 * Does something as soon as possible
 */
function ASAP(callback: () => void): void {
  setTimeout(callback, 0);
}