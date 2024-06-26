import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

interface Anything2NotesSettings {
    ollamaServerUrl: string;
    defaultModel: string;
    defaultTemperature: number;
    defaultPrompt: string;
}

const DEFAULT_SETTINGS: Anything2NotesSettings = {
    ollamaServerUrl: "http://localhost:11434",
    defaultModel: 'llama3',
    defaultTemperature: 0.5,
    defaultPrompt: 'Summarize the given text in your own words:',
}

export default class Anything2Notes extends Plugin {
    settings: Anything2NotesSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('book', 'Anything2Notes', async (evt: MouseEvent) => {
            const currentContent = await this.readCurrentFile();
            if (currentContent) {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (view) {
                    await this.writeNotes(view.editor, view, currentContent);
                } else {
                    new Notice('No active Markdown view');
                }
            }
        });

        ribbonIconEl.addClass('my-plugin-ribbon-class');

        this.addSettingTab(new SampleSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async readCurrentFile() {
        const currentFile = this.app.workspace.getActiveFile();
        
        if (currentFile) {
            try {
                const content = await this.app.vault.read(currentFile);
                console.log('Current file content:', content);
                new Notice(`Read current file.`);
                return content;
            } catch (error) {
                console.error('Error reading file:', error);
                new Notice('Error reading current file');
                return null;
            }
        } else {
            new Notice('No file is currently open');
            return null;
        }
    }

    async getPrompt(){

    }

    async writeNotes(editor: Editor, view: MarkdownView, content: string) {
        const cursorPosition = editor.getCursor();
        try {
            const response = await requestUrl({
                method: 'POST',
                url: `${this.settings.ollamaServerUrl}/api/generate`,
                body: JSON.stringify({
                    prompt: `${this.settings.defaultPrompt} ${content}`,
                    model: this.settings.defaultModel,
                    options: {
                        temperature: this.settings.defaultTemperature,
                    }
                })
            });

            const steps = response.text
                .split("\n")
                .filter((step) => step && step.length > 0)
                .map((step) => JSON.parse(step));
            
            const generatedText = steps
                .map((step) => step.response)
                .join("")
                .trim();
            
            editor.replaceRange(generatedText, cursorPosition);
            new Notice('Generated text inserted into the editor');
        } catch (error) {
            new Notice(`Error generating text: ${error.message}`);
        }
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: Anything2Notes;

    constructor(app: App, plugin: Anything2Notes) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        // Add your settings here
    }
}
