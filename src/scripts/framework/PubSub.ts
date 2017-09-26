/**
 * Class for publishing and subscribing to a thingy
 */
class PubSub implements IPubSub { 

  private _subscriptions: any; // Hashmap for subscriptions notification_name -> list of PubSubTokens
  private _tokensToCallbacks: any; // Hashmap PubSubToken -> function
  
  private _container: HTMLElement;

  constructor() { 
    this._subscriptions = {}; 
    this._tokensToCallbacks = {};

    this._container = document.getElementById('NotificationContainer');
  }


  /**
   * Sends a notification to subscribers
   * @param notification Name of notification
   * @param data Any data to send to subscribers
   */
  public Publish(notification: string, data?: any) { 
    notification = notification.toLowerCase(); 

    if (!this._subscriptions[notification]) 
      this._subscriptions[notification] = []; // Create entry if it doesn't exist

    let subs = this._subscriptions[notification];

    // Perform all subscriptions to the notification
    for (let i = 0; i < subs.length; i++) { 
      setTimeout(() => {
        // Call the callback function
        this._tokensToCallbacks[subs[i]](notification, data);
      }, 0);
    }
  }


  /**
   * Subscribe to a notification event
   * @param notification Name of notification to subscribe to
   * @param callback Callback to be performed when this notification is published
   */
  public Subscribe(notification: string, callback: (notification: string, data?: any) => void): PubSubToken { 
    notification = notification.toLowerCase(); 

    let token = Guid() as PubSubToken;

    if (!this._subscriptions[notification]) 
      this._subscriptions[notification] = []; 

    this._subscriptions[notification].push(token); // Add the token to the subscription list
    this._tokensToCallbacks[token] = callback; // Save the callback

    return token; 
  }


  /**
   * Publishes an error message
   * @param message Error message
   * @param data Any data with the error
   */
  public PublishError(message: string, data?: any): void { 
    console.error(message, data); 

    let notification_el = document.createElement('div'); 
    notification_el.classList.add('alert'); 
    notification_el.classList.add('alert-danger'); 
    notification_el.setAttribute('role', 'alert'); 
    notification_el.innerHTML = message; 

    this._container.appendChild(notification_el);
    // Remove after 3 seconds
    setTimeout(() => {
      this._container.removeChild(notification_el);
    }, 3000);
    
    // Notify subscribers 
    this.Publish('error', { Message: message, Data: data } );
  }


  /**
   * Publishes a warning message
   * @param message Warning message
   * @param data And data with the warning
   */
  public PublishWarning(message: string, data?: any): void { 
    console.warn(message, data); 
    
      let notification_el = document.createElement('div'); 
      notification_el.classList.add('alert'); 
      notification_el.classList.add('alert-warning'); 
      notification_el.setAttribute('role', 'alert'); 
      notification_el.innerHTML = message; 
  
      this._container.appendChild(notification_el);
      // Remove after 3 seconds
      setTimeout(() => {
        this._container.removeChild(notification_el);
      }, 3000);
      
      // Notify subscribers 
      this.Publish('warning', { Message: message, Data: data } );
  }
  

}


let instance = new PubSub(); 
export = instance;