import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "./styles.css";

const GithubAccessTokenModal = ({ visible, setVisible }) => {
  const [token, setToken] = useState();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState();

  const onCreate = () => {
    if (!token) {
      setShowError(true);
      return setError("Add the Github access token");
    }

    window.localStorage.setItem("token", token);
    window.location.reload();
    setVisible(false);
  };

  return (
    <Modal show={visible} onHide={() => setVisible(false)}>
      <Modal.Header>Github Access Token</Modal.Header>
      <Modal.Body>
        {showError && <h3 className="error_field">{error}</h3>}
        <Row>
          <Col className="title_wrapper">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Title"
              className="title_input"
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onCreate}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GithubAccessTokenModal;
