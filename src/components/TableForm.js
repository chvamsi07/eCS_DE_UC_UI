import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import QueryForm from './QueryForm';

const TableForm = ({ table, index, formData, setFormData }) => {
  const loadTypes = ['FULL', 'INCREMENTAL'];
  const writeModes = ['APPEND', 'OVERWRITE', 'MERGE', 'PARTITION_OVERWRITE'];
  const viewTypes = ['materialized', 'standalone'];
  const isViewOptions = ['0', '1'];
  const [newPrimaryKey, setNewPrimaryKey] = useState('');

  React.useEffect(() => {
    if (!table.PrimaryKey) {
      const newReportName = [...formData.ReportName];
      newReportName[0].tables[index].PrimaryKey = [];
      setFormData({ ...formData, ReportName: newReportName });
    }
  }, []);

  const handleTableNameChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].tablename = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleLoadTypeChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].LoadType = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleWriteModeChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].WriteMode = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleViewTypeChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].View_Type = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleIsViewChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].IsView = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleAddPrimaryKey = () => {
    if (newPrimaryKey.trim()) {
      const newReportName = [...formData.ReportName];
      if (!Array.isArray(newReportName[0].tables[index].PrimaryKey)) {
        newReportName[0].tables[index].PrimaryKey = [];
      }
      newReportName[0].tables[index].PrimaryKey.push(newPrimaryKey.trim());
      setFormData({ ...formData, ReportName: newReportName });
      setNewPrimaryKey('');
    }
  };

  const handleRemovePrimaryKey = (keyIndex) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].PrimaryKey = newReportName[0].tables[index].PrimaryKey.filter((_, i) => i !== keyIndex);
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handlePartitionColumnChange = (e) => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].PartitionColumn = e.target.value;
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleAddQuery = () => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables[index].query.push({
      queryType: 'SQL',
      QueryName: '',
      QueryOrder: '',
      QueryFileName: '',
      queryParameter: {}
    });
    setFormData({ ...formData, ReportName: newReportName });
  };

  const handleRemoveTable = () => {
    const newReportName = [...formData.ReportName];
    newReportName[0].tables = newReportName[0].tables.filter((_, i) => i !== index);
    setFormData({ ...formData, ReportName: newReportName });
  };

  const isViewTooltip = (
    <Tooltip id="isView-tooltip">
      <div className="text-start">
        <div>1 = Yes</div>
        <div>0 = No</div>
      </div>
    </Tooltip>
  );

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Table {index + 1}</h5>
          <Button variant="danger" onClick={handleRemoveTable} className="dhl-button">
            Remove Table
          </Button>
        </div>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Table Name</Form.Label>
              <Form.Control
                type="text"
                value={table.tablename}
                onChange={handleTableNameChange}
                required
                className="dhl-select"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Load Type</Form.Label>
              <Form.Select
                value={table.LoadType}
                onChange={handleLoadTypeChange}
                required
                className="dhl-select"
              >
                {loadTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label className="fw-bold">Write Mode</Form.Label>
              <Form.Select
                value={table.WriteMode}
                onChange={handleWriteModeChange}
                required
                className="dhl-select"
              >
                {writeModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label className="fw-bold">View Type</Form.Label>
              <Form.Select
                value={table.View_Type}
                onChange={handleViewTypeChange}
                required
                className="dhl-select"
              >
                {viewTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Is View
                <OverlayTrigger
                  placement="top"
                  overlay={isViewTooltip}
                >
                  <span className="ms-1" style={{ cursor: 'help' }}>ⓘ</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Select
                value={table.IsView}
                onChange={handleIsViewChange}
                required
                className="dhl-select"
              >
                {isViewOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {table.WriteMode === 'MERGE' && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Primary Keys</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={newPrimaryKey}
                    onChange={(e) => setNewPrimaryKey(e.target.value)}
                    placeholder="Enter primary key"
                    className="dhl-select"
                    style={{ height: '38px' }}
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleAddPrimaryKey}
                    className="dhl-button"
                    disabled={!newPrimaryKey.trim()}
                    style={{ height: '38px' }}
                  >
                    Add Key
                  </Button>
                </div>
                {Array.isArray(table.PrimaryKey) && table.PrimaryKey.length > 0 && (
                  <div className="primary-keys-list">
                    {table.PrimaryKey.map((key, keyIndex) => (
                      <div key={keyIndex} className="d-flex align-items-center gap-2 mb-1">
                        <Form.Control
                          type="text"
                          value={key}
                          disabled
                          className="dhl-select bg-light"
                          style={{ height: '38px' }}
                        />
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleRemovePrimaryKey(keyIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        )}

        {table.WriteMode === 'PARTITION_OVERWRITE' && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Partition Column</Form.Label>
                <Form.Control
                  type="text"
                  value={table.PartitionColumn || ''}
                  onChange={handlePartitionColumnChange}
                  placeholder="Enter partition column name"
                  required
                  className="dhl-select"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        <div className="queries-section">
          <h5 className="mb-3">Queries</h5>
          {table.query.map((query, queryIndex) => (
            <QueryForm
              key={queryIndex}
              query={query}
              tableIndex={index}
              queryIndex={queryIndex}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
          <div className="text-end">
            <Button variant="secondary" onClick={handleAddQuery} className="dhl-button">
              Add Query
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TableForm; 