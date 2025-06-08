const axios = require('axios');
const chalk = require('chalk');
const { Client } = require('discord.js-selfbot-v13'); 
const client = new Client();

const token = require('./config.json').token;
const messageDM = require('./config.json').msg;

client.on('ready', async () => {

    console.log(chalk.green(`connecté en tant que ${client.user.username}#${client.user.discriminator}`));

    try {
        const allamis = (await axios({
            url: `https://discordapp.com/api/v9/users/@me/relationships`,
            method: "GET",
            headers: { authorization: token }
        })).data;

        const r = allamis.filter((user) => user.type === 1);
        let compteur = 1;

        console.log(chalk.blue("DM ALL DÉMARRÉ"));
        for (let i = 0; i < r.length; i++) {
            try {
                const friendToDM = await client.users.fetch(r[i].user.id);
                const personalizedMessage = messageDM.replaceAll(`{user}`, `<@${friendToDM.id}>`);
                await friendToDM.send(personalizedMessage);

                console.log(chalk.greenBright(`${compteur}`) + chalk.white(" | ") + chalk.cyan(`${r[i].user.username}`) + chalk.white(" : DM RÉUSSI"));
                compteur += 1;
            } catch (err) {
                console.log(chalk.redBright(`${compteur}`) + chalk.white(" | ") + chalk.yellow(`${r[i].user.username}`) + chalk.white(" : DM ÉCHOUÉ"));
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log(chalk.blue("DM TERMINÉ"));
    } catch (err) {
        console.error(chalk.red("Erreur lors de la récupération des amis ou des messages :"), chalk.white(err.message));
    }
});

client.login(token);

process.on('multipleResolves', (type, promise, value) => { return; });
process.on('rejectionHandled', (promise) => { return; });
process.on('uncaughtException', (error, origin) => { console.error(chalk.red(error)); });
process.on('unhandledRejection', (reason, promise) => { console.error(chalk.red(reason)); });
process.on('uncaughtExceptionMonitor', (error, origin) => { return; });