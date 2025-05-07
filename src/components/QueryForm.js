import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const QueryForm = ({ query, tableIndex, queryIndex, formData, setFormData }) => {
  const queryTypes = ['SQL', 'PYTHON'];
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');

  const isQueryOrderUnique = (order) => {
    // Only check uniqueness within the same table
    return !formData.ReportName[0].tables[tableIndex].query.some((q, qIndex) => 
      qIndex === queryIndex ? false : q.QueryOrder === order
    );
  };

  const handleQueryTypeChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex] = {
      ...newReportName[0].tables[tableIndex].query[queryIndex],
      queryType: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleQueryNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex] = {
      ...newReportName[0].tables[tableIndex].query[queryIndex],
      QueryName: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleQueryOrderChange = (e) => {
    const order = e.target.value;
    if (!isQueryOrderUnique(order)) {
      alert('Query order must be unique within this table');
      return;
    }

    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex] = {
      ...newReportName[0].tables[tableIndex].query[queryIndex],
      QueryOrder: order
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleQueryFileNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex] = {
      ...newReportName[0].tables[tableIndex].query[queryIndex],
      QueryFileName: e.target.value
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleAddParameter = () => {
    if (newParamKey && newParamValue) {
      const newReportName = [...formData.ReportName];
      newReportName[0].tables[tableIndex].query[queryIndex] = {
        ...newReportName[0].tables[tableIndex].query[queryIndex],
        queryParameter: {
          ...newReportName[0].tables[tableIndex].query[queryIndex].queryParameter,
          [newParamKey]: newParamValue
        }
      };
      setFormData({
        ...formData,
        ReportName: newReportName
      });
      setNewParamKey('');
      setNewParamValue('');
    }
  };

  const handleRemoveParameter = (key) => {
    const newReportName = [...formData.ReportName];
    const newParams = { ...newReportName[0].tables[tableIndex].query[queryIndex].queryParameter };
    delete newParams[key];
    newReportName[0].tables[tableIndex].query[queryIndex] = {
      ...newReportName[0].tables[tableIndex].query[queryIndex],
      queryParameter: newParams
    };
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  const handleRemoveQuery = () => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query = newReportName[0].tables[tableIndex].query.filter((_, i) => i !== queryIndex);
    setFormData({
      ...formData,
      ReportName: newReportName
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query Type</Form.Label>
              <Form.Select
                value={query.queryType}
                onChange={handleQueryTypeChange}
                required
                className="dhl-select"
              >
                {queryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query Name</Form.Label>
              <Form.Control
                type="text"
                value={query.QueryName}
                onChange={handleQueryNameChange}
                required
                className="dhl-select"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query Order</Form.Label>
              <Form.Control
                type="number"
                value={query.QueryOrder}
                onChange={handleQueryOrderChange}
                required
                min="1"
                className="dhl-select"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query File Name</Form.Label>
              <Form.Control
                type="text"
                value={query.QueryFileName}
                onChange={handleQueryFileNameChange}
                required
                className="dhl-select"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-3">
          <h6 className="fw-bold">Query Parameters</h6>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                value={newParamKey}
                onChange={(e) => setNewParamKey(e.target.value)}
                placeholder="Parameter Key"
                className="dhl-select"
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
                placeholder="Parameter Value"
                className="dhl-select"
              />
            </Col>
            <Col md={2}>
              <Button 
                variant="secondary" 
                onClick={handleAddParameter}
                className="dhl-button"
                disabled={!newParamKey || !newParamValue}
              >
                Add
              </Button>
            </Col>
          </Row>
          <div className="parameter-list">
            {Object.entries(query.queryParameter || {}).map(([key, value]) => (
              <div key={key} className="parameter-item mb-2">
                <Row>
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      value={key}
                      disabled
                      className="dhl-select bg-light"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      value={value}
                      disabled
                      className="dhl-select bg-light"
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => handleRemoveParameter(key)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="danger"
          onClick={handleRemoveQuery}
          className="mt-2 dhl-button"
        >
          Remove Query
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QueryForm; 