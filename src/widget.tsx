import React, { useState, useEffect } from "react";
import { ReactWidget } from "@jupyterlab/apputils";
import Container from "react-bootstrap/Container";
import { requestAPI } from "./handler";
import CardGrid from "./components/kscardgrid";
import { SuccessAlertBox } from "./components/alerts";
import { KsForm } from "./components/ksform";

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
  const [selectedKernelName, setSelectedKernelName] = useState('');
  const [cardData, setCardData] = useState([]);
  const [schema, setSchema] = useState({});
  const [alertBox, setAlertBox] = useState(false);

  /**
   * Handles the Kernel Selection
   * at the select screen.
   */
  const handleSelectKernelspec = (kernelName: string) => {
    setSelectedKernelName(kernelName);
    setKernelFormData((data as any)[kernelName]);
    setShowForm(true);
  }

  /**
   * Return Home on click.
   */
  const handleGoHome = () => {
    setShowForm(false);
    setAlertBox(false);
  }

  const refreshSchemas = () => {
    requestAPI("/schema", {
      method: "GET",
    }).then((s: any) => {
      setSchema(s);
    });
  }

  const refreshKernelspecs = () => {
    requestAPI("/", {
      method: "GET",
    }).then((res: any) => {
      setData(res);
      setCardData(createCardData(res));
    });
  }

  const handleCopyKernelspec = (kernel_name: string) => {
    requestAPI("/copy", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      alert("A copy of " + kernel_name + " has been created.");
      refreshKernelspecs();
    });
  };

  const handleDeleteKernelspec = (kernel_name: string) => {
    requestAPI("/delete", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      alert(kernel_name + " has been deleted.");
      refreshKernelspecs();
    });
  };

  /**
   * Handles a form submission when
   * kernels are modified in any form.
   *
   * Passed as a prop to Form.
   */
   const handleSubmitKernelspec = (e: any) => {
    requestAPI("/", {
      method: "POST",
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(e.formData),
        originalKernelName: selectedKernelName,
      }),
    }).then((data: any) => {
      if (data.success) {
        setAlertBox(true);
        refreshKernelspecs();
        setKernelFormData(e.formData);
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
  const createCardData = (ks: [any]) => {
    var arr = new Array();
    for (const property in ks) {
      arr.push({
        kernel_name: `${property}`,
        jupyter_name: `${ks[property].display_name}`,
      });
    }
    return arr;
  }

  useEffect(() => {
    refreshSchemas();
    refreshKernelspecs();
  }, []);

  return (
    <Container fluid>
      <div>Kernelspec Manager</div>
      {!showForm && 
        <div style={{
          display: "flex",
          flexWrap: "wrap"
        }}>
          {
          cardData.map((cardPayload: any, idx) => (
            <CardGrid
              handleSelectKernelspec={handleSelectKernelspec.bind(this)}
              handleCopyKernelspec={handleCopyKernelspec.bind(this)}
              handleDeleteKernelspec={handleDeleteKernelspec.bind(this)}
              cardPayload={cardPayload}
              key={idx}
            />
            ))
          }
        </div>
      }
      {alertBox && 
        <SuccessAlertBox handleClose={handleGoHome} />
      }
      {showForm && (
        <KsForm
          schema={schema}
          formData={kernelFormData}
          onSubmit={handleSubmitKernelspec.bind(this)}
          onCancel={handleGoHome.bind(this)}
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
