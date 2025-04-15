// api/connections/client.ts

export type ConnectionStats = {
    connection_id: string;
    status: string;
    last_connected_at: string;
    created_at: string;
    error?: string;
  };
  
  export type ConnectionResponse = {
    connection_id: string;
    status: string;
    error?: string;
  };
  
  /**
   * Client for interacting with the connections API endpoints
   */
  export class ConnectionClient {
    private baseUrl: string;
    private token?: string;
  
    constructor(baseUrl: string = '/api', token?: string) {
      this.baseUrl = baseUrl;
      this.token = token;
    }
  
    /**
     * Set the API token for authenticated requests
     */
    setToken(token: string) {
      this.token = token;
    }
  
    /**
     * Common headers for API requests
     */
    private getHeaders(): HeadersInit {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
  
      return headers;
    }
  
    /**
     * Create a new connection configuration
     */
    async createConnection(service: string, config: Record<string, any>): Promise<ConnectionResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/connections/${service.toLowerCase()}`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(config),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error(`Error creating ${service} connection:`, error);
        throw error;
      }
    }
  
    /**
     * Get statistics for a connection
     */
    async getConnectionStats(connectionId: string): Promise<ConnectionStats> {
      try {
        const response = await fetch(`${this.baseUrl}/connections/stats`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ connection_id: connectionId }),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error(`Error getting connection stats:`, error);
        throw error;
      }
    }
  
    /**
     * Initiate a connection using configured credentials
     */
    async connect(connectionId: string): Promise<ConnectionResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/connections/connect`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ connection_id: connectionId }),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error(`Error connecting:`, error);
        throw error;
      }
    }
  
    /**
     * Microsoft 365 connection
     */
    async createMicrosoft365Connection(config: {
      tenant_id: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('microsoft365', config);
    }
  
    /**
     * Google Workspace connection
     */
    async createGoogleWorkspaceConnection(config: {
      account_id: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('googleworkspace', config);
    }
  
    /**
     * Dropbox connection
     */
    async createDropboxConnection(config: {
      app_key: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('dropbox', config);
    }
  
    /**
     * Slack connection
     */
    async createSlackConnection(config: {
      workspace_id: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('slack', config);
    }
  
    /**
     * Zoom connection
     */
    async createZoomConnection(config: {
      account_id: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('zoom', config);
    }
  
    /**
     * Jira connection
     */
    async createJiraConnection(config: {
      instance_url: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('jira', config);
    }
  
    /**
     * Custom API connection
     */
    async createCustomApiConnection(config: {
      api_url: string;
      api_key: string;
      auth_type: string;
      headers?: string;
    }): Promise<ConnectionResponse> {
      return this.createConnection('customapi', config);
    }
  }
  
  // Create a default client instance
  export const connectionClient = new ConnectionClient();
  
  export default connectionClient;