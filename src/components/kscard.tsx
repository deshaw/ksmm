import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { FaRegEdit, FaCopy, FaTrash, FaWpforms } from "react-icons/fa";

const KsCard = (props: any): JSX.Element => {
  const { 
    kernelSpec,
    handleSelectKernelspec, 
    handleCopyKernelspec, 
    handleDeleteKernelspec,
    handleTemplateKernelspec
  } = props;

  const renderToolTip = (props: any): JSX.Element => <Tooltip id='card-tooltip' {...props}>{kernelSpec._ksmm.fs_path}</Tooltip>;

  return (
    <Card
      className='ksmm-kernel-cards'
      key={kernelSpec._ksmm.fs_path}
    >
      <Card.Header className="align-left">
        { kernelSpec._ksmm?.writeable ? <a
          className='ksmm-pointer'
          onClick={() => handleSelectKernelspec(kernelSpec)}
          >
            <FaRegEdit className='ksmm-button-enabled' title='Edit' />
          </a>
          : <FaRegEdit className='ksmm-button-disabled'/>
        }
        <a
          className='ksmm-pointer'
          onClick={() => handleCopyKernelspec(kernelSpec)}
          >
            <FaCopy className='ksmm-button-enabled' title='Copy' />
        </a>
        { kernelSpec._ksmm?.deletable ? <a
          className='ksmm-pointer'
          onClick={() => handleDeleteKernelspec(kernelSpec)}
          >
            <FaTrash className='ksmm-button-enabled' title='Delete' />
          </a>
          : <FaTrash className='ksmm-button-disabled' />
        }
        { kernelSpec.metadata?.template && <a
          className='ksmm-pointer fr'
          onClick={() => handleTemplateKernelspec(kernelSpec)}
          >
            <FaWpforms className='ksmm-button-enabled' title='Generate with Template' />
          </a>
        }
      </Card.Header>
      <Card.Body>
        <OverlayTrigger
            placement="bottom"
            overlay={renderToolTip}
        >
            <Card.Title>{kernelSpec.display_name}</Card.Title>
        </OverlayTrigger>
      </Card.Body>
    </Card>
  );
}

export default KsCard;
