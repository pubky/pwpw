# pwpw (Pubky Password Manager)

## Introduction

In today's digital landscape, trusting big companies with your most sensitive information—like passwords—can be a leap of faith. Data breaches and unauthorized access are constant threats. During Pubky's Hackweek, we explored how the Pubky Core protocol can empower individuals to manage their data securely and privately. One outcome of this exploration is **pwpw**—a simple yet effective app that lets you store your passwords on your own home-server, giving you complete control.

**Note:** This is a demo app created to demonstrate the capabilities of the Pubky framework and the Tauri-based desktop app. **It is not recommended to use this for real data** as it is only for demonstration purposes.

## Features

- A simple desktop web-based password manager.
- Built with [Tauri](https://tauri.app/) for cross-platform compatibility.
- Leverages the Pubky Core protocol for data privacy and security.
- Lightweight and easy to use for quick setup.

## Installation

To get started with **pwpw**, follow the steps below:

### Prerequisites

- Install Tauri prerequisites as per the [Tauri documentation](https://tauri.app/start/prerequisites/).

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/pubky/pwpw.git
    ```

2. Navigate to the project directory:
    ```bash
    cd pwpw
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Run the app in development mode:
    ```bash
    npm run tauri dev
    ```

5. Build the app for production:
    ```bash
    npm run tauri build
    ```

## Usage

Once the app is running, you can:

- Add new passwords manually.
- Edit or delete existing passwords.

Remember, **this is a demo app**, so do not use it to store sensitive data.

## Contribution

Feel free to open an issue or a pull request if you want to contribute to the development of this project. We welcome feedback and suggestions!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
