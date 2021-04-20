/*
 * This file is a special file that houses
 * the schema definitions for this entire application.
 *
 * rjsf is used effectively throughout the application for many purposes,
 * and then can be edited for form edits.
 */
import { JSONSchema7 } from "json-schema";

export const ipyschema: JSONSchema7 = {
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


