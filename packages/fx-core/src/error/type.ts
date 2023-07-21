// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FxCore } from "../core/FxCore";

export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

export type ErrorStage =
  | Exclude<
      keyof FxCore,
      "getQuestion" | "on" | "tools" | "isFromSample" | "v3Implement" | "settingsVersion"
    >
  | "";

export type ErrorSource =
  | "vsc"
  | "cli"
  | "c_fxcore"
  | "c_coordinator"
  | "c_configManager"
  | "c_envManager"
  | "c_resourceGroupHelper"
  | "c_settingsUtils"
  | "c_middleware"
  | "c_collaborator"
  | "c_question"
  | "c_ui"
  | "g_generator"
  | "g_copilotGenerator"
  | "g_spfxGenerator"
  | "g_officeAddinGenerator"
  | "a_teamsApp_create"
  | "a_teamsApp_validate"
  | "a_teamsApp_validateAppPackage"
  | "a_teamsApp_configure"
  | "a_teamsApp_copyAppPackageToSPFx"
  | "a_teamsApp_publishAppPackage"
  | "a_aad_create"
  | "a_aad_update"
  | "a_arm_deploy"
  | "a_botAadApp_create"
  | "a_azureAppService_zipDeploy"
  | "a_azureFunctions_zipDeploy"
  | "a_azureStorage_deploy"
  | "a_azureStorage_enableStaticWebsite"
  | "a_spfx_deploy"
  | "a_script_dotnetBuild"
  | "a_script_npmBuild"
  | "a_script_npxBuild"
  | "a_script"
  | "a_devTool_install"
  | "a_file_createOrUpdateEnvironmentFile"
  | "a_file_createOrUpdateJsonFile"
  | "a_botFramework_create"
  | "a_m365_acquire"
  | "a_add_addWebPart"
  | "";

export type ErrorType = "internal" | "external" | "unhandled";

export type EntityType = "user" | "system";

interface TTKErrorOptions {
  type: ErrorType;
  name: InternalErrorName | ExternalErrorName | UnhandledErrorName;
  entity?: EntityType;
  stage?: ErrorStage;
  source?: ErrorSource;
  category?: string;
  innerError?: Jsonable;
  helpLink?: string;
  message?: string;
  displayMessage?: string;
  context?: Jsonable;
}

export type InternalErrorName =
  | "FileNotFound"
  | "Permission"
  | "Execution"
  | "UserCancel"
  | "MissingEnvVars"
  | "Environment"
  | "Timeout"
  | "IllegalInput"
  | "InvalidFormat"
  | "Validation";

export type ExternalErrorName =
  | "Network"
  | "Authentication"
  | "ResourceNotFound"
  | "ResourceConflict"
  | "Permission"
  | "RemoteService";

export type UnhandledErrorName = "Unhandled";

export interface TTKInternalErrorOptions extends TTKErrorOptions {
  type: "internal";
  name: InternalErrorName;
  message: string;
}

export interface TTKExternalErrorOptions extends TTKErrorOptions {
  type: "external";
  name: ExternalErrorName;
  message: string;
}

export interface TTKUnhandledErrorOptions extends TTKErrorOptions {
  type: "unhandled";
  name: UnhandledErrorName;
  innerError: Jsonable;
}

export class TTKError extends Error {
  type: ErrorType;
  entity: EntityType;
  stage: ErrorStage;
  source: ErrorSource;
  category?: string;
  innerError?: Jsonable;
  helpLink?: string;
  displayMessage?: string;
  context?: Jsonable;
  constructor(
    option: TTKInternalErrorOptions | TTKExternalErrorOptions | TTKUnhandledErrorOptions
  ) {
    const message = option.message || (option.innerError as { message: string })?.message;
    super(message);
    this.name = option.name;
    this.type = option.type;
    this.entity = option.entity || "system";
    this.stage = option.stage || "";
    this.source = option.source || "";
    this.type = option.type;
    this.category = option.category;
    this.innerError = option.innerError;
    this.helpLink = option.helpLink;
    this.displayMessage = option.displayMessage || this.message;
    this.context = option.context;
    Error.captureStackTrace(this, new.target);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// option 1
class UserCancelError extends TTKError {
  constructor(stage: ErrorStage, source: ErrorSource) {
    super({
      type: "internal",
      name: "UserCancel",
      message: "User Cancelled",
      stage,
      source,
    });
  }
}

const cancelError1 = new UserCancelError("createProject", "c_fxcore");

// option 2
const cancelError2 = new TTKError({
  type: "internal",
  name: "UserCancel",
  message: "User Cancelled",
  stage: "createProject",
  source: "c_fxcore",
});

console.log(cancelError1);

console.log(cancelError2);
