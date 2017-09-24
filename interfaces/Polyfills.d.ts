interface IDeferred { 
  Promise: Promise<any>; 
  IsResolved: boolean;
  Resolve: (data: any) => void;
  Reject: (data: any) => void;
}