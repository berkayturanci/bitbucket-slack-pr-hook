'use strict';
var config = require('./config');

function findUserId(userName) {
    var result = userName;
    var users = config.users;
    users = users.split(",");
    if (users.length > 0) {
        for (var index = 0; index < users.length; ++index) {
            var userInfo = users[index].split("|");
            if (userInfo.length === 2) {
                if (userInfo[0].trim() === userName) {
                    result = userInfo[1].trim();
                }
            }
        }
    }
    return result;
}

module.exports = {
    truncate: function (string) {
        var MAX_LENGTH = 100;

        if (string.length > MAX_LENGTH) {
            return string.substring(0, MAX_LENGTH) + ' [...]';
        }

        return string;
    },

    convertToUserMentions: function (string) {
        var indices = [];
        var userNames = [];
        for(var i=0; i<string.length; i++) {
            if (string[i] === "@") {
                indices.push(i);
            }
        }

        for (var j = 0; j < indices.length; j++) {
            var userName = string.substring(indices[j] + 1).split(" ")[0];
            userName = userName.replace(/\"/g, "");

            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            //if there is a special char after the mention.
            if (format.test(userName[userName.length-1])) {
                userName = userName.substring(0, userName.length - 1);
            }

            userNames.push(userName);
        }

        for (var k = 0; k < userNames.length; k++) {
            string = string.replace("@\"" + userNames[k] + "\"", '<@' + findUserId(userNames[k]) + '>');
        }

        return string;
    },

    commentUrl: function (string, commentId) {
        return string + "/overview?commentId=" + commentId;
    },

    addEmoji: function (result) {
        // %33 change of using emoji
        if ([1, 2, 3].random() === 1 || this.FEATURE_USE_EMOJI_ALWAYS.emojiAlways) {
            var emoji = "";
            switch (result.color) {
                case this.COLORS.red:
                    emoji = [":ahhhhhhhhh:", ":fire:", ":boom:"].random();
                    break;
                case this.COLORS.green:
                    emoji = [":bob_ross_parrot:", ":success:", ":cool-doge:", ":conga-parrot:",
                        ":birthday_party_parrot:", ":bananadance_lsd:"].random();
                    break;
                case this.COLORS.yellow:
                    emoji = [":warning:", ":confused_dog:", ":mild-panic-intensifies:"].random();
                    break;
                default:
                    emoji = [":information_source:", ":speech_balloon:"].random();
            }

            result.fallback += " " + emoji;
            return result;
        } else {
            return result;
        }
    },

    getPossiblyUndefinedKeyValue: function (obj, keySequence) {
        var keys = keySequence.split('.');

        while (obj && keys.length) {
            obj = obj[keys.shift()];
        }

        return obj || undefined;
    },

    addReviewers: function (data, result) {
        if (this.FEATURE_SWITCH.mentionReviewers && data.reviewers && data.reviewers.length > 0) {
            var reviewersStr = '';
            data.reviewers.forEach(function (reviewer) {
                reviewersStr += ' <@' + findUserId(reviewer.user.name) + '>';
            });
            result.fields.push({
                title: 'Reviewers:',
                value: reviewersStr.trim()
            });
        }

        return result;
    },

    addPROwner: function (data, result) {
        if (this.FEATURE_MENTION_OWNERS.mentionPROwner) {
            var ownerStr = ' <@' + findUserId(data.prAuthorId) + '>';
            result.fields.push({
                title: 'PR Owner:',
                value: ownerStr.trim()
            });
        }

        return result;
    },

    COLORS: {
        red: config.danger || '#e74c3c',
        green: config.success || '#2ecc71',
        blue: config.info || '#3498db',
        yellow: config.warning || '#f1c40f'
    },

    FEATURE_SWITCH: {
        mentionReviewers: config.mentionReviewers || true
    },

    FEATURE_MENTION_OWNERS: {
        mentionPROwner: config.mentionPROwner || true
    },

    FEATURE_USE_EMOJI: {
        useEmojis: config.useEmojis || true
    },

    FEATURE_USE_EMOJI_ALWAYS: {
        emojiAlways: config.useEmojiAlways || true
    }
};

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
};