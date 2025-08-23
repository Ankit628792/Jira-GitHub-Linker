# Jira & GitHub Linker

A VS Code extension that turns Jira tickets, GitHub issues, and GitHub pull requests into clickable links directly in your code editor.

## Features

- **Jira Tickets**: Automatically detects and links Jira ticket references (e.g., `ABC-123`)
- **GitHub Issues**: Automatically detects and links GitHub issue references (e.g., `#456`)
- **GitHub Pull Requests**: Automatically detects and links GitHub PR references (e.g., `PR-789`)
- **Hover Tooltips**: Hover over any reference to see clickable links
- **CodeLens Actions**: Click actions above lines with references to open or copy URLs
- **Keyboard Shortcuts**: Quick commands to copy URLs or open in browser

![Extension in action](media/jg-linker.png)

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

This extension contributes the following settings:

* `jiraGithubLinker.jiraBaseUrl`: Base URL for Jira tickets (must end with `/browse/`)
* `jiraGithubLinker.githubRepoUrl`: Base URL for GitHub repository (must end with `/`)
* `jiraGithubLinker.enableHover`: Enable/disable hover tooltips (default: true)
* `jiraGithubLinker.enableCodeLens`: Enable/disable CodeLens actions (default: true)

### Example Configuration

```json
{
    "jiraGithubLinker.jiraBaseUrl": "https://mycompany.atlassian.net/browse/",
    "jiraGithubLinker.githubRepoUrl": "https://github.com/my-org/my-repo/",
    "jiraGithubLinker.enableHover": true,
    "jiraGithubLinker.enableCodeLens": true
}
```

## Usage

### Supported Formats

- **Jira**: `ABC-123`, `PROJ-456`, `TASK-789`
- **GitHub Issues**: `#123`, `#456`, `#789`
- **GitHub Pull Requests**: `PR-123`, `PR-456`, `PR-789`

### Commands

- `Jira & GitHub Linker: Copy Ticket/Issue URL` - Copy the URL to clipboard
- `Jira & GitHub Linker: Open Ticket/Issue in Browser` - Open the URL in your default browser

### Keyboard Shortcuts

- `Cmd+K Cmd+C` (macOS) / `Ctrl+K Ctrl+C` (Windows/Linux) - Copy URL
- `Cmd+K Cmd+O` (macOS) / `Ctrl+K Ctrl+O` (Windows/Linux) - Open URL

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
