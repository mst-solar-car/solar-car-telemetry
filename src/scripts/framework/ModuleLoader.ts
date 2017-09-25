import RegisteredModules = require("ModuleRegistration");





/**
 * ModuleLoader is responsible for handling the registration of modules and initializing them
 */
class ModuleLoader implements IModuleLoader { 

  private _moduleCache: any; 


  constructor() { 
    this._moduleCache = {};
  }


  /**
   * Loads all of the modules 
   */
  public Load(): Promise<ITelemetryModuleRegistration[]> {
    let dfd = new Deferred(); 

    // Load all the module registration files
    require(RegisteredModules, (...modules: ITelemetryModuleRegistration[]) => {
      // Add each module to the cache 
      for (let i = 0; i < modules.length; i++) { 
        this._moduleCache[modules[i].Name] = modules[i]; 
      }

      dfd.Resolve(modules);
    });

    
    return dfd.Promise;
  }



  /**
   * Resolves a specific module based on name
   * @param name Name of the module to resolve
   */
  public Resolve(name: string): ITelemetryModuleRegistration { 
    // Pull from the cache
    if (this._moduleCache[name]) { 
      return this._moduleCache[name]; 
    }

    // Module not registered
    console.error("Module " + name + " tried to be resolved but was not registered properly."); 

    return null;
  }



}


let instance = new ModuleLoader(); 
export = instance;