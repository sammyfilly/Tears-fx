export const CONFIGURATION_PREFIX = "ms-copilot-extension";
export enum ConfigurationKey {
  BicepEnvCheckerEnable = "prerequisiteCheck.bicep",
}

export const AzurePortalUrl = "https://portal.azure.com";

export enum SyncedState {
  Version = "teamsToolkit:synced:version",
}

export enum UserState {
  IsExisting = "teamsToolkit:user:isExisting",
}

export enum PrereleaseState {
  Version = "teamsToolkit:prerelease:version",
}

export enum GlobalKey {
  OpenWalkThrough = "ms-copilot-extension.openWalkThrough",
  OpenReadMe = "ms-copilot-extension.openReadMe",
  OpenSampleReadMe = "ms-copilot-extension.openSampleReadMe",
  ShowLocalDebugMessage = "ShowLocalDebugMessage",
  ShowLocalPreviewMessage = "ShowLocalPreviewMessage",
}

export const environmentVariableRegex = /\${{[a-zA-Z-_]+}}/g;

export const PublishAppLearnMoreLink =
  "https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-publish-overview";

export const DeveloperPortalHomeLink = "https://dev.teams.microsoft.com/home";

export const TerminalName = "Teams Toolkit";
