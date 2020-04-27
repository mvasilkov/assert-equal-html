export declare function assertEqual(actual: string, expected: string, error?: string): Promise<void>;
export declare function assertNotEqual(actual: string, expected: string, error?: string): Promise<void>;
export declare function normalize(a: string): Promise<string>;
export declare function stripCollapse(a: string): string;
export declare function prettyPrint(lines: string[]): string;
