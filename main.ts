import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
// Remember to rename these classes and interfaces!
import ollama from 'ollama';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {

		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('book', 'Anything2Notes', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.readCurrentFile();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');
		
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');
		

		this.addCommand({
			id: 'write-note',
			name: 'Write a note from link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new SampleModal(this.app).open();
			},
			hotkeys: []
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: 'process-link',
			name: 'Process Provided Link',
			callback: () => {

			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event linkstener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async readDoc(string: docPath) {
		const fileContent = await this.app.vault.read(docPath);
		return fileContent;
	}

	async readCurrentFile() {
    const currentFile = this.app.workspace.getActiveFile();
    
    if (currentFile) {
      try {
        const content = await this.app.vault.read(currentFile);
        
        // Now 'content' contains the text of the current file
        console.log('Current file content:', content);
        
        // You can perform operations with the content here
        // For example, count words:
        const wordCount = content.split(/\s+/).length;
        new Notice(`Word count: ${wordCount}`);
        
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

	async saveDoc(string: docPath, content) {
		await this.app.vault.modify(docPath, content);
	}

	async writeNotes(string:content){
		const message = {role: 'user', content: "Hello, I am a user"};
		const processedContent = await ollama.chat({ model: 'llama2', messages: [message], stream: true })
t
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
