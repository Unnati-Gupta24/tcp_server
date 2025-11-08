module.exports = {
    HOST: process.env.CHAT_HOST || '0.0.0.0',
    PORT: parseInt(process.env.CHAT_PORT || '4000'),
    NODE_ENV: process.env.NODE_ENV || 'development'
};