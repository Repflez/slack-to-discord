var slackAPI		= require('slackbotapi'),
	sToken			= 'SLACK_BOT_API_KEY',
	dToken			= 'DISCORD_BOT_TOKEN',
	sTeam			= 'SLACK_TEAM_ID',
	dGuild			= 'DISCORD_GUILD_ID',
	slack			= new slackAPI({
						token: sToken,
						logging: false,
						autoReconnect: true
	}),
	Discordie		= require('discordie'),
	client			= new Discordie({autoReconnect: true}),
	request			= require('request'),
	chans			= require('./chans.json'),
	channel			= {};

function getUser(id) {
	return slack.getUsers().then(function (data) {
		return find(data.members, { id: id });
	});
}

slack.on('message', function (message) {
	// We are interested only on messages
	if (message.type !== 'message') return;

	// Ensure that the messages come from our team
	if (message.team !== sTeam) return;

	// Don't process "hidden" messages
	if (message.hidden === true) return;

	// Ignore our own messages
	if (message.bot_id === 'SLACK_BOT_ID') return;

	// Check if we have a channel defined here
	if (chans.slack[message.channel] === undefined) return;
	//console.log(chans.slack[message.channel]);

	// Process our messages normally
	var user = slack.getUser(message.user),
		uName;

	// proccessing for bots
	if (user === null) {
		uName = message.username;
	} else {
		uName = user.name;
	}

	// Ensure that we don't overwrite our channel vars on every message
	if (channel[message.channel] === undefined) {
		channel[message.channel] 	= client.Channels.get(chans.slack[message.channel]);
	}

	// Filter our message
	message.text = filterSlackMsg(message.text);

	// Send our message to Discord
	channel[message.channel].sendMessage('**<' + uName + '>** ' + message.text);
});

function filterSlackMsg (txt) {
	txt = txt.replace(/\<(https?.+)\>/i, '$1');
	txt = txt.replace('&gt;', '>');
	txt = txt.replace('&lt;', '<');
	//txt = txt.replace('**', '*');
	//var regex = /\<@(U[A-Z0-9]{8})(?:\|(\w+))?>/i.exec(txt);
	return txt;
}

function msgParser(e) {
	// Ensure that the messages come from our guild
	if (e.message.guild.id !== dGuild) return;

	// Ignore our own messages
	if (client.User.id === e.message.author.id) return;

	// Check if we have a channel defined here
	if (chans.discord[e.message.channel.id] === undefined) return;

	// Set our stuff
	var uname = e.message.author.username;
	if (e.message.author.id === 'DISCORD_BOT_UID') return;
	var dAvatar = '';
	if (e.message.author.avatar !== null) {
		dAvatar = 'https://discordapp.com/api/users/' + e.message.author.id + '/avatars/' + e.message.author.avatar + '.jpg';
	} else {
		dAvatar = 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png';
	}
	
	// Send it to Slack
	request.post({
		url: 'https://slack.com/api/chat.postMessage',
		form: {
			channel: chans.discord[e.message.channel.id],
			token: sToken,
			text: e.message.content,
			username: uname + ' (from Discord)',
			as_user: 'false',
			icon_url: dAvatar
		}
	});
}

function find(arr, params) {
    var result = {};
    arr.forEach(function (item) {
        if (Object.keys(params).every(function (key) { return item[key] === params[key];})) {
            result = item;
        }
    });
    return result;
}

client.connect({token: dToken});
client.Dispatcher.on('GATEWAY_READY', function (e) {
	console.log('discord is ready');
	client.Dispatcher.on('MESSAGE_CREATE', msgParser);
});
slack.on('hello', function () => {
	console.log('slack is ready');
});
