module.exports = {
    COMMANDS: {
        MSG: 'MSG ',
        WHO: 'WHO',
        DM: 'DM ',
        PING: 'PING',
        LOGIN: 'LOGIN '
    },

    ERRORS: {
        USERNAME_TAKEN: 'ERR username-taken',
        INVALID_USERNAME: 'ERR invalid-username',
        MUST_LOGIN_FIRST: 'ERR must-login-first',
        USER_NOT_FOUND: 'ERR user-not-found',
        INVALID_DM_FORMAT: 'ERR invalid-dm-format',
        UNKNOWN_COMMAND: 'ERR unknown-command',
        LOGIN_TIMEOUT: 'ERR login-timeout'
    },

    TIMEOUTS: {
        LOGIN: 30000,           
        IDLE: 60000,           
        CHECK_INTERVAL: 10000  
    },

    LIMITS: {
        MAX_USERNAME_LENGTH: 20,
        MAX_MESSAGE_LENGTH: 1000
    }
};