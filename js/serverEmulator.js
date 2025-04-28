/**
 * Server Emulator for Steins;Gate Lab Member System
 * This emulates server-side functionality using localStorage and file reading
 */

const ServerEmulator = {
    // Storage keys
    USERS_STORAGE_KEY: 'smart87_amadeus_users',
    LOGS_STORAGE_KEY: 'smart87_amadeus_logs',
    
    // Initialize the server emulator
    init() {
        // Initialize FileStorage with the correct base path
        FileStorage.init('');
        
        // Load initial data from files
        this.loadInitialData();
        
        console.log('Server Emulator initialized');
    },
    
    // Load initial data from files
    async loadInitialData() {
        try {
            // Try to load users from file
            const users = await FileStorage.getUsers();
            if (users && users.length > 0) {
                // Store in localStorage as backup
                localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
                console.log('Loaded users from file:', users.length);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    },
    
    // Get users from localStorage
    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_STORAGE_KEY) || '[]');
    },
    
    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
    },
    
    // Get logs for a user
    getUserLogs(username) {
        const allLogs = JSON.parse(localStorage.getItem(this.LOGS_STORAGE_KEY) || '{}');
        return allLogs[username] || [];
    },
    
    // Save logs for a user
    saveUserLogs(username, logs) {
        const allLogs = JSON.parse(localStorage.getItem(this.LOGS_STORAGE_KEY) || '{}');
        allLogs[username] = logs;
        localStorage.setItem(this.LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    },
    
    // API: Login
    async login(username, password) {
        try {
            // First try to get users from file
            let users = await FileStorage.getUsers();
            
            // If file reading fails, fall back to localStorage
            if (!users || users.length === 0) {
                users = this.getUsers();
            }
            
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                return {
                    success: true,
                    user: {
                        username: user.username,
                        displayName: user.displayName,
                        labMemberNumber: user.labMemberNumber
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'An error occurred during login'
            };
        }
    },
    
    // API: Register
    async register(userData) {
        try {
            // Get users from localStorage
            let users = this.getUsers();
            
            // Check if username already exists
            if (users.some(u => u.username === userData.username)) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }
            
            // Generate Lab Member number
            const labMemberNumber = (users.length + 1).toString().padStart(3, '0');
            
            // Create new user
            const newUser = {
                ...userData,
                labMemberNumber,
                registeredAt: new Date().toISOString()
            };
            
            // Add to users and save
            users.push(newUser);
            this.saveUsers(users);
            
            // Initialize empty logs for the user
            this.saveUserLogs(userData.username, []);
            
            return {
                success: true,
                user: {
                    username: newUser.username,
                    displayName: newUser.displayName,
                    labMemberNumber: newUser.labMemberNumber
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'An error occurred during registration'
            };
        }
    },
    
    // API: Get logs
    async getLogs(username) {
        try {
            // First try to get logs from file
            let logs = await FileStorage.getUserLogs(username);
            
            // If file reading fails, fall back to localStorage
            if (!logs || logs.length === 0) {
                logs = this.getUserLogs(username);
            }
            
            return logs;
        } catch (error) {
            console.error('Get logs error:', error);
            return this.getUserLogs(username);
        }
    },
    
    // API: Save logs
    async saveLogs(username, logs) {
        try {
            // Save to localStorage
            this.saveUserLogs(username, logs);
            
            return {
                success: true,
                message: 'Logs saved successfully'
            };
        } catch (error) {
            console.error('Save logs error:', error);
            return {
                success: false,
                message: 'An error occurred while saving logs'
            };
        }
    },
    
    // API: Delete log
    async deleteLog(username, logToDelete) {
        try {
            // Get current logs
            const logs = this.getUserLogs(username);
            
            // Filter out the log to delete
            const updatedLogs = logs.filter(log =>
                log.timestamp !== logToDelete.timestamp ||
                log.message !== logToDelete.message
            );
            
            // Save updated logs
            this.saveUserLogs(username, updatedLogs);
            
            return {
                success: true,
                message: 'Log deleted successfully'
            };
        } catch (error) {
            console.error('Delete log error:', error);
            return {
                success: false,
                message: 'An error occurred while deleting the log'
            };
        }
    }
};

// Export the ServerEmulator object
window.ServerEmulator = ServerEmulator;
