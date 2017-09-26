# Solar Car Telemetry Framework
> This project is currently a Work In Progress 

This is a front-end framework that allows for beautiful visualization of data coming from a Solar Car in real-time. 

Split up your data into groups and define a `module` for each of these groups, point each module at a data source, a websocket connection or a polling HTTP request. 


## Building and Running 
To build and run Solar Car Telemetry locally you need to have [Node.js](https://nodejs.org/) installed, or an IDE that will transpile LESS and TypeScript. 

Do the following when in a terminal inside this project directory:

1. Install developer dependencies 
```
npm install 
```

2. Run Build Tasks 
```
gulp
```

3. Start the HTTP server
```
cd build
http-server
```

4. Open Web browser 
```
http://localhost:8080
```