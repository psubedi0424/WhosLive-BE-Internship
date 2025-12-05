export declare class AppController {
    ok(): {
        success: boolean;
        message: string;
    };
    fail(): void;
    missing(): {
        success: boolean;
        message: string;
    };
}
