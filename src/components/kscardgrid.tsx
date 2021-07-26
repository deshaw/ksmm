import React from "react";
import Card from "react-bootstrap/Card";
import { FaRegEdit, FaCopy, FaTrash } from "react-icons/fa";
import Form from "@rjsf/bootstrap-4";
import { KsSchema } from "../kschema";

const CardGrid = (props: any): JSX.Element => {
  const { cardPayload, handleSelectKernelspec, handleCopyKernelspec, handleDeleteKernelspec } = props;
  const ksInfo = cardPayload;
  const cardWidget = (props: any) => {
    return (
      <Card
        style={{
          width: "12rem",
          height: "12rem",
        }}
      >
        <Card.Body>
          <Card.Title>{ksInfo.jupyter_name}</Card.Title>
        </Card.Body>
        <Card.Footer className="align-left">
          <a
            style={{ cursor: "pointer" }}
            onClick={() => handleSelectKernelspec(ksInfo.kernel_name)}
          >
            <FaRegEdit />
          </a>
          <a
            style={{ cursor: "pointer" }}
            onClick={() => handleCopyKernelspec(ksInfo.kernel_name)}
          >
            <FaCopy />
          </a>
          <a
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteKernelspec(ksInfo.kernel_name)}
          >
            <FaTrash />
          </a>
        </Card.Footer>
      </Card>
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
