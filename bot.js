const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { OpenAIApi, Configuration } = require("openai");
require("dotenv/config")


const config = new Configuration({
    apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(config);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



client.once(Events.ClientReady, () => {
	console.log('eyyyy');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'FATAL ERRROR!!!!!', ephemeral: true });
	}
});

const PAST_MESSAGES = 5

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;


    if (!message.content.startsWith("oye")) return;

    message.channel.sendTyping()


    let messages = Array.from(await message.channel.messages.fetch({
        limit: PAST_MESSAGES,
        before: message.id,
    }));
    
    
    messages = messages.map(m=>m[1])
    messages.unshift(message)
    


    let users = [...new Set([...messages.map(m=> m.member.displayName), client.user.username,])]

    let lastUser = users.pop()

    let prompt = `lo siguiente es una conversacion entre: ${users.join(", ")}   y:  ${lastUser}. \n\n`
 

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        prompt += `${m.member.displayName}: ${m.content}\n`
    }
    prompt += `${client.user.username}:`
    console.log("prompt:", prompt)

    const response = await openai.createCompletion({
        prompt,
        model: "text-davinci-003",
        max_tokens: 700,
    })

    console.log("response", response.data.choices[0].text)
    await message.channel.send(response.data.choices[0].text)
    
    console.log("prompt =>" + prompt);
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}



require(`./anticrash`)(client);

client.login(token);
