import * as vscode from 'vscode';

const JIRA_WORD = /^(?!PR-)[A-Z][A-Z0-9]+-\d+$/;
const GITHUB_WORD = /^#\d+$/;
const GITHUB_PR_WORD = /^PR-\d+$/;

const JIRA_GLOBAL = /\b((?!PR-)[A-Z][A-Z0-9]+-\d+)\b/g;
const GITHUB_GLOBAL = /(^|\s)#(\d+)\b/g;
const GITHUB_PR_GLOBAL = /\b(PR-(\d+))\b/g;

function getConfig() {
	const cfg = vscode.workspace.getConfiguration('jiraGithubLinker');
	let jiraBase = (cfg.get<string>('jiraBaseUrl') || '').trim();
	let githubBase = (cfg.get<string>('githubRepoUrl') || '').trim();

	if (jiraBase && !jiraBase.endsWith('/browse/')) {
		if (!jiraBase.endsWith('/')) jiraBase += '/';
		if (!jiraBase.endsWith('browse/')) jiraBase += 'browse/';
	}
	if (githubBase && !githubBase.endsWith('/')) {
		githubBase += '/';
	}

	return {
		jiraBase,
		githubBase,
		enableHover: cfg.get<boolean>('enableHover', true),
		enableCodeLens: cfg.get<boolean>('enableCodeLens', true),
	};
}

function buildUrlsFromWord(word: string) {
	const { jiraBase, githubBase } = getConfig();
	const results: { label: string; url: string }[] = [];
	if (JIRA_WORD.test(word) && jiraBase) {
		results.push({ label: 'Open in Jira', url: `${jiraBase}${word}` });
	}
	if (GITHUB_WORD.test(word) && githubBase) {
		const issue = word.replace('#', '');
		results.push({ label: 'Open in GitHub', url: `${githubBase}issues/${issue}` });
	}
	if (GITHUB_PR_WORD.test(word) && githubBase) {
		const prNumber = word.replace('PR-', '');
		results.push({ label: 'Open in GitHub', url: `${githubBase}pull/${prNumber}` });
	}
	return results;
}

function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position) {
	return document.getWordRangeAtPosition(position, /[#A-Z0-9-]+/);
}

class TicketHoverProvider implements vscode.HoverProvider {
	provideHover(document: vscode.TextDocument, position: vscode.Position) {
		const range = getWordAtPosition(document, position);
		if (!range) return;
		const word = document.getText(range);
		const urls = buildUrlsFromWord(word);
		if (!urls.length) return;

		const md = new vscode.MarkdownString();
		md.isTrusted = true;
		urls.forEach(u => md.appendMarkdown(`[${u.label}](${u.url})\\n`));

		return new vscode.Hover(md, range);
	}
}

class TicketCodeLensProvider implements vscode.CodeLensProvider {
	private onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

	refresh() {
		this.onDidChangeCodeLensesEmitter.fire();
	}

	provideCodeLenses(document: vscode.TextDocument) {
		const { jiraBase, githubBase } = getConfig();
		if (!jiraBase && !githubBase) return [];

		const lenses: vscode.CodeLens[] = [];
		const text = document.getText();

		// Jira
		for (const m of text.matchAll(JIRA_GLOBAL)) {
			const match = m[1];
			if (!match) continue;
			const start = document.positionAt(m.index! + m[0].indexOf(match));
			const end = start.translate(0, match.length);
			const range = new vscode.Range(start, end);
			if (jiraBase) {
				lenses.push(new vscode.CodeLens(range, {
					title: 'Open in Jira',
					command: 'vscode.open',
					arguments: [vscode.Uri.parse(`${jiraBase}${match}`)]
				}));
			}
			lenses.push(new vscode.CodeLens(range, {
				title: 'Copy URL',
				command: 'jiraGithubLinker.copyUrl',
				arguments: [match]
			}));
		}

		// GitHub Issues
		for (const m of text.matchAll(GITHUB_GLOBAL)) {
			const issueNumber = m[2];
			if (!issueNumber) continue;
			const full = `#${issueNumber}`;
			const start = document.positionAt(m.index! + m[0].lastIndexOf('#'));
			const end = start.translate(0, full.length);
			const range = new vscode.Range(start, end);
			if (githubBase) {
				lenses.push(new vscode.CodeLens(range, {
					title: 'Open in GitHub',
					command: 'vscode.open',
					arguments: [vscode.Uri.parse(`${githubBase}issues/${issueNumber}`)]
				}));
			}
			lenses.push(new vscode.CodeLens(range, {
				title: 'Copy URL',
				command: 'jiraGithubLinker.copyUrl',
				arguments: [full]
			}));
		}

		// GitHub Pull Requests
		for (const m of text.matchAll(GITHUB_PR_GLOBAL)) {
			const prNumber = m[2];
			if (!prNumber) continue;
			const full = `PR-${prNumber}`;
			const start = document.positionAt(m.index! + m[0].indexOf('PR-'));
			const end = start.translate(0, full.length);
			const range = new vscode.Range(start, end);
			if (githubBase) {
				lenses.push(new vscode.CodeLens(range, {
					title: 'Open in GitHub',
					command: 'vscode.open',
					arguments: [vscode.Uri.parse(`${githubBase}pull/${prNumber}`)]
				}));
			}
			lenses.push(new vscode.CodeLens(range, {
				title: 'Copy URL',
				command: 'jiraGithubLinker.copyUrl',
				arguments: [full]
			}));
		}

		return lenses;
	}
}

function findWordAtSelection(editor: vscode.TextEditor): string | undefined {
	const sel = editor.selection;
	if (!sel) return;
	const doc = editor.document;
	const range = sel.isEmpty
		? getWordAtPosition(doc, sel.active)
		: new vscode.Range(sel.start, sel.end);
	if (!range) return;
	return doc.getText(range).trim().replace(/[.,;:)\\]]+$/, '');
}

