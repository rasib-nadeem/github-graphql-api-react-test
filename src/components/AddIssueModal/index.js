import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

import "./styles.css";

const AddIssueModal = ({
  visible,
  setVisible,
  title,
  setTitle,
  description,
  setDescription,
  onCreate,
  showError,
  error,
}) => {
  return (
    <Modal show={visible} onHide={() => setVisible(false)}>
      <Modal.Header>New issue</Modal.Header>
      <Modal.Body>
        {showError && <h3 className="error_field">{error}</h3>}
        <Row>
          <Col className="title_wrapper">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="title_input"
            />
          </Col>
        </Row>
        <Row>
          <Col className="description_wrapper">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              cols="40"
              placeholder="Description"
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddIssueModal;
