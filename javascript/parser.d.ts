import SAXParser from 'parse5-sax-parser';
declare type InitParser = {
    parser: SAXParser;
    getResult: () => string;
};
export declare function initParser(): InitParser;
export declare function stripCollapse(a: string): string;
export declare function prettyPrint(lines: string[]): string;
export {};
