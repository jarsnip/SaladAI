import "dotenv/config";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) throw new Error("Missing DISCORD_TOKEN in .env");

  const cfg = await prisma.config.findUnique({ where: { id: 1 } });
  if (!cfg) throw new Error("Config row missing (run seed)");

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  });

  client.once(Events.ClientReady, () => {
    console.log(`Bot ready as ${client.user?.tag}. Watching channel ${cfg.channelId}`);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.channelId !== cfg.channelId) return;

    await message.reply("Heard, Chef.");
  });

  await client.login(token);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
