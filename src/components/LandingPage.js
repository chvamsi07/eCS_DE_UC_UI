import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import ReportForm from './ReportForm';

const LandingPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [existingJson, setExistingJson] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setExistingJson(jsonData);
          setSelectedOption('existing');
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (selectedOption === 'new' || (selectedOption === 'existing' && existingJson)) {
    return (
      <ReportForm 
        initialData={existingJson}
        onBack={() => {
          setSelectedOption(null);
          setExistingJson(null);
        }}
      />
    );
  }

  return (
    <Container className="mt-5">
      <div className="dhl-form-container">
        <h2 className="text-center mb-4">Report Configuration</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h4 className="text-center mb-4">Select an Option</h4>
                <Row className="g-3">
                  <Col md={6}>
                    <Button
                      variant="primary"
                      className="dhl-button dhl-button-primary w-100 py-3"
                      onClick={() => setSelectedOption('new')}
                    >
                      Create New JSON
                    </Button>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column">
                      <Button
                        variant="secondary"
                        className="dhl-button w-100 py-3 mb-2"
                        onClick={() => document.getElementById('jsonFileInput').click()}
                      >
                        Work with Existing JSON
                      </Button>
                      <input
                        type="file"
                        id="jsonFileInput"
                        accept=".json"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default LandingPage; 