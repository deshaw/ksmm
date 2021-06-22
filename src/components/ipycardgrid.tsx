import React from "react";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaRegEdit, FaCopy } from "react-icons/fa";
import { iPyCardSchema } from "../ipyschema";

const CardGrid = (props: any): JSX.Element => {
  const { cardPayload, handleSubmit } = props;

  const handleCopyClick = () => {
    const url = "http://localhost:8888/ks/copy";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newname: "i'mthere" }),
    });
  };

  const cardWidget = (props: any) => {
    return (
      <Row className="pl-2 pr-2">
        {cardPayload.map((ipyinfo: any) => (
          <Col key={ipyinfo.kernel_name}>
            <Card
              style={{
                width: "18rem",
                height: "12rem",
              }}
            >
              <Card.Body>
                <Card.Title>Kernel: {ipyinfo.kernel_name}</Card.Title>
                <Card.Title>{ipyinfo.jupyter_name}</Card.Title>
              </Card.Body>
              <Card.Footer className="align-left">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSubmit(ipyinfo.kernel_name)}
                >
                  <FaRegEdit />
                </a>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCopyClick()}
                >
                  <FaCopy />
                </a>
              </Card.Footer>
            </Card>
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

export default CardGrid;
