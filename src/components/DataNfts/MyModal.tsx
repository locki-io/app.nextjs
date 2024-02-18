import React, { ReactNode } from 'react';

type ModalProps = {
  openTrigger: React.ReactNode;
  isOpen: boolean;
  children?: ReactNode;
}

export const MyModal: React.FC<ModalProps> = (props) => {
  // Render nothing if modal is not open
  const { openTrigger, isOpen, children } = props;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-content">
          {/* Render the children (content) inside the modal */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default MyModal;