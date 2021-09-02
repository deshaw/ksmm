kernel_schema = '''{
  "title": "Kernelspec Management Menu",
  "type": "object",
  "properties": {
    "argv": { "type": "array", "items": { "type": "string" }, "title": "" },
    "env": {
      "type": "object",
      "title": "object",
      "properties": {
        "EnvVar": { "type": "string" }
      },
      "additionalProperties": {
        "type": "string"
      }
    },
    "display_name": { "type": "string", "title": "Display Name" },
    "language": { "type": "string", "title": "Programming Language" },
    "interrupt_mode": {
      "type": "string",
      "title": "Interrupt Mode",
      "enum": ["signal", "message"]
    },
    "parameters": {
      "type": "object",
      "properties": {
        "cores": { "type": "string", "enum": [], "title": "CPU Cores" },
        "memory": {
          "type": "string",
          "enum": [],
          "title": "Memory"
        }
      }
    },
    "metadata": { "type": "object", "title": "" }
  },
  "required": [
    "argv",
    "display_name",
    "env",
    "interrupt_mode",
    "language",
    "metadata"
  ]
}'''
