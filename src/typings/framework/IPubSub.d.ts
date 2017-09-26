type PubSubToken = Guid; 

interface IPubSub { 
  Publish(notification: string, data?: any): void;
  Subscribe(notification: string, callback: (notification?: string, data?: any) => void): PubSubToken;

  PublishError(message: string, data?: any): void; 
  PublishWarning(message: string, data?: any): void;
}