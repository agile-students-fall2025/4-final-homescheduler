# Contributing to HomeScheduler

Thank you for considering contributing! This document provides a set of guidelines to help you get started.

---

## 📋 Table of Contents

- [Our Values & Process](#our-values--process)
  - [Team Norms](#team-norms)
  - [Git Workflow](#git-workflow)
  - [How to Contribute](#how-to-contribute)
- [Getting Started: Local Development](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Building & Testing](#building--testing)
  - [Running Tests](#running-tests)
  - [Creating a Production Build](#creating-a-production-build)

---

## 🤝 Our Values & Process

This project and everyone participating in it is governed by a code of conduct. By participating, you are expected to uphold this code.

### Team Norms
We operate on a few core principles to ensure a positive and productive environment:
* **Communicate Openly & Respectfully**: We're all on the same team. All communication should be constructive and considerate.

* **Assume Good Intent**: We approach all discussions with the belief that everyone is trying to do what's best for the project.
* **Embrace Feedback**: We actively seek out feedback. Be open to both giving and receiving constructive criticism.
* **Ownership & Accountability**: Take ownership of your work. If you say you'll do something, do it. If you can't, communicate that early.
* **Communication**: When messeaged respond within 3 days of being contacted
### Daily Standups
Our team will operate in **two-week sprints**. This cadence is designed to maintain a consistent pace, allowing for focused work without creating undue stress or complacency.

* **Schedule**: Standups will occur Thursday and Tuesday and Friday  at **10:00 AM EDT** and will last no more than 15 minutes.
* **Attendance**: All members are expected to be present and participate.
* **Accountability**: Members will not cover for those who are absent. A member who reports no progress on a task for two consecutive standups will be offered help by the team. If the block continues, it will be reported to management.

### Best Practices

* **Keep it Simple**: We will not over-engineer solutions. The goal is to write the minimum amount of code to get a feature working end-to-end, then iterate to improve it.
* **Code Reviews**: All code must be peer-reviewed and pass all automated tests before being merged into the `main` branch.
* **Working Code**: Always push working code. If you break the build, you are responsible for fixing it immediately.

### Git Workflow
We use the **Fork and Pull Request** model for all contributions.

1.  **Fork the Repository**: Start by creating your own copy of the repository.
2.  **Create a New Branch**: Create a new branch in your fork for your changes. Please use a descriptive branch name, such as:
    * `feature/new-login-page`
    * `bugfix/header-alignment-issue`
    * `docs/update-contributing-guide`
3.  **Make Your Changes**: Write your code and commit your changes with clear commit messages.
4.  **Push to Your Fork**: Push your new branch to your personal fork.
    ```bash
    git push origin feature/your-new-feature
    ```
5.  **Open a Pull Request**: Go to the original repository on GitHub and open a Pull Request from your branch to the `main` branch of our repository. Provide a detailed description of the changes you've made.

### How to Contribute
* **Reporting Bugs**: Before creating a bug report, please check the existing issues to see if it has already been reported. If not, create a new issue and provide a clear title, a detailed description of the problem, and steps to reproduce it.
* **Suggesting Enhancements**: If you have an idea for a new feature, please open an issue first to discuss it. This allows us to ensure your suggestion aligns with the project's goals before you spend time on the work.
* **Pull Requests**: Ensure your PR is focused on a single issue. Include a clear description of what it accomplishes and reference the issue it resolves (e.g., `Closes #42`).

---

## 🚀 Getting Started: Local Development

To work on this project locally, you'll need to set up your environment.

### Prerequisites
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (version 18.x or higher)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation
1.  Clone your forked repository to your local machine:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
    ```
2.  Navigate into the project directory:
    ```bash
    cd YOUR_REPOSITORY
    ```
3.  Install the project dependencies:
    ```bash
    npm install
    ```
4.  To start the development server, run:
    ```bash
    npm run dev
    ```

---

## ✅ Building & Testing

### Running Tests
To run the automated test suite, use the following command:
```bash
npm test