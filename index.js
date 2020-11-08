const Discord = require('discord.js');
const MemeDown = require('./memedown-utils').methods;
const CONFIG = require('./config/config.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log("I am ready to meme");
});

client.on('message', async msg => {
    if (msg.author == client.user) return;

    if (!msg.mentions.has(client.user)) return;

    
    console.log("I have been summoned");

    let imgUrl = null;
    console.log(msg.attachments.array());
    msg.attachments.array().forEach(element => {
        if (MemeDown.isValidImage(element.url))
            imgUrl = element.url;
    });

    console.log(`Going to use the image at: ${imgUrl}`);

    try {
        let content = MemeDown.getMemeCode(msg.content);
        console.log(content);
        let imgb64 = await MemeDown.sendMessage(CONFIG.MEMEDOWN_ENDPOINT, content, imgUrl);
        const imageStream = Buffer.from(imgb64, 'base64');
        const attachment = new Discord.MessageAttachment(imageStream);
        await msg.reply("Aha! Time for a dank meme!", attachment);
        msg.delete();
    }
    catch (e) {
        console.log(e);
        msg.reply("Unfortunately I was unable to get that meme for you :(. My algorithm says: " + e);
    }

});

client.login(CONFIG.DISCORD_TOKEN);
