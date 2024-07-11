import { a2nSettings } from "model/a2nSettings";

export const DEFAULT_SETTINGS: a2nSettings = {
    ollamaServerUrl: "http://localhost:11434",
    defaultModel: 'llama3',
    defaultTemperature: 0.5,
    commands: [
        {
            type: 'summarize',
            prompt: 'Summarize the given text in your own words:'
        },
        {
            type: 'generate',
            prompt: 'Generate a text based on the given text:'
        },
        {
            type: 'complete',
            prompt: 'Complete the given text:'
        }
        ]
    }