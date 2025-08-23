
# Jira & GitHub Linker

> Instantly turn Jira tickets and GitHub issues/PRs into clickable links in VS Code.

![Extension in action](media/jg-linker.png)

---

## 🚀 Features

- **Jira Ticket Linking**: Detects references like `ABC-123` and links to your Jira instance
- **GitHub Issue Linking**: Detects references like `#456` and links to your repo's issues
- **GitHub PR Linking**: Detects references like `PR-789` and links to pull requests
- **Hover Tooltips**: See clickable links on hover
- **CodeLens Actions**: Open/copy ticket/issue/PR URLs above relevant lines
- **Keyboard Shortcuts**: Fast commands to copy or open links

---

## 🛠️ Getting Started

1. **Install** this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Ankit628792.jira-github-linker)
2. **Configure** your Jira and GitHub base URLs in your VS Code settings:

```jsonc
{
    "jiraGithubLinker.jiraBaseUrl": "https://yourcompany.atlassian.net/browse/",
    "jiraGithubLinker.githubRepoUrl": "https://github.com/your-org/your-repo/"
}
```

---

## ⚙️ Configuration

| Setting                              | Type      | Default     | Description                                                        |
|--------------------------------------|-----------|-------------|--------------------------------------------------------------------|
| `jiraGithubLinker.jiraBaseUrl`       | `string`  | (required)  | Base URL for Jira tickets (must end with `/browse/`)               |
| `jiraGithubLinker.githubRepoUrl`     | `string`  | (required)  | Base URL for GitHub repository (must end with `/`)                 |
| `jiraGithubLinker.enableHover`       | `boolean` | `true`      | Show hover tooltips with links                                     |
| `jiraGithubLinker.enableCodeLens`    | `boolean` | `true`      | Show CodeLens actions above lines with references                  |

---

## 💡 Usage

- **Jira**: Write `ABC-123`, `PROJ-456`, etc. — links to your Jira board
- **GitHub Issues**: Write `#123` — links to your repo's issues
- **GitHub PRs**: Write `PR-123` — links to your repo's pull requests

### Commands

- `Jira & GitHub Linker: Copy Ticket/Issue URL` – Copy the URL to clipboard
- `Jira & GitHub Linker: Open Ticket/Issue in Browser` – Open the URL in your browser

### Keyboard Shortcuts

- `Cmd+K Cmd+C` (macOS) / `Ctrl+K Ctrl+C` – Copy URL
- `Cmd+K Cmd+O` (macOS) / `Ctrl+K Ctrl+O` – Open URL

---

## 🧪 Development & Testing

1. Clone this repo and run `npm install`
2. Press `F5` in VS Code to launch the extension in a new window
3. Run tests with the VS Code Test Runner or `npm run test` (if configured)

---

## 📝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---

## 🙏 Acknowledgements

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Inspired by productivity needs for dev teams

---

**Enjoy using Jira & GitHub Linker!**
