// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { commands } from "vscode";

import { FxError, Result } from "@microsoft/teamsfx-api";

import treeViewManager from "./treeview/treeViewManager";
import { localize } from "./utils/localizeUtils";

type CommandHandler = (args?: unknown[]) => Promise<Result<unknown, FxError>>;

interface TeamsFxCommand {
  name: string;
  callback: CommandHandler;
  blockTooltip?: string;
}

class CommandController {
  private static instance: CommandController;

  private commandMap: Map<string, TeamsFxCommand>;
  // mapping between fx-core API and vscode command
  private commandNameMap: Map<string, string>;
  private exclusiveCommands: Set<string>;

  private constructor() {
    this.commandMap = new Map<string, TeamsFxCommand>();
    this.exclusiveCommands = new Set([
      "ms-copilot-extension.addEnvironment",
      "ms-copilot-extension.build",
      "ms-copilot-extension.create",
      "ms-copilot-extension.deploy",
      "ms-copilot-extension.manageCollaborator",
      "ms-copilot-extension.openFromTdp",
      "ms-copilot-extension.provision",
      "ms-copilot-extension.publish",
      "ms-copilot-extension.publishInDeveloperPortal",
    ]);
    this.commandNameMap = new Map<string, string>([
      ["create", "ms-copilot-extension.create"],
      ["createEnv", "ms-copilot-extension.addEnvironment"],
      ["deployArtifacts", "ms-copilot-extension.deploy"],
      ["executeUserTask buildPackage", "ms-copilot-extension.build"],
      ["grantPermission", "ms-copilot-extension.manageCollaborator"],
      ["listCollaborator", "ms-copilot-extension.manageCollaborator"],
      ["provisionResources", "ms-copilot-extension.provision"],
      ["publishApplication", "ms-copilot-extension.publish"],
      ["publishInDeveloperPortal", "ms-copilot-extension.publishInDeveloperPortal"],
    ]);
  }

  public static getInstance() {
    if (!CommandController.instance) {
      CommandController.instance = new CommandController();
    }
    return CommandController.instance;
  }

  public registerCommand(
    commandName: string,
    commandHandler: CommandHandler,
    runningLabelKey?: string
  ) {
    let blockTooltip = "";
    if (runningLabelKey) {
      blockTooltip = localize(
        `teamstoolkit.commandsTreeViewProvider.${runningLabelKey}.blockTooltip`
      );
    }
    this.commandMap.set(commandName, {
      name: commandName,
      callback: commandHandler,
      blockTooltip,
    });
  }

  public async runCommand(commandName: string, args: unknown[]) {
    const command = this.commandMap.get(commandName);
    if (command) {
      command.callback(args);
    }
  }

  public async lockedByOperation(operation: string) {
    await commands.executeCommand("setContext", "ms-copilot-extension.commandLocked", true);
    const commandName = this.commandNameMap.get(operation);
    if (commandName) {
      const command = this.commandMap.get(commandName);
      const blockedCommands = [...this.exclusiveCommands.values()].filter((x) => x !== commandName);
      await treeViewManager.setRunningCommand(commandName, blockedCommands, command?.blockTooltip);
    }
  }

  public async unlockedByOperation(operation: string) {
    await commands.executeCommand("setContext", "ms-copilot-extension.commandLocked", false);
    const commandName = this.commandNameMap.get(operation);
    if (commandName) {
      const blockedCommands = [...this.exclusiveCommands.values()].filter((x) => x !== commandName);
      await treeViewManager.restoreRunningCommand(blockedCommands);
    }
  }

  public dispose() {}
}

export default CommandController.getInstance();
