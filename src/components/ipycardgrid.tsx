import React from "react";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaRegEdit, FaCopy, FaTrash } from "react-icons/fa";
import { IPyCardSchema } from "../ipyschema";

const DuplicateAlert = (props: any) => {
  alert(
    "A duplicate copy of " +
      props.original_kernel +
      " has been created, one moment."
  );
};

// TODO: remove and use jupyterlab service URL.
function getCookie(name: string): string | undefined {
    // From http://www.tornadoweb.org/en/stable/guide/security.html
    const matches = document.cookie.match('\\b' + name + '=([^;]*)\\b');
    return matches?.[1];
  }


const CardGrid = (props: any): JSX.Element => {
  const { cardPayload, handleSubmit } = props;

  // TODO : make this async ... and
  const handleCopyClick = (kernel_name: string) => {
    // TODO: remove and use jupyterlab service URL.
    const url =  document.location.origin+"/ks/copy";
    const xsrfToken = getCookie('_xsrf');
    // TODO: and once async, make this await fetch().
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-XSRFToken": xsrfToken
      },
      body: JSON.stringify({ name: kernel_name }),
    }).then((resp) => {
      console.log('copy response', resp);
      DuplicateAlert({ original_kernel: kernel_name });
    });
  };

  const handleDeleteClick = (kernel_name: string) => {
    // TODO: remove and use jupyterlab service URL.
    const url = document.location.origin+"/ks/delete";
    const xsrfToken = getCookie('_xsrf');
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-XSRFToken": xsrfToken
      },
      body: JSON.stringify({ name: kernel_name }),
    }).then(() => {
      alert("Deleting " + kernel_name);
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
                  // TODO: make this async
                  onClick={() => handleCopyClick(ipyinfo.kernel_name)}
                >
                  <FaCopy />
                </a>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteClick(ipyinfo.kernel_name)}
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
      <Form schema={IPyCardSchema} uiSchema={uiSchema} children={" "} />
    </div>
  );
};

export default CardGrid;
