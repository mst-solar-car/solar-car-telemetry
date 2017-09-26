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