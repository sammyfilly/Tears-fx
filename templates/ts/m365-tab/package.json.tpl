{
    "name": "{{SafeProjectNameLowerCase}}",
    "version": "0.1.0",
    "engines": {
        "node": "16 || 18"
    },
    "private": true,
    "dependencies": {
        "@fluentui/react-components": "^9.18.0",
        "@microsoft/mgt-element": "^2.11.1",
        "@microsoft/mgt-react": "^2.11.1",
        "@microsoft/mgt-teamsfx-provider": "^2.11.1",
        "@microsoft/microsoft-graph-client": "^3.0.7",
        "@microsoft/teams-js": "^2.34.0",
        "@microsoft/teamsfx": "^2.2.0",
        "@microsoft/teamsfx-react": "^3.0.0",
        "axios": "^0.21.1",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.8.0",
        "react-scripts": "^5.0.1"
    },
    "devDependencies": {
        "@types/node": "^14.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "@types/react-router-dom": "^5.3.3",
        "env-cmd": "^10.1.0",
        "typescript": "^4.1.2"
    },
    "scripts": {
        "dev:teamsfx": "env-cmd --silent -f .localConfigs npm run start",
        "start": "react-scripts start",
        "build": "react-scripts build",
        "eject": "react-scripts eject",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest"
        ]
    },
    "browserslist": {
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
    },
    "homepage": "."
}