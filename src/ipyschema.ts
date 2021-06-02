/*
 * This file is a special file that houses
 * the schema definitions for this entire application.
 *
 * rjsf is used effectively throughout the application for many purposes,
 * and then can be edited for form edits.
 */
import { JSONSchema7 } from "json-schema";

/*
 * The following schema complies to iPython Kernel
 * Standards. When making changes, note that the UI
 * is also subject to change based on the types.
 */
export const iPySchema: JSONSchema7 = {
  title: "iPyKernel Management Menu",
  type: "object",
  properties: {
    argv: { type: "array", items: { type: "string" }, title: "" },
    env: {
      type: "object",
      title: "object",
      properties: {
        EnvVar: { type: "string" },
      },
      additionalProperties: {
        type: "string",
      },
    },
    display_name: { type: "string", title: "Display Name" },
    language: { type: "string", title: "Programming Language" },
    interrupt_mode: {
      type: "string",
      title: "Interrupt Mode",
      enum: ["signal", "message"],
    },
    parameters: {
      type: "object",
      properties: {
        cores: { type: "string", enum: ["4", "6", "8"], title: "CPU Cores" },
        memory: {
          type: "string",
          enum: ["8GB", "16GB", "32GB"],
          title: "Memory",
        },
      },
    },
    metadata: { type: "object", title: "" },
  },
  required: [
    "argv",
    "display_name",
    "env",
    "interrupt_mode",
    "language",
    "metadata",
  ],
};

/*
 * This is the schema for the display cards rendered for
 * each kernel. It can be obtained by using the generation
 * function. When called on the ipyschema object, the function
 * returns a ipyCardSchema.
 */
export const iPyCardSchema: JSONSchema7 = {
  title: "iPyKernel Card",
  type: "array",
  items: {
    type: "object",
    properties: {
      kernel_name: { type: "string" },
      jupyter_name: { type: "string" },
    },
  },
};
