'use strict';

require('dotenv').load();

module.exports = {
    port: Number(process.env.PORT) || 5000,
    webhook: process.env.SLACK_WEBHOOK, // Slack Incoming Webhook
    channel: '#' + process.env.SLACK_CHANNEL, // Slack channel without # prefix
    username: process.env.SLACK_USERNAME,
    danger: process.env.HEX_DANGER,
    info: process.env.HEX_INFO,
    success: process.env.HEX_SUCCESS,
    warning: process.env.HEX_WARNING,
    mentionReviewers: process.env.MENTION_REVIEWERS,
    mentionPROwner: process.env.MENTION_OWNERS,
    useEmojis: process.env.USE_EMOJIS,
    useEmojiAlways: process.env.EMOJI_ALWAYS,
    users: process.env.USERS,
};
