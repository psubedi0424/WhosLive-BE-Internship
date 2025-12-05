export declare class AppController {
    health(): {
        status: string;
        timestamp: string;
    };
    version(): {
        name: string;
        version: string;
        environment: string;
    };
}
