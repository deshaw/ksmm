import React from "react";
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";

const SelectorComponent = (props: any): JSX.Element => {
  const { vals, handleSubmit } = props;

  const schema: JSONSchema7 = {
    title: "iPyKernel Manager",
    type: "array",
    items: {
      type: "object",
      properties: {
        kernel: { type: "string" },
        jupyter_name: { type: "string" },
      },
    },
  };

  const cardWidget = (props: any) => {
    console.log("props: ", props.vals);
    return vals.map((ipyinfo: any) => (
      <motion.div className="container" whileHover={{ scale: 1.2 }}>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleSubmit(ipyinfo.kernel)}
        >
          <Card style={{ width: "18rem" }} className="mb-2">
            <Card.Body>
              <Card.Title>{ipyinfo.jupyter_name}</Card.Title>
              <Card.Title>{ipyinfo.kernel}</Card.Title>
            </Card.Body>
          </Card>
        </a>
      </motion.div>
    ));
  };

  const uiSchema = {
    "ui:ArrayFieldTemplate": cardWidget,
  };

  return (
    <div>
      <h3> Please Select a Kernel to Edit </h3>
      <Form schema={schema} uiSchema={uiSchema} children={" "} />
    </div>
  );
};

export default SelectorComponent;
