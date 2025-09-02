// src/utils/mockAuth.ts

export const mockLogin = async (username: string, password: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any credentials
  if (username && password) {
    return {
      success: true,
      data: {
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now(),
        user: {
          id: '1',
          email: username,
          name: 'Demo User',
          role: 'admin'
        }
      }
    };
  }
  
  throw new Error('Invalid credentials');
};