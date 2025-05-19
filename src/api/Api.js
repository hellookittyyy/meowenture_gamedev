class Api {
    constructor(game) {
        this.game = game;
        this.baseUrl = 'http://localhost:8000';
    }

    getAccessToken() {
        return this.game.registry.get('accessToken');
    }

    async authenticatedFetch(endpoint, options = {}) {
        const access = this.getAccessToken();
        if (!access) {
            throw new Error('No access token available');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, { 
            ...options, 
            headers 
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return response;
    }

    async getUserProfile() {
        try {
            const response = await this.authenticatedFetch('/api/profile/');
            if (!response.ok) throw new Error('Not logged in');

            const data = await response.json();
            // JUST CHECK FOR US
            console.log(data.username);
            console.log(data.email);

            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }
}

export default Api;