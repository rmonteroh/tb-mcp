# TicketBeep MCP Server

A Model Context Protocol (MCP) server that provides access to the TicketBeep API for media planning, campaign management, and event analytics.

## Features

- **Media Plan Generation**: Create comprehensive media plans for artists and venues
- **Artist Management**: Search and retrieve artist information and statistics
- **Campaign Management**: Create, update, and manage marketing campaigns
- **Event Discovery**: Find events and venues based on various criteria
- **Analytics & Dashboard**: Access dashboard data for insights and reporting
- **Activity Tracking**: Monitor user sessions and actions
- **Payment Integration**: Handle Stripe payment processing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ticketbeep-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure it:
```bash
cp env.example .env
```

4. Update the `.env` file with your TicketBeep API credentials:
```env
TICKETBEEP_API_BASE_URL=https://ticketbeep-api-dev.up.railway.app
TICKETBEEP_API_KEY=your_api_key_here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Available Tools

### Media Plan Tools
- `generate_media_plan`: Create a comprehensive media plan for an artist and venue
- `search_artists`: Search for artists by name
- `get_artist_by_id`: Get detailed artist information by ID
- `get_artist_stats`: Retrieve artist statistics and analytics
- `get_artist_metadata`: Get artist metadata and career information
- `score_zipcodes`: Score zipcodes based on artist data and demographics
- `discover_events`: Find events in a specific area and time range
- `discover_places`: Search for places using Google Places API
- `get_nearby_states`: Get nearby states based on radius

### Campaign Tools
- `create_campaign`: Create a new marketing campaign
- `get_campaigns`: Retrieve all campaigns
- `get_campaign_by_id`: Get a specific campaign by ID
- `update_campaign`: Update an existing campaign
- `delete_campaign`: Delete a campaign

### Billboard & Radio Tools
- `query_billboards`: Search and filter billboards
- `query_billboard_count_by_zipcode`: Get billboard counts by zipcode
- `query_analog_radio`: Search and filter analog radio stations

### Dashboard Tools
- `get_average_ticket_price`: Get average ticket price data
- `get_promoters`: Get promoter statistics
- `get_top_cities`: Get top cities data
- `get_top_genres`: Get top genres data
- `get_gross_revenue`: Get gross revenue data
- `get_traffic_shows`: Get traffic shows data

### Activity Tools
- `query_sessions`: Query user activity sessions
- `create_session`: Create a new activity session
- `deactivate_session`: Deactivate an activity session
- `query_actions`: Query user actions
- `create_action`: Create a new activity action

### Payment Tools
- `create_stripe_checkout`: Create a Stripe checkout session

### Authentication Tools
- `check_user_verification`: Check if a user is verified

## API Endpoints

The MCP server integrates with the following TicketBeep API endpoints:

- `/api/media-plan/*` - Media planning endpoints
- `/api/campaign/*` - Campaign management endpoints
- `/api/dashboard/*` - Dashboard analytics endpoints
- `/api/activity/*` - Activity tracking endpoints
- `/api/payment/*` - Payment processing endpoints
- `/api/auth/*` - Authentication endpoints

## Configuration

The server can be configured through environment variables:

- `TICKETBEEP_API_BASE_URL`: Base URL for the TicketBeep API
- `TICKETBEEP_API_KEY`: API key for authentication
- `TICKETBEEP_AUTH_TOKEN`: Optional auth token
- `MCP_SERVER_PORT`: Port for the MCP server (default: 3000)
- `MCP_SERVER_HOST`: Host for the MCP server (default: localhost)

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## License

MIT License

## Support

For support and questions, please refer to the TicketBeep API documentation or create an issue in this repository. 