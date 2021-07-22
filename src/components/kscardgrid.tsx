import React from "react";
import Card from "react-bootstrap/Card";
import { FaRegEdit, FaCopy, FaTrash } from "react-icons/fa";

const CardGrid = (props: any): JSX.Element => {
  const { cardPayload, handleSelectKernelspec, handleCopyKernelspec, handleDeleteKernelspec } = props;
  return (
    <Card
      style={{
        width: "18rem",
        height: "12rem",
      }}
      key={cardPayload.kernel_name}
    >
      <Card.Body>
        <Card.Title>Kernel: {cardPayload.kernel_name}</Card.Title>
        <Card.Title>{cardPayload.jupyter_name}</Card.Title>
      </Card.Body>
      <Card.Footer className="align-left">
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleSelectKernelspec(cardPayload.kernel_name)}
        >
          <FaRegEdit />
        </a>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleCopyKernelspec(cardPayload.kernel_name)}
        >
          <FaCopy />
        </a>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteKernelspec(cardPayload.kernel_name)}
        >
          <FaTrash />
        </a>
      </Card.Footer>
    </Card>
  );

};

export default CardGrid;
