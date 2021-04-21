import React from "react";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { iPyCardSchema } from "./ipyschema";
import { motion } from "framer-motion";

const SelectorComponent = (props: any): JSX.Element => {
  const { cardPayload, handleSubmit } = props;

  const cardWidget = (props: any) => {
    return (
      <Row>
        {cardPayload.map((ipyinfo: any) => (
          <Col key={ipyinfo.kernel_name}>
            <motion.div whileHover={{ scale: 1.2 }}>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => handleSubmit(ipyinfo.kernel_name)}
              >
                <Card
                  style={{
                    width: "18rem",
                    height: "12rem",
                  }}
                >
                  <Card.Body>
                    <Card.Title>Jupyter: {ipyinfo.jupyter_name}</Card.Title>
                    <Card.Title>Kernel: {ipyinfo.kernel_name}</Card.Title>
                  </Card.Body>
                </Card>
              </a>
            </motion.div>
          </Col>
        ))}
      </Row>
    );
  };

  const uiSchema = {
    "ui:ArrayFieldTemplate": cardWidget,
  };

  return (
    <div>
      <Form schema={iPyCardSchema} uiSchema={uiSchema} children={" "} />
    </div>
  );
};

export default SelectorComponent;