export function activate(context: vscode.ExtensionContext) {
	const { enableHover, enableCodeLens } = getConfig();

	if (enableHover) {
		context.subscriptions.push(
			vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, new TicketHoverProvider())
		);
	}

	const lensProvider = new TicketCodeLensProvider();
	if (enableCodeLens) {
		context.subscriptions.push(
			vscode.languages.registerCodeLensProvider({ scheme: '*', language: '*' }, lensProvider)
		);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('jiraGithubLinker.copyUrl', async (explicitWord?: string) => {
			const cfg = getConfig();
			let word = explicitWord;
			if (!word) {
				const editor = vscode.window.activeTextEditor;
				if (editor) word = findWordAtSelection(editor);
			}
			if (!word) return;

			let url = '';
			if (JIRA_WORD.test(word) && cfg.jiraBase) url = `${cfg.jiraBase}${word}`;
			else if (GITHUB_WORD.test(word) && cfg.githubBase) url = `${cfg.githubBase}issues/${word.replace('#', '')}`;
			else if (GITHUB_PR_WORD.test(word) && cfg.githubBase) url = `${cfg.githubBase}pull/${word.replace('PR-', '')}`;

			if (url) {
				await vscode.env.clipboard.writeText(url);
				vscode.window.showInformationMessage(`Copied: ${url}`);
			} else {
				vscode.window.showWarningMessage('No Jira/GitHub reference found or base URL not set.');
			}
		}),

		vscode.commands.registerCommand('jiraGithubLinker.openUrl', async () => {
			const cfg = getConfig();
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			const word = findWordAtSelection(editor);
			if (!word) return;

			if (JIRA_WORD.test(word) && cfg.jiraBase)
				vscode.env.openExternal(vscode.Uri.parse(`${cfg.jiraBase}${word}`));
			else if (GITHUB_WORD.test(word) && cfg.githubBase)
				vscode.env.openExternal(vscode.Uri.parse(`${cfg.githubBase}issues/${word.replace('#', '')}`));
			else if (GITHUB_PR_WORD.test(word) && cfg.githubBase)
				vscode.env.openExternal(vscode.Uri.parse(`${cfg.githubBase}pull/${word.replace('PR-', '')}`));
			else
				vscode.window.showWarningMessage('No Jira/GitHub reference found or base URL not set.');
		}),

		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('jiraGithubLinker')) lensProvider.refresh();
		})
	);
}

export function deactivate() { }
