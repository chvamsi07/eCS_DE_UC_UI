# eCS DE UC UI Documentation

## Overview
The eCS DE UC UI is a React-based application for managing data engineering configurations. It provides a user-friendly interface for creating and managing report configurations with tables, queries, and their associated parameters.

## Features

### Report Configuration
- Create and manage report configurations
- Set report name and department
- Configure smart scheduling options
- Manage source configurations

### Table Management
- Add and remove tables
- Configure table properties:
  - Table Name
  - Load Type (FULL/INCREMENTAL)
  - Write Mode (APPEND/OVERWRITE/MERGE/PARTITION_OVERWRITE)
  - View Type (materialized/standalone)
  - Is View (0/1)

### Query Management
- Add and remove queries for each table
- Configure query properties:
  - Query Type (SQL/SPARK)
  - Query Name
  - Query Order (auto-incremented)
  - Query File Name
  - Query Parameters

### Write Mode Specific Features

#### MERGE Mode
- Configure Primary Keys for each query
- Add/remove multiple primary keys
- Each query maintains its own set of primary keys

#### PARTITION_OVERWRITE Mode
- Configure Partition Column for each query
- Add/remove partition column
- Each query maintains its own partition column

## JSON Structure

```json
{
  "ReportName": [
    {
      "tablename": "string",
      "query": [
        {
          "queryType": "SQL|SPARK",
          "QueryName": "string",
          "QueryOrder": "string",
          "QueryFileName": "string",
          "queryParameter": {
            "key": "value"
          },
          "PrimaryKey": ["string"],  // For MERGE mode
          "PartitionColumn": "string" // For PARTITION_OVERWRITE mode
        }
      ],
      "LoadType": "FULL|INCREMENTAL",
      "WriteMode": "APPEND|OVERWRITE|MERGE|PARTITION_OVERWRITE",
      "IsView": "0|1",
      "View_Type": "materialized|standalone"
    }
  ]
}
```

## User Interface

### Report Form
- Report Name input
- Department selection
- Smart Scheduling configuration
- Source management

### Table Form
- Table configuration section
- Query management section
- Add/Remove table functionality

### Query Form
- Basic query information
- Query parameters management
- Primary Keys (for MERGE mode)
- Partition Column (for PARTITION_OVERWRITE mode)

## Development

### Prerequisites
- Node.js (v18.17.0 or higher)
- npm (v9.6.7 or higher)

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
```

### Building for Production
```bash
npm run build
```

## Deployment

### Netlify Deployment
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy site

### Environment Configuration
- Node Version: 18.17.0
- NPM Version: 9.6.7

## Best Practices

### Data Management
- Each query maintains independent configuration
- Primary Keys and Partition Columns are query-specific
- Query Order is automatically managed
- Empty configurations are not included in the JSON

### UI/UX
- Consistent styling across all components
- Clear section organization
- Intuitive add/remove functionality
- Proper validation and error handling

## Troubleshooting

### Common Issues
1. Build Failures
   - Ensure correct Node.js and npm versions
   - Clear npm cache if needed
   - Check for dependency conflicts

2. Deployment Issues
   - Verify netlify.toml configuration
   - Check build logs for errors
   - Ensure all required files are committed

3. Runtime Errors
   - Check browser console for errors
   - Verify JSON structure
   - Ensure all required fields are filled

## Support
For issues and support, please contact the development team or raise an issue in the repository. 