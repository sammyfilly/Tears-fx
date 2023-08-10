// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Result, err, ok } from "@microsoft/teamsfx-api";
import { FxCore } from "../core/FxCore";
import { ErrnoCodes } from "./common";

export type JSONable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly JSONable[]
  | { readonly [key: string]: JSONable }
  | { toJSON(): JSONable };

/**
 * error stage: when the error happens, help to identify the command that user trigger
 */
export type ErrorStage =
  | Exclude<
      keyof FxCore,
      "getQuestion" | "on" | "tools" | "isFromSample" | "v3Implement" | "settingsVersion"
    >
  | "";

/**
 * error component: where the error happens, help to identify the codes where error happens
 */
export type ErrorComponent =
  | "t_vsc"
  | "t_cli"
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

/**
 * error category level 1
 */
export type ErrorType = "internal" | "external" | "unhandled";

/**
 * error responsibility body
 */
export type EntityType = "user" | "system";

/**
 * Internal typed error name, the error name describes the key error reason
 */
export type InternalErrorName =
  | "FileNotExists"
  | "FileExists"
  | "Permission"
  | "Execution"
  | "UserCancel"
  | "MissingEnvVars"
  | "Environment"
  | "Timeout"
  | "IllegalInput"
  | "InvalidFormat"
  | "Validation"
  | "Network"
  | "";
/**
 * External typed error name, the error name describes the key error reason
 */
export type ExternalErrorName =
  | "Network"
  | "Authentication"
  | "ResourceNotFound"
  | "ResourceConflict"
  | "Permission"
  | "RemoteService"
  | "";
/**
 * External source: indicate what external service that the error come from
 */
export type ExternalSource = "Graph" | "Azure" | "Teams" | "BotFx" | "SPFx" | "DevTools" | "M365";

/**
 * Unhandled error name, the error name is unknown and un-recognized
 */
export type UnhandledErrorName = "Unhandled";

interface TTKErrorOptions {
  type: ErrorType;
  name: InternalErrorName | ExternalErrorName | UnhandledErrorName;
  entity?: EntityType;
  stage?: ErrorStage;
  component?: ErrorComponent;
  source?: ExternalSource;
  reason?: string;
  innerError?: JSONable | Error;
  helpLink?: string;
  message?: string;
  displayMessage?: string;
  context?: JSONable;
}

export interface TTKInternalErrorOptions extends TTKErrorOptions {
  type: "internal";
  name: InternalErrorName;
}

export interface TTKExternalErrorOptions extends TTKErrorOptions {
  type: "external";
  name: ExternalErrorName;
  innerError: JSONable | Error;
}

export interface TTKUnhandledErrorOptions extends TTKErrorOptions {
  type: "unhandled";
  name: UnhandledErrorName;
  innerError: JSONable | Error;
}

export class TTKError extends Error {
  type: ErrorType;
  entity: EntityType;
  stage: ErrorStage;
  component: ErrorComponent;
  source?: ExternalSource;
  reason?: string;
  innerError?: JSONable | Error;
  helpLink?: string;
  displayMessage?: string;
  context?: JSONable;
  constructor(
    option: TTKInternalErrorOptions | TTKExternalErrorOptions | TTKUnhandledErrorOptions
  ) {
    const message = option.message || (option.innerError as { message: string })?.message;
    super(message);
    this.name = option.name;
    this.type = option.type;
    this.entity = option.entity || "system";
    this.stage = option.stage || errorContext.stage;
    this.component = option.component || errorContext.component || "";
    this.source = (option as TTKExternalErrorOptions).source || errorContext.source;
    this.reason = option.reason;
    this.innerError = option.innerError;
    this.helpLink = option.helpLink;
    this.displayMessage = option.displayMessage || this.message;
    this.context = option.context;
    Error.captureStackTrace(this, new.target);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ErrorContext {
  stage: ErrorStage = "";
  component: ErrorComponent = "";
  source?: ExternalSource;
}

export const errorContext = new ErrorContext();

export function ErrorContextMW(
  option:
    | { component: ErrorComponent; source: ExternalSource }
    | { component: ErrorComponent; source?: ExternalSource }
    | { component?: ErrorComponent; source: ExternalSource }
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    errorContext.component = errorContext.component || option.component || "";
    errorContext.source = errorContext.source || option.source;
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}

export function setErrorContext(
  option:
    | { component: ErrorComponent; source: ExternalSource }
    | { component: ErrorComponent; source?: ExternalSource }
    | { component?: ErrorComponent; source: ExternalSource }
): void {
  errorContext.component = errorContext.component || option.component || "";
  errorContext.source = errorContext.source || option.source;
}

class RuntimeError extends TTKError {
  constructor(e: any) {
    super({
      type: "internal",
      name: getRuntimeErrorName(e),
      innerError: e,
    });
  }
}

function getRuntimeErrorName(error: any): InternalErrorName {
  const code = error.code;
  return systemErrorCode2Name[code];
}

const systemErrorCode2Name: Record<string, InternalErrorName> = {
  EPERM: "Permission",
  ENOENT: "FileNotExists",
  EACCES: "Permission",
  EEXIST: "FileExists",
  ECONNREFUSED: "Network",
  ECONNRESET: "Network",
};

export function assembleError(error: any): TTKError {
  if (error instanceof TTKError) return error;
  const type = typeof error;
  if (type === "string") {
    return new UnhandledError(new Error(error as string));
  } else {
    const code = error.code as string;
    if (code && (ErrnoCodes[code] || code.startsWith("ERR_"))) {
      // convert to internal error
      return new RuntimeError(error);
    }
    return new UnhandledError(error);
  }
}

class UnhandledError extends TTKError {
  constructor(innerError: JSONable | Error) {
    super({
      type: "unhandled",
      name: "Unhandled",
      innerError: innerError,
    });
  }
}
class UserCancelError extends TTKError {
  constructor() {
    super({
      type: "internal",
      name: "UserCancel",
      message: "User Cancelled",
      entity: "user",
    });
  }
}

class AzureAuthenticationError extends TTKError {
  constructor(innerError: JSONable | Error) {
    super({
      type: "external",
      entity: "user",
      name: "Authentication",
      innerError: innerError,
      message: "Azure Authentication Error",
    });
  }
}

class MockCore {
  @ErrorContextMW({ component: "c_fxcore", source: "Azure" })
  provision(
    input: "run" | "cancel"
  ): Result<undefined, UserCancelError | AzureAuthenticationError> {
    if (input === "cancel") {
      return err(new UserCancelError());
    }
    if (input === "run") {
      const error = new Error("Azure Authentication Error");
      (error as any).code = 401;
      return err(new AzureAuthenticationError(error));
    }
    return ok(undefined);
  }
}

const core = new MockCore();
const res = core.provision("run");
if (res.isErr()) {
  console.log(res.error.innerError);
  console.log(JSON.stringify(res.error, Object.getOwnPropertyNames(res.error), 2));
}
