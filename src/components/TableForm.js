import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import QueryForm from './QueryForm';

const TableForm = ({ table, index, formData, setFormData }) => {
  const loadTypes = ['FULL', 'INCREMENTAL'];
  const writeModes = ['APPEND', 'OVERWRITE', 'MERGE', 'PARTITION_OVERWRITE'];
  const viewTypes = ['materialized', 'standalone'];
  const isViewOptions = ['0', '1'];

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
    const newWriteMode = e.target.value;
    newReportName[0].tables[index].WriteMode = newWriteMode;
    
    // Remove table-level properties as they are managed at query level
    delete newReportName[0].tables[index].PrimaryKey;
    delete newReportName[0].tables[index].PartitionColumn;
    
    // If switching to non-MERGE mode, keep only the first query
    if (newWriteMode !== 'MERGE' && newReportName[0].tables[index].query.length > 1) {
      newReportName[0].tables[index].query = [newReportName[0].tables[index].query[0]];
    }
    
    // Update query-level properties based on write mode
    newReportName[0].tables[index].query.forEach(query => {
      if (newWriteMode === 'PARTITION_OVERWRITE') {
        // Remove PrimaryKey from queries in PARTITION_OVERWRITE mode
        delete query.PrimaryKey;
      } else if (newWriteMode === 'MERGE') {
        // Remove PartitionColumn from queries in MERGE mode
        delete query.PartitionColumn;
      }
    });
    
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

  const handleAddQuery = () => {
    const newReportName = [...formData.ReportName];
    const currentQueries = newReportName[0].tables[index].query;
    const currentWriteMode = newReportName[0].tables[index].WriteMode;
    
    // Only allow adding queries if in MERGE mode
    if (currentWriteMode !== 'MERGE') {
      alert('Multiple queries are only supported in MERGE mode');
      return;
    }
    
    // Find the highest QueryOrder value
    const maxOrder = currentQueries.reduce((max, query) => {
      const order = parseInt(query.QueryOrder) || 0;
      return order > max ? order : max;
    }, 0);
    
    // Create new query with next available order number
    const newQuery = {
      queryType: 'SQL',
      QueryName: '',
      QueryOrder: (maxOrder + 1).toString(),
      QueryFileName: '',
      queryParameter: {}
    };
    
    newReportName[0].tables[index].query.push(newQuery);
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
                style={{ height: '34px' }}
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
                style={{ height: '34px' }}
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
                style={{ height: '34px' }}
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
                style={{ height: '34px' }}
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
                style={{ height: '34px' }}
              >
                {isViewOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

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
            <Button 
              variant="secondary" 
              onClick={handleAddQuery} 
              className="dhl-button"
              disabled={table.WriteMode !== 'MERGE'}
              title={table.WriteMode !== 'MERGE' ? 'Multiple queries are only supported in MERGE mode' : ''}
            >
              Add Query
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TableForm; 