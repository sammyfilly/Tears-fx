// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { globalStateGet, globalStateUpdate } from "@microsoft/teamsfx-core";
import * as vscode from "vscode";
import { TelemetryTriggerFrom } from "../telemetry/extTelemetryEvents";

const welcomePageKey = "ms-copilot-vscode-extension.welcomePage.shown";

export async function openWelcomePageAfterExtensionInstallation(): Promise<void> {
  if (await globalStateGet(welcomePageKey, false)) {
    // Don't show: already showed
    return;
  }

  // Let's show!
  await globalStateUpdate(welcomePageKey, true);
  vscode.commands.executeCommand("ms-copilot-extension.openWelcome", TelemetryTriggerFrom.Auto);
  vscode.commands.executeCommand("workbench.view.extension.teamsfx");
}
