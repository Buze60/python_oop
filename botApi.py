from typing import final
from telegram import Update
TOKEN = '7702681806:AAEXteFgH6IHT1TKBw3HqtJBPTV7MG1ws28'
from telegram.ext import Application,CommandHandler,MessageHandler,filters,ContextTypes
BOT_USERNAME = '@usermanagmentbot'

#  Commands
async def start_command(update:Update,context:ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Hello! I am your user management bot. You can use the following commands to manage users:\n/start - Start the bot\n/help - Show help information')
    

async def help_command(update:Update,context:ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Hello! I am your user management bot. \nplease type what you want')
    
async def ccustom_command(update:Update,context:ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('this is custom command')
    
    
# Responses
def hunde_response(text:str) -> str:
    if 'hello' in text.lower():
        return 'Hello there! How can I assist you today?'
    if 'how are you' in text.lower():
        return 'I am doing well, thank you for asking! \nHow can I assist you today?'
    if 'what is your name' in text.lower():
        return 'My name is User Managment Bot.\n I am Developed by @buze_tech.'
    if 'what is developer name' in text.lower():
        return 'His name is BIZUAYEHU SIMACHEW  \n He is a software Engineering with Profession in Python \nand FLutter Mobile App Developer'
    return "I am sorry, Idon't understand what you mean \n currently i am still in develpment satge \n please try agian latter"

async def handle_message(update:Update,context:ContextTypes.DEFAULT_TYPE):
    message_type: str = update.message.chat.type
    text: str = update.message.text
    print(f"User ({update.message.chat.id}) in {message_type} '{text}")
    if message_type == 'group':
        if BOT_USERNAME in text:
            new_text: str = text.replace(BOT_USERNAME,'').strip()
            response: str = hunde_response(new_text)
        else:
            return
    else:
        response: str  = hunde_response(text)
    print(f"Bot response: {response}")
    await update.message.reply_text(response)
    
    
async def error(update:Update,context:ContextTypes.DEFAULT_TYPE ):
    print(f"Update {update} Error occurred: {context.error}")
    
    
if __name__ == '__main__':
    print("Starting bot...")
    app = Application.builder().token(TOKEN).build()
    
    # COMMANDS
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("custom", ccustom_command))
    # MESSAGES
    app.add_handler(MessageHandler(filters.TEXT, handle_message))
    # ERRORS
    app.add_error_handler(error)
    
    print("Bot started...")
    app.run_polling(poll_interval=3)