const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// for guild-based commands
    //rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
    //	.then(() => console.log('Successfully deleted guild command'))
    //	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, '1071579469053165639'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);