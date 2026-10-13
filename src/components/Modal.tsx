import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ titleId, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal gives focus trapping and Escape handling for free.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      {children}
      <button className="button button--ghost" onClick={() => dialogRef.current?.close()}>
        Fermer
      </button>
    </dialog>
  );
}
