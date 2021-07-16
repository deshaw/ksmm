import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaRegEdit, FaCopy, FaTrash } from "react-icons/fa";
import Form from "@rjsf/bootstrap-4";
import { KsSchema } from "../kschema";

const CardGrid = (props: any): JSX.Element => {
  const { cardPayload, handleSelectKernelspec, handleCopyKernelspec, handleDeleteKernelspec } = props;
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
                  onClick={() => handleSelectKernelspec(ipyinfo.kernel_name)}
                >
                  <FaRegEdit />
                </a>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCopyKernelspec(ipyinfo.kernel_name)}
                >
                  <FaCopy />
                </a>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteKernelspec(ipyinfo.kernel_name)}
                >
                  <FaTrash />
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
      <Form schema={KsSchema} uiSchema={uiSchema} children={" "} />
    </div>
  );
};

export default CardGrid;
