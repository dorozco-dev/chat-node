// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to Infinity Chat',
    });
});

// Import controllers
var accountController = require('../controllers/accountController.js');
var chatController = require('../controllers/chatController.js');
var groupChatController = require('../controllers/groupChatController.js');

// Account routes
router.route('/account')
    .get(accountController.findAllUsers)
	
router.route('/account/:id')
    .get(accountController.findPhotoByIdAccount)
	
// Chat routes 
router.route('/findChatMessagesById/:id')
    .get(chatController.findChatMessageByChatId)
	
// Group chat routes
router.route('/findGroupChatByAccountId/:id')
	.get(groupChatController.findGroupChatByAccountId)

router.route('/findUsersByGroupId/:id')
	.get(groupChatController.findUsersByGroupId)

router.route('/findGroupChatMessagesById/:id')
	.get(groupChatController.findGroupChatMessagesById)
	

module.exports = router;
