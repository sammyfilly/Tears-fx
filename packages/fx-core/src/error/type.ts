// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

interface TTKErrorOptions {
  type?: "user" | "system";
  stage?: string;
  source?: string;
  category1: "internal" | "external" | "unhandled";
  category2?: string;
  category3?: string;
  innerError?: any;
  helpLink?: string;
  displayMessage?: string;
  context?: Record<string, string>;
  message?: string;
}

export type InternalErrorCategory2 =
  | "FileNotFound"
  | "PermissionDenied"
  | "Execution"
  | "UserCancel"
  | "MissingEnvVars"
  | "Environment"
  | "Timeout"
  | "IllegalInput"
  | "InvalidFormat"
  | "ValidationFailure";

export type ExternalErrorCategory2 =
  | "Network"
  | "Authentication"
  | "ResourceNotFound"
  | "ResourceConflict"
  | "PermissionDenied";

export interface TTKInternalErrorOptions extends TTKErrorOptions {
  category1: "internal";
  category2: InternalErrorCategory2;
}

export interface TTKExternalErrorOptions extends TTKErrorOptions {
  category1: "external";
  category2: ExternalErrorCategory2;
}

export interface TTKUnhandledErrorOptions extends TTKErrorOptions {
  category1: "unhandled";
  innerError: any;
}

export class TTKError extends Error {
  type: "user" | "system";
  stage: string;
  source: string;
  category1: "internal" | "external" | "unhandled";
  category2?: string;
  category3?: string;
  innerError?: any;
  helpLink?: string;
  displayMessage?: string;
  context?: Record<string, string>;
  constructor(
    option: TTKInternalErrorOptions | TTKExternalErrorOptions | TTKUnhandledErrorOptions
  ) {
    const message = option.message || option.innerError?.message;
    super(message);
    this.name = new.target.name;
    this.type = option.type || "system";
    this.stage = option.stage || "";
    this.source = option.source || "";
    this.category1 = option.category1;
    this.category2 = option.category2;
    this.category2 = option.category2;
    this.innerError = option.innerError;
    this.helpLink = option.helpLink;
    this.displayMessage = option.displayMessage;
    this.context = option.context;
    //stack
    Error.captureStackTrace(this, new.target);
    //prototype
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const error = new TTKError({
  type: "user",
  stage: "create",
  source: "core",
  category1: "unhandled",
  innerError: new Error("inner error"),
});

console.log(error);
console.log(error.name);
console.log(error instanceof TTKError);
