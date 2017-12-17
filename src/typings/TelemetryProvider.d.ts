/**
 * Interface for an object that provides telemetry data
 */
interface ITelemetryProvider {
    Id: string;
    Name: string;
    Scope: string;
    GetDataValuesByKey(key: string): ITelemetryDataDTO;
    GetDataValues(): Generator;
    GetChartData(data: any): any;
}



interface ITelemetryDataDTO {
    Key: string;
    Scope: string;
    Registration: ITelemetryDataRegistration;
    Data: KnockoutObservableArray<IDataValue>;
}
