/**
 * Interface for an object that provides telemetry data
 */
interface ITelemetryProvider {
    Id: string;
    Name: string;
    GetDataValues(): Generator;
    GetChartData(data: any): any;
}



interface ITelemetryDataDTO {
    Key: string;
    Registration: ITelemetryDataRegistration;
    Data: KnockoutObservableArray<IDataValue>;
}
