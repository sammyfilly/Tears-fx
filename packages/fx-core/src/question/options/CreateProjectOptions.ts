// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { CLICommandOption, CLICommandArgument } from "@microsoft/teamsfx-api";

export const CreateProjectOptions: CLICommandOption[] = [
  {
    name: "capability",
    questionName: "capabilities",
    type: "string",
    shortName: "c",
    description: "Specifies the Teams App capability.",
    required: true,
    choices: [
      "bot",
      "notification",
      "command-bot",
      "workflow-bot",
      "tab-non-sso",
      "sso-launch-page",
      "dashboard-tab",
      "tab-spfx",
      "link-unfurling",
      "search-app",
      "CollectFormMessagingExtension",
    ],
    choiceListCommand: "teamsfx list capabilities",
  },
  {
    name: "bot-host-type-trigger",
    type: "string",
    shortName: "t",
    description: "Specifies the trigger for `Chat Notification Message` app template.",
    default: "http-restify",
    choices: [
      "http-restify",
      "http-webapi",
      "http-and-timer-functions",
      "http-functions",
      "timer-functions",
    ],
  },
  {
    name: "spfx-solution",
    type: "string",
    shortName: "ss",
    description: "Create a new or import an existing SharePoint Framework solution.",
    default: "new",
    choices: ["new", "import"],
  },
  {
    name: "spfx-install-latest-package",
    type: "boolean",
    shortName: "sp",
    description: "Install the latest version of SharePoint Framework.",
    default: true,
  },
  {
    name: "spfx-framework-type",
    type: "string",
    shortName: "sfk",
    description: "Framework",
    default: "react",
    choices: ["react", "minimal", "none"],
  },
  {
    name: "spfx-webpart-name",
    type: "string",
    shortName: "sw",
    description: "Name for SharePoint Framework Web Part.",
    default: "helloworld",
  },
  {
    name: "spfx-folder",
    type: "string",
    shortName: "sf",
    description: "Directory or Path that contains the existing SharePoint Framework solution.",
  },
  {
    name: "copilot-plugin-option",
    type: "string",
    shortName: "cp",
    description: "Plugin for Copilot",
    choices: ["copilot-new-api", "copilot-api-spec", "copilot-ai-plugin"],
  },
  {
    name: "api-spec-location",
    type: "string",
    shortName: "oapi",
    description: "OpenAPI Spec",
  },
  {
    name: "openai-plugin-manifest-location",
    type: "string",
    shortName: "oai",
    description: "OpenAI Plugin Manifest",
  },
  {
    name: "api-operation",
    type: "array",
    shortName: "api",
    description: "Select an Operation",
  },
  {
    name: "programming-language",
    type: "string",
    shortName: "l",
    description: "Programming Language.",
    default: "javascript",
    choices: ["javascript", "typescript", "csharp"],
  },
  {
    name: "app-name",
    type: "string",
    shortName: "n",
    description: "Application name",
    required: true,
  },
];
export const CreateProjectArguments: CLICommandArgument[] = [];
