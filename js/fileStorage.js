/**
 * File Storage Utility for Steins;Gate Lab Member System
 * This utility provides functions to read and write data files directly in the repository
 */

const FileStorage = {
    // Base paths
    basePath: '',
    usersPath: 'data/users/users.json',
    logsPath: 'data/logs/',
    
    /**
     * Initialize the storage with the base path
     * @param {string} basePath - The base path for all file operations
     */
    init(basePath = '') {
        this.basePath = basePath;
        console.log('FileStorage initialized with base path:', this.basePath);
    },
    
    /**
     * Get the full path for a file
     * @param {string} relativePath - The relative path to the file
     * @returns {string} The full path
     */
    getFullPath(relativePath) {
        return `${this.basePath}${relativePath}`;
    },
    
    /**
     * Read a JSON file
     * @param {string} path - Path to the file
     * @returns {Promise<Object>} The parsed JSON data
     */
    async readJsonFile(path) {
        try {
            const response = await fetch(this.getFullPath(path));
            if (!response.ok) {
                throw new Error(`Failed to read file: ${path}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    },
    
    /**
     * Write data to a file using GitHub API
     * Note: This requires authentication and is not directly possible with GitHub Pages
     * This is a placeholder for a server-side implementation
     */
    async writeFile(path, data) {
        console.error('Direct file writing is not supported in static hosting.');
        console.log('Data that would be written:', data);
        return false;
    },
    
    /**
     * Get all users
     * @returns {Promise<Array>} Array of users
     */
    async getUsers() {
        return await this.readJsonFile(this.usersPath) || [];
    },
    
    /**
     * Get logs for a specific user
     * @param {string} username - The username
     * @returns {Promise<Array>} Array of logs
     */
    async getUserLogs(username) {
        const logPath = `${this.logsPath}${username}.json`;
        return await this.readJsonFile(logPath) || [];
    }
};

// Export the FileStorage object
window.FileStorage = FileStorage;
