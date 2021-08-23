import React from "react";
import Card from "react-bootstrap/Card";
import { FaRegEdit, FaCopy, FaTrash, FaEyeDropper } from "react-icons/fa";

const KsCard = (props: any): JSX.Element => {
  const { 
    cardPayload, 
    handleSelectKernelspec, 
    handleCopyKernelspec, 
    handleDeleteKernelspec,
    handleTemplateKernelspec
  } = props;
  return (
    <Card
      style={{
        width: "12rem",
        height: "12rem",
      }}
      key={cardPayload.kernel_name}
    >
      <Card.Body>
        <Card.Title>{cardPayload.kernel_name}</Card.Title>
        <Card.Subtitle>{cardPayload.jupyter_name}</Card.Subtitle>
      </Card.Body>
      <Card.Footer className="align-left">
        { handleSelectKernelspec && <a
          style={{ cursor: "pointer" }}
          onClick={() => handleSelectKernelspec(cardPayload.kernel_name)}
          >
            <FaRegEdit />
          </a>
        }
        { handleCopyKernelspec && <a
          style={{ cursor: "pointer" }}
          onClick={() => handleCopyKernelspec(cardPayload.kernel_name)}
          >
            <FaCopy />
          </a>
        }
        { handleDeleteKernelspec && <a
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteKernelspec(cardPayload.kernel_name)}
          >
            <FaTrash />
          </a>
        }
        { handleTemplateKernelspec && <a
          style={{ cursor: "pointer" }}
          onClick={() => handleTemplateKernelspec(cardPayload)}
          >
            <FaEyeDropper />
          </a>
        }
      </Card.Footer>
    </Card>
  );
}

export default KsCard;
