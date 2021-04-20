import React from "react";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import { iPyCardSchema } from "./ipyschema";
import { motion } from "framer-motion";

const SelectorComponent = (props: any): JSX.Element => {
  const { cardPayload, handleSubmit } = props;

  const cardWidget = (props: any) => {
    return cardPayload.map((ipyinfo: any) => (
      <motion.div className="container" whileHover={{ scale: 1.2 }}>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleSubmit(ipyinfo.kernel_name)}
        >
          <Card style={{ width: "18rem" }} className="mb-2">
            <Card.Body>
              <Card.Title>Jupyter: {ipyinfo.jupyter_name}</Card.Title>
              <Card.Title>Kernel: {ipyinfo.kernel_name}</Card.Title>
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
      <Form schema={iPyCardSchema} uiSchema={uiSchema} children={" "} />
    </div>
  );
};

export default SelectorComponent;
