import { promptStructure } from "./promptStructure";

export interface a2nSettings {
    ollamaServerUrl: string;
    defaultModel: string;
    defaultTemperature: number;
    commands: promptStructure[];
}