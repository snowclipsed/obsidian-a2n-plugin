import {App, Modal} from 'obsidian';

export class a2nModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        let {contentEl} = this;
        contentEl.setText('Simple modal');
    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}