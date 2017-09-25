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

(window as any).Deferred = Deferred;


// Guid Generator 
(window as any).NewGuid = (): Guid => {
  let gen = () => { 
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
  };

  return  (gen() + gen() + "-" + gen() + "-4" + gen().substr(0,3) + "-" + gen() + "-" + gen() + gen() + gen()).toLowerCase();
}; 



// Loop through an array and wait for a promise to be resolved before continuing 
(window as any).PromiseLoop = (arr: any[], callback: any): Promise<any> => { 
  let finalDfd = new Deferred(); // Deferred to control the function return

  // Deferred/Promise to control the loop
  let dfd = new Deferred(); 
  let prom = dfd.Promise; 

  
  for (let i = 0; i < arr.length; i++) { 
    prom = prom.then(() => { 
      return callback(arr[i]); 
    });
  }

  dfd.Resolve();

  // After everything resolve the promise and return from the function
  prom.then(() => {
    finalDfd.Resolve();
  });
  

  return finalDfd.Promise;  
};