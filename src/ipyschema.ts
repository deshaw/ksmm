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
  title: "ipykernel mm",
  type: "object",
  properties: {
    argv: { type: "array", items: { type: "string" } },
    env: { type: "object" },
    display_name: { type: "string" },
    language: { type: "string" },
    interrupt_mode: { type: "string" },
    metadata: { type: "object" },
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
  title: "iPyKernel Manager",
  type: "array",
  items: {
    type: "object",
    properties: {
      kernel_name: { type: "string" },
      jupyter_name: { type: "string" },
    },
  },
};
