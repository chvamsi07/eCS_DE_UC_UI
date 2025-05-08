import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const QueryForm = ({ query, tableIndex, queryIndex, formData, setFormData }) => {
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [newPrimaryKey, setNewPrimaryKey] = useState('');
  const [newPartitionColumn, setNewPartitionColumn] = useState('');

  const handleQueryTypeChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex].queryType = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleQueryNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex].QueryName = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleQueryOrderChange = (e) => {
    const value = e.target.value;
    // Only allow integers
    if (value === '' || /^\d+$/.test(value)) {
      const newReportName = [...formData.ReportName];
      // Check if the value is unique within the table
      const isUnique = !newReportName[0].tables[tableIndex].query.some(
        (q, idx) => idx !== queryIndex && q.QueryOrder === value
      );
      
      if (isUnique) {
        newReportName[0].tables[tableIndex].query[queryIndex].QueryOrder = value;
        setFormData({ ...formData, ReportName: newReportName });
      }
    }
  };

  const handleQueryFileNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query[queryIndex].QueryFileName = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleAddParameter = () => {
    if (newParamKey.trim() && newParamValue.trim()) {
      const newReportName = [...formData.ReportName];
      const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
      
      // Initialize queryParameter only if it doesn't exist
      if (!currentQuery.queryParameter) {
        currentQuery.queryParameter = {};
      }
      
      currentQuery.queryParameter[newParamKey.trim()] = newParamValue.trim();
      setFormData({ ...formData, ReportName: newReportName });
      setNewParamKey('');
      setNewParamValue('');
    }
  };

  const handleRemoveParameter = (key) => {
    const newReportName = [...formData.ReportName];
    const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
    
    if (currentQuery.queryParameter) {
      delete currentQuery.queryParameter[key];
      
      // Remove queryParameter property if it's empty
      if (Object.keys(currentQuery.queryParameter).length === 0) {
        delete currentQuery.queryParameter;
      }
      
      setFormData({ ...formData, ReportName: newReportName });
    }
  };

  const handleRemoveQuery = () => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[tableIndex].query = newReportName[0].tables[tableIndex].query.filter((_, i) => i !== queryIndex);
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleAddPrimaryKey = () => {
    if (newPrimaryKey.trim()) {
      const newReportName = [...formData.ReportName];
      const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
      
      if (!currentQuery.PrimaryKey) {
        currentQuery.PrimaryKey = [];
      }
      currentQuery.PrimaryKey.push(newPrimaryKey.trim());
      setFormData({ ...formData, ReportName: newReportName });
      setNewPrimaryKey('');
    }
  };

  const handleRemovePrimaryKey = (keyIndex) => {
    const newReportName = [...formData.ReportName];
    const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
    
    if (currentQuery.PrimaryKey) {
      currentQuery.PrimaryKey = currentQuery.PrimaryKey.filter((_, i) => i !== keyIndex);
      if (currentQuery.PrimaryKey.length === 0) {
        delete currentQuery.PrimaryKey;
      }
      setFormData({ ...formData, ReportName: newReportName });
    }
  };

  const handleAddPartitionColumn = () => {
    if (newPartitionColumn.trim()) {
      const newReportName = [...formData.ReportName];
      const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
      currentQuery.PartitionColumn = newPartitionColumn.trim();
      setFormData({ ...formData, ReportName: newReportName });
      setNewPartitionColumn('');
    }
  };

  const handleRemovePartitionColumn = () => {
    const newReportName = [...formData.ReportName];
    const currentQuery = newReportName[0].tables[tableIndex].query[queryIndex];
    delete currentQuery.PartitionColumn;
    setFormData({ ...formData, ReportName: newReportName });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Query {queryIndex + 1}</h6>
          <Button variant="danger" onClick={handleRemoveQuery} className="dhl-button">
            Remove Query
          </Button>
        </div>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query Type</Form.Label>
              <Form.Select
                value={query.queryType}
                onChange={handleQueryTypeChange}
                required
                className="dhl-select"
                style={{ height: '34px' }}
              >
                <option value="SQL">SQL</option>
                <option value="SPARK">SPARK</option>
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
                style={{ height: '34px' }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Query Order</Form.Label>
              <Form.Control
                type="text"
                value={query.QueryOrder}
                onChange={handleQueryOrderChange}
                required
                className="dhl-select"
                style={{ height: '34px' }}
                placeholder="Enter unique number"
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
                style={{ height: '34px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        {formData.ReportName[0].tables[tableIndex].WriteMode === 'MERGE' && (
          <div className="mb-3">
            <h6 className="mb-2">Primary Keys</h6>
            <Row className="mb-2">
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={newPrimaryKey}
                  onChange={(e) => setNewPrimaryKey(e.target.value)}
                  placeholder="Enter primary key"
                  className="dhl-select"
                  style={{ height: '34px' }}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="secondary"
                  onClick={handleAddPrimaryKey}
                  className="dhl-button w-100"
                  disabled={!newPrimaryKey.trim()}
                  style={{ height: '34px' }}
                >
                  Add Key
                </Button>
              </Col>
            </Row>
            {query.PrimaryKey && query.PrimaryKey.length > 0 && (
              <div className="primary-keys-list">
                {query.PrimaryKey.map((key, keyIndex) => (
                  <Row key={keyIndex} className="mb-1">
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        value={key}
                        disabled
                        className="dhl-select bg-light"
                        style={{ height: '34px' }}
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="secondary"
                        className="dhl-button w-100"
                        onClick={() => handleRemovePrimaryKey(keyIndex)}
                        style={{ height: '34px' }}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </div>
        )}

        {formData.ReportName[0].tables[tableIndex].WriteMode === 'PARTITION_OVERWRITE' && (
          <div className="mb-3">
            <h6 className="mb-2">Partition Column</h6>
            <Row className="mb-2">
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={newPartitionColumn}
                  onChange={(e) => setNewPartitionColumn(e.target.value)}
                  placeholder="Enter partition column name"
                  className="dhl-select"
                  style={{ height: '34px' }}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="secondary"
                  onClick={handleAddPartitionColumn}
                  className="dhl-button w-100"
                  disabled={!newPartitionColumn.trim()}
                  style={{ height: '34px' }}
                >
                  Add
                </Button>
              </Col>
            </Row>
            {query.PartitionColumn && (
              <Row className="mb-1">
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={query.PartitionColumn}
                    disabled
                    className="dhl-select bg-light"
                    style={{ height: '34px' }}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="secondary"
                    className="dhl-button w-100"
                    onClick={handleRemovePartitionColumn}
                    style={{ height: '34px' }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        )}

        <div className="mb-3">
          <h6 className="mb-2">Query Parameters</h6>
          <Row className="mb-2">
            <Col md={5}>
              <Form.Control
                type="text"
                value={newParamKey}
                onChange={(e) => setNewParamKey(e.target.value)}
                placeholder="Parameter Key"
                className="dhl-select"
                style={{ height: '34px' }}
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
                placeholder="Parameter Value"
                className="dhl-select"
                style={{ height: '34px' }}
              />
            </Col>
            <Col md={2}>
              <Button
                variant="secondary"
                onClick={handleAddParameter}
                className="dhl-button w-100"
                disabled={!newParamKey.trim() || !newParamValue.trim()}
                style={{ height: '34px' }}
              >
                Add
              </Button>
            </Col>
          </Row>
          {query.queryParameter && Object.keys(query.queryParameter).length > 0 && 
            Object.entries(query.queryParameter).map(([key, value]) => (
              <div key={key} className="d-flex align-items-center gap-2 mb-1">
                <Form.Control
                  type="text"
                  value={key}
                  disabled
                  className="dhl-select bg-light"
                  style={{ height: '34px' }}
                />
                <Form.Control
                  type="text"
                  value={value}
                  disabled
                  className="dhl-select bg-light"
                  style={{ height: '34px' }}
                />
                <Button
                  variant="link"
                  className="text-danger p-0"
                  onClick={() => handleRemoveParameter(key)}
                  style={{ height: '34px', lineHeight: '34px' }}
                >
                  Remove
                </Button>
              </div>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QueryForm; 