
var InstagramV1 = {};

InstagramV1.CONSTANTS = require('./lib/v1/constants');
InstagramV1.routes = require('./lib/v1/routes');
InstagramV1.Signatures = require('./lib/v1/signatures');
InstagramV1.Device = require('./lib/v1/device');
InstagramV1.CookieStorage = require('./lib/v1/cookie-storage');
InstagramV1.CookieFileStorage = require('./lib/v1/cookie-file-storage');
InstagramV1.CookieMemoryStorage = require('./lib/v1/cookie-memory-storage');
InstagramV1.Exceptions = require("./lib/v1/exceptions");
InstagramV1.prunedJson = require('./lib/v1/json-pruned');
InstagramV1.Resource = require('./lib/v1/resource');

InstagramV1.Request = require('./lib/v1/request');
InstagramV1.Session = require('./lib/v1/session');
InstagramV1.Account = require('./lib/v1/account');
InstagramV1.Media = require('./lib/v1/media');
InstagramV1.Comment = require('./lib/v1/comment');
InstagramV1.Hashtag = require('./lib/v1/hashtag');
InstagramV1.Like = require('./lib/v1/like');
InstagramV1.Link = require('./lib/v1/link');
InstagramV1.Placeholder = require('./lib/v1/placeholder');
InstagramV1.Location = require('./lib/v1/location');
InstagramV1.Relationship = require('./lib/v1/relationship');
InstagramV1.Thread = require('./lib/v1/thread');
InstagramV1.ThreadItem = require('./lib/v1/thread-item');
InstagramV1.QE = require('./lib/v1/qe');
InstagramV1.Upload = require('./lib/v1/upload');
InstagramV1.discover = require('./lib/v1/discover');
InstagramV1.Save = require('./lib/v1/save');
InstagramV1.search = require('./lib/v1/search');

var creator = require('./lib/v1/account-creator');
InstagramV1.AccountCreator = creator.AccountCreator;
InstagramV1.AccountPhoneCreator = creator.AccountPhoneCreator;
InstagramV1.AccountEmailCreator = creator.AccountEmailCreator;

InstagramV1.Feed = {};
InstagramV1.Feed.AccountFollowers = require('./lib/v1/feeds/account-followers');
InstagramV1.Feed.AccountFollowing = require('./lib/v1/feeds/account-following');
InstagramV1.Feed.Inbox = require('./lib/v1/feeds/inbox');
InstagramV1.Feed.InboxPending = require('./lib/v1/feeds/inbox-pending');
InstagramV1.Feed.LocationMedia = require('./lib/v1/feeds/location-media');
InstagramV1.Feed.TaggedMedia = require('./lib/v1/feeds/tagged-media');
InstagramV1.Feed.TagMedia = InstagramV1.Feed.TaggedMedia; // Alias but deprecated
InstagramV1.Feed.ThreadItems = require('./lib/v1/feeds/thread-items');
InstagramV1.Feed.Timeline = require('./lib/v1/feeds/timeline-feed');
InstagramV1.Feed.UserMedia = require('./lib/v1/feeds/user-media');
InstagramV1.Feed.SelfLiked = require('./lib/v1/feeds/self-liked');
InstagramV1.Feed.MediaComments = require('./lib/v1/feeds/media-comments');
InstagramV1.Feed.SavedMedia = require('./lib/v1/feeds/saved-media');
InstagramV1.Feed.StoryTray = require('./lib/v1/feeds/story-tray');
InstagramV1.Feed.UserStory = require('./lib/v1/feeds/user-story');

InstagramV1.Web = {};
InstagramV1.Web.Request = require('./lib/v1/web/web-request');
var challenge = require('./lib/v1/web/challenge');
InstagramV1.Web.Challenge = challenge.Challenge;
InstagramV1.Web.NotImplementedChallenge = challenge.NotImplementedChallenge;
InstagramV1.Web.EmailVerificationChallenge = challenge.EmailVerificationChallenge;
InstagramV1.Web.PhoneVerificationChallenge = challenge.PhoneVerificationChallenge;


module.exports = InstagramV1;
