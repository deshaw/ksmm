import React, { useState, useEffect } from "react";
import { ReactWidget } from "@jupyterlab/apputils";
import Container from "react-bootstrap/Container";
// import { JSONSchema7 } from "json-schema";
import { requestAPI } from "./handler";
import CardGrid from "./components/kscardgrid";
import { SuccessAlertBox } from "./components/alerts";
import { IKsForm } from "./components/ksform";

import "bootstrap/dist/css/bootstrap.min.css";

const DuplicateAlert = (props: any) => {
  alert("A copy of " +props.original_kernel + " has been created.");
};

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
   * Handles the Kernel Selection
   * at the select screen. ,
   */
  const handleSelectKernelspec = (kernelName: string, e: any) => {
    const a = JSON.parse(JSON.stringify(data));
    setSelectedKernelName(kernelName);
    setKernelFormData(a[kernelName]);
    setShowForm(true);
  };

  /**
   * Return Home on click.
   * TODO: Add Guards to check if editing.
   */
  const handleGoHome = () => {
    setShowForm(false);
    setAlertBox(false);
  };

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

  const handleCopyKernelspec = (kernel_name: string) => {
    requestAPI("/copy", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      DuplicateAlert({ original_kernel: kernel_name });
      fetchSchema();
      fetchKernelSpec();
    });
  };

  const handleDeleteKernelspec = (kernel_name: string) => {
    requestAPI("/delete", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      alert("Deleting " + kernel_name);
      fetchSchema();
      fetchKernelSpec();
    });
  };

  /**
   * Handles a form submission when
   * kernels are modified in any form.
   *
   * Passed as a prop to Form
   */
   const handleKernelspecUpdate = (e: any) => {
    requestAPI("/", {
      method: "POST",
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(e.formData),
        originalKernelName: selectedKernelName,
      }),
    }).then((data: any) => {
      if (data.success) {
        setAlertBox(true);
        fetchSchema();
        fetchKernelSpec();
      }
    });
  }

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
    fetchSchema();
    fetchKernelSpec();
  }, []);

  return (
    <Container fluid>
      <div>Kernelspec Manager</div>
      {!showForm && cardData.map((cardPayload: any, idx) => (
        <CardGrid
          handleSelectKernelspec={handleSelectKernelspec}
          handleCopyKernelspec={handleCopyKernelspec}
          handleDeleteKernelspec={handleDeleteKernelspec}
          cardPayload={cardPayload}
          key={idx}
        />
      ))
      }
      {alertBox && <SuccessAlertBox handleClose={handleGoHome} />}
      {showForm && (
        <IKsForm
          schema={schema}
          formData={kernelFormData}
          onSubmit={handleKernelspecUpdate}
          onCancel={handleGoHome}
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
