// Client-side API utilities

// Check if we are running on the client side
const isClient = typeof window !== 'undefined';
const token = isClient ? localStorage.getItem('crossposting_token') : null;

const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
};

// In a real application, these would make fetch requests to your backend
// For now, we will simulate the API responses

export const getConnectedAccounts = async () => {
    try {
        const response = await fetch('/api/accounts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
            }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const toggleAutoPost = async (id, status) => {
    try {
        const response = await fetch('/api/accounts', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
            },
            body: JSON.stringify({ id, auto_post: status })
        });
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};

export const disconnectAccount = async (id) => {
    try {
        const response = await fetch('/api/accounts', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
            },
            body: JSON.stringify({ id })
        });
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};

export const getOAuthUrl = async (platform) => {
    // Return the actual API routes for OAuth, passing the token for identification
    const token = localStorage.getItem('crossposting_token');
    return { url: `/api/oauth/${platform}?token=${token}` };
};

export const getPostStatus = async () => {
    try {
        const response = await fetch('/api/status', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
            }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
            }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};
