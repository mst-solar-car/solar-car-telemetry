/**
 * Interface for an object that provides telemetry data
 */
interface ITelemetryProvider {
    Id: string;
    Name: string;
    GetDataValues(): Generator;
    GetChartData(key: string): any;
}
