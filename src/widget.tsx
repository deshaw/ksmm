import React, { useState, useEffect } from "react";
import { ReactWidget } from "@jupyterlab/apputils";
import Container from "react-bootstrap/Container";
// import { JSONSchema7 } from "json-schema";
import { requestAPI } from "./handler";
import CardGrid from "./components/ipycardgrid";
import { SuccessAlertBox } from "./components/alerts";
import { IPyForm } from "./components/ipyform";

import "bootstrap/dist/css/bootstrap.min.css";

/**
 * React component for listing the possible
 * ipykernel options.
 *
 * @returns The React component.
 */
const KernelManagerComponent = (): JSX.Element => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [kernelFormData, setKernelFormData] = useState({});
  const [selectedKernelName, setSelectedKernelName] = useState("");
  const [cardData, setCardData] = useState([]);
  const [alertBox, setAlertBox] = useState(false);
  const [schema, setSchema] = useState({});

  /**
   * Handles a form submission when
   * kernels are modified in any form.
   *
   * Passed as a prop to Form
   */
  const handleKernelSubmission = (e: any) => {
    requestAPI("/", {
      method: "POST",
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(e.formData),
        originalKernelName: selectedKernelName,
      }),
    }).then((data: any) => {
      if (data.status == 200) {
        setAlertBox(true);
      }
    });
  }

  /**
   * Handles the Kernel Selection
   * at the select screen. ,
   */
  const handleSelectedKernel = (kernelName: string, e: any) => {
    const a = JSON.parse(JSON.stringify(data));
    setSelectedKernelName(kernelName);
    setKernelFormData(a[kernelName]);
    setShowForm(true);
  };

  /**
   * Return Home on click.
   * TODO: Add Guards to check if editing.
   */
  const handleGoingHome = () => {
    setShowForm(false);
    setAlertBox(false);
  };

  /**
   * Generate the package of data needed
   * to display at the card selection screen.
   *
   * This method is called on when then data is generated to
   * send into the method generating the card data.
   */
  const generateCardData = (ipydata: any) => {
    var arr: any = [];
    for (const property in ipydata) {
      var cardPayload = {
        kernel_name: `${property}`,
        jupyter_name: `${ipydata[property].display_name}`,
      }
      arr.push(cardPayload);
    }
    const rows = [...Array(Math.ceil(arr.length / 4))];
    const multiarr = rows.map((row, idx) => arr.slice(idx * 4, idx * 4 + 4));
    return multiarr;
  }

  useEffect(() => {
    const fetchSchema = async () => {
      requestAPI("/schema", {
        method: "GET",
      }).then((data: any) => {
        setSchema(data);
      });
    }
    const fetchKernelSpec = async () => {
      requestAPI("/", {
        method: "GET",
      }).then((data: any) => {
        setData(data);
        setCardData(generateCardData(data));
      });
    }
    fetchSchema();
    fetchKernelSpec();
  }, []);

  return (
    <Container fluid>
      <div>Kernelspec Manager</div>
      {!showForm && cardData.map((cardPayload: any, idx) => (
        <CardGrid
          handleSubmit={handleSelectedKernel}
          cardPayload={cardPayload}
          key={idx}
        />
      ))
      }
      {alertBox && <SuccessAlertBox handleClose={handleGoingHome} />}
      {showForm && (
        <IPyForm
          schema={schema}
          formData={kernelFormData}
          onSubmit={handleKernelSubmission}
        />
      )}
    </Container>
  );
}

/**
 * KernelspecManagerWidget main class.
 */
export class KernelspecManagerWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass("jp-Ksmm");
  }
  render(): JSX.Element {
    return <KernelManagerComponent />
  }
}
