//Este comando sirve para que AlfredoBot se esnife su linea de coca (tantas como quieras)

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sopla')
		.setDescription('alfredo se soplara una linea de tussi'),
	async execute(interaction) {
		await interaction.reply('alfredo se ha soplado una linea de tussi');
	},
};

