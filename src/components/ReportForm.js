import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import TableForm from './TableForm';

const ReportForm = ({ initialData, onBack }) => {
  const departments = [
    "custservice",
    "domesticops",
    "common",
    "domesticprod",
    "domnetint",
    "finance",
    "intlops",
    "intlprod",
    "it",
    "prodtech",
    "sales"
  ];

  const [formData, setFormData] = useState(initialData || {
    department: '',
    ReportName: [{
      name: '',
      frequency: '',
      tables: [],
      Sources: [],
      Comments: '',
      Alert_E_Mail: [],
      PowerBI_Refresh: {
        DatasetID: '',
        GroupdID: ''
      }
    }]
  });

  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState({ Resource: '', Alias: '', SmartSchedule: '0' });

  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      department: e.target.value
    });
  };

  const handleReportNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0] = {
      ...newReportName[0],
      name: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleFrequencyChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0] = {
      ...newReportName[0],
      frequency: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleCommentsChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0] = {
      ...newReportName[0],
      Comments: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleAddTable = () => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables.push({
      tablename: '',
      query: [{
        queryType: 'SQL',
        QueryName: '',
        QueryOrder: '',
        QueryFileName: '',
        queryParameter: {}
      }],
      LoadType: 'FULL',
      WriteMode: 'APPEND',
      IsView: '0',
      View_Type: 'materialized'
    });
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleAddSource = () => {
    if (newSource.Resource && newSource.Alias) {
      const newReportName = [...formData.ReportName];
      newReportName[0].Sources.push({ ...newSource });
      setFormData({
        ...formData,
        ReportName: newReportName
      });
      setNewSource({ Resource: '', Alias: '', SmartSchedule: '0' });
    }
  };

  const handleAddEmail = () => {
    if (newEmail && !formData.ReportName[0].Alert_E_Mail.includes(newEmail)) {
      const newReportName = [...formData.ReportName];
      newReportName[0].Alert_E_Mail.push(newEmail);
      setFormData({
        ...formData,
        ReportName: newReportName
      });
      setNewEmail('');
    }
  };

  const handlePowerBIChange = (field) => (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].PowerBI_Refresh[field] = e.target.value;
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the JSON string
    const jsonString = JSON.stringify(formData, null, 2);
    
    // Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.department}_${formData.ReportName[0].name}.json`;
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="mt-4">
      <div className="dhl-form-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Report Configuration</h2>
          <Button 
            variant="secondary" 
            onClick={onBack}
            className="dhl-button"
          >
            Back to Options
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          <Card className="mb-2">
            <Card.Body>
              <h4 className="dhl-section-title">Basic Information</h4>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Department</Form.Label>
                    <Form.Select
                      value={formData.department}
                      onChange={handleDepartmentChange}
                      required
                      className="dhl-select"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Report Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.ReportName[0].name}
                      onChange={handleReportNameChange}
                      required
                      className="dhl-select"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Frequency</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.ReportName[0].frequency}
                      onChange={handleFrequencyChange}
                      className="dhl-select"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="dhl-form-section">
            <h4>Tables</h4>
            {formData.ReportName[0].tables.map((table, index) => (
              <TableForm
                key={index}
                table={table}
                index={index}
                formData={formData}
                setFormData={setFormData}
              />
            ))}
            <div className="text-end">
              <Button variant="secondary" onClick={handleAddTable} className="dhl-button">
                Add Table
              </Button>
            </div>
          </div>

          <div className="dhl-form-section">
            <h4>Sources</h4>
            <div className="mb-3">
              <Row className="mb-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Resource</Form.Label>
                    <Form.Control
                      type="text"
                      value={newSource.Resource}
                      onChange={(e) => setNewSource({ ...newSource, Resource: e.target.value })}
                      placeholder="Resource"
                      className="dhl-select"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Alias</Form.Label>
                    <Form.Control
                      type="text"
                      value={newSource.Alias}
                      onChange={(e) => setNewSource({ ...newSource, Alias: e.target.value })}
                      placeholder="Alias"
                      className="dhl-select"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Smart Schedule</Form.Label>
                    <Form.Select
                      value={newSource.SmartSchedule}
                      onChange={(e) => setNewSource({ ...newSource, SmartSchedule: e.target.value })}
                      className="dhl-select"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="secondary" 
                    onClick={handleAddSource} 
                    className="dhl-button mt-4"
                    disabled={!newSource.Resource || !newSource.Alias}
                  >
                    Add Source
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="source-list">
              {formData.ReportName[0].Sources.map((source, index) => (
                <div key={index} className="mb-2">
                  <Row>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        value={source.Resource}
                        disabled
                        className="dhl-select bg-light"
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        value={source.Alias}
                        disabled
                        className="dhl-select bg-light"
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        value={source.SmartSchedule === '1' ? 'Yes' : 'No'}
                        disabled
                        className="dhl-select bg-light"
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => {
                          const newReportName = [...formData.ReportName];
                          newReportName[0].Sources = newReportName[0].Sources.filter((_, i) => i !== index);
                          setFormData({ ...formData, ReportName: newReportName });
                        }}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </div>

          <div className="dhl-form-section">
            <h4>PowerBI Refresh Settings</h4>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dataset ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ReportName[0].PowerBI_Refresh.DatasetID}
                    onChange={handlePowerBIChange('DatasetID')}
                    className="dhl-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Group ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ReportName[0].PowerBI_Refresh.GroupdID}
                    onChange={handlePowerBIChange('GroupdID')}
                    className="dhl-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="dhl-form-section">
            <h4>Alert Emails</h4>
            <Row className="mb-2">
              <Col>
                <Form.Control
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email"
                  className="dhl-input"
                />
              </Col>
              <Col xs="auto">
                <Button variant="secondary" onClick={handleAddEmail} className="dhl-button">
                  Add Email
                </Button>
              </Col>
            </Row>
            <div className="email-list">
              {formData.ReportName[0].Alert_E_Mail.map((email, index) => (
                <div key={index} className="email-item">
                  <span>{email}</span>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => {
                      const newReportName = [...formData.ReportName];
                      newReportName[0].Alert_E_Mail = newReportName[0].Alert_E_Mail.filter((_, i) => i !== index);
                      setFormData({ ...formData, ReportName: newReportName });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <Button variant="primary" type="submit" className="dhl-button dhl-button-primary">
              Generate JSON
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default ReportForm; 