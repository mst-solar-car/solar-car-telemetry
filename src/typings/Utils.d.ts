type Guid = string;

interface IDeferred {
  Promise: Promise<any>;
  IsResolved: boolean;
  Resolve: (data?: any) => void;
  Reject: (data?: any) => void;
}


interface IParsedURL {
  Protocol: string;
  HostName: string;
  Host: string;
  Port: string;
  Path: string;
  Hash: string;
  Query: any;
  Complete: string;
}