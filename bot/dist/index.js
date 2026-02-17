"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const token = process.env.DISCORD_TOKEN;
    if (!token)
        throw new Error("Missing DISCORD_TOKEN in .env");
    const cfg = await prisma.config.findUnique({ where: { id: 1 } });
    if (!cfg)
        throw new Error("Config row missing (run seed)");
    const client = new discord_js_1.Client({
        intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent],
    });
    client.once(discord_js_1.Events.ClientReady, () => {
        console.log(`Bot ready as ${client.user?.tag}. Watching channel ${cfg.channelId}`);
    });
    client.on(discord_js_1.Events.MessageCreate, async (message) => {
        if (message.author.bot)
            return;
        if (message.channelId !== cfg.channelId)
            return;
        await message.reply("Heard, Chef.");
    });
    await client.login(token);
}
main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
