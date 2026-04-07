import { useRef } from "react";
import { Modal } from "react-bootstrap";

function AyahModal({ ayah, onClose }) {
  const audioRef = useRef(null);

  function handleClose() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  }

  if (!ayah) return null;

  return (
    <Modal show={!!ayah} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Ayah {ayah.numberInSurah}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Arabic text */}
        <p className="modal-arabic">{ayah.text}</p>

        <hr />

        {/* English translation */}
        <p className="modal-translation">{ayah.translation}</p>

        {/* Audio player */}
        <audio
          ref={audioRef}
          controls
          src={ayah.audio}
          className="w-100 mt-3"
        />
      </Modal.Body>
    </Modal>
  );
}

export default AyahModal;
