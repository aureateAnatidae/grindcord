import { type ApplicationCommand, type Collection, REST, Routes } from "discord.js";

export default async function deploy_commands(commands: Collection<ApplicationCommand>) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const _commands = commands.map((command) => command.data.toJSON());
    try {
        console.log(`Started refreshing ${_commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: _commands,
            },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}
