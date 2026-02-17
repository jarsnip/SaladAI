import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerDiscordId = process.env.OWNER_DISCORD_ID;
  const channelId = process.env.CHANNEL_ID;

  if (!ownerDiscordId) throw new Error("Missing OWNER_DISCORD_ID in .env");
  if (!channelId) throw new Error("Missing CHANNEL_ID in .env");

  await prisma.user.upsert({
    where: { discordId: ownerDiscordId },
    update: { role: Role.OWNER },
    create: { discordId: ownerDiscordId, role: Role.OWNER },
  });

  await prisma.config.upsert({
    where: { id: 1 },
    update: {
      channelId,
      systemPrompt:
        "You are Salad Overseer. Refer to users as Chefs and earnings as Chopping. Be concise, helpful, and professional. If unsure, ask one clarifying question. Never say 'sorry'.",
      maxTokens: 800,
      inactivityMinutes: 5,
      purgeMinutes: 5,
      retentionDays: 28,
      rolesCanOpen: [],
      ownerDiscordId,
    },
    create: {
      id: 1,
      channelId,
      systemPrompt:
        "You are Salad Overseer. Refer to users as Chefs and earnings as Chopping. Be concise, helpful, and professional. If unsure, ask one clarifying question. Never say 'sorry'.",
      maxTokens: 800,
      inactivityMinutes: 5,
      purgeMinutes: 5,
      retentionDays: 28,
      rolesCanOpen: [],
      ownerDiscordId,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
