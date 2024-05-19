<br>
<h1 align=center>
<span> Discord Utility Bot </span>
<img align="center" src="./icons8-chatbot-94.png" alt="image" width="50" height="50">
</h1>

**Welcome to the Utility Discord Bot! This bot is designed to enhance your Discord server's functionality by providing a variety of helpful features, including survey systems, sticky messages, onboarding for new members, and group call notifications.**

## Features

<h3> Survey System </h3>

Create and manage surveys within your Discord server to gather feedback and opinions from your community.

<h3> Sticky Messages </h3>

Keep important messages at the top of your channels so they are always visible to your members.

<h3> Onboarding </h3>

Welcome and guide new members with a structured onboarding process to ensure they have all the information they need.

<h3> Group Call Notifications </h3>

Easily notify specific roles about upcoming group calls with direct messages.

## Commands

<h3> Survey </h3>

- `/survey [channel]` : Set up a survey in the specified channel.
- `/survey-close` : Close an existing survey.
- `/survey-delete` : Delete an existing survey.

<h3> Sticky Messages </h3>

- `/stick [channel] [message-link]` : Stick a message in the specified channel.
- `/unstick: Unstick the previous sticky message.

<h3> Onboarding </h3>

- `/onboard [member]` : Onboard a new member to the server.

<h3> Group Call </h3>

- `/group-call [role]` : Notify members of an upcoming group call by sending DMs to a specific role.

## Data Storage

The bot leverages Google Sheets as a database to store survey data and sticky message information, ensuring data is organized and easily accessible.

## Technologies Used

&emsp; ![Node.js](https://img.shields.io/badge/node.js-%23563D7C.svg?style=for-the-badge&logo=node.js&logoColor=white)
<br>
&emsp; ![Discord.js](https://img.shields.io/badge/discord.js-%23E34F26.svg?style=for-the-badge&logo=discord&logoColor=white)
<br>
&emsp; ![Google Sheets API](https://img.shields.io/badge/Google%20Sheets%20API-%231572B6.svg?style=for-the-badge&logo=googlesheets&logoColor=white)

## Getting Started

### Prerequisites
- Node.js
- Discord.js library
- Google Sheets API setup

### Installation

To run this project locally, follow these steps:

- Clone this repository::
```bash
git clone https://github.com/ritoncharlox/Discord-Utility-Bot.git
```
- Access the cloned directory:
```
cd Discord-Utility-Bot
```
- Install dependencies:
```
npm install
```
- Set up your configuration:
    - `config.json` : This file contains your Discord bot token, client ID, guild ID, client color, and role IDs. Fill in the appropriate values for each field. For example:
    ```json
    {
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "clientColor": "2f3136",
  "role1Id": "ROLE_1_ID",
  "role2Id": "ROLE_2_ID",
  "role3Id": "ROLE_3_ID"
  }
    ```
    - `trape-327504-ce5999dc2d27.json` : This JSON file contains your Google Sheets API credentials. You can obtain these credentials from the Google Cloud Console. Fill in the appropriate values for each field. For example:
    ```json
    {
  "type": "YOUR_TYPE",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "YOUR_AUTH_URI",
  "token_uri": "YOUR_TOKEN_URI",
  "auth_provider_x509_cert_url": "YOUR_AUTH_PROVIDER_X509_CERT_URL",
  "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL",
  "universe_domain": "YOUR_UNIVERSE_DOMAIN"
  }
    ```

- Start the bot:
    ```
    node index.js
    ```
- Make sure to replace "YOUR_DISCORD_BOT_TOKEN", "YOUR_CLIENT_ID", "YOUR_GUILD_ID", "ROLE_1_ID", "ROLE_2_ID", "ROLE_3_ID", and the fields in trape-327504-ce5999dc2d27.json with your actual token, client ID, guild ID, and role IDs. Additionally, replace all the placeholder fields in trape-327504-ce5999dc2d27.json with your actual Google Sheets API credentials.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to fork this repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.