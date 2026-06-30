import os
import logging
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize the Slack app
def initialize_app() -> App:
    """Initializes the Slack Bolt app using tokens from environment variables."""
    bot_token = os.environ.get("SLACK_BOT_TOKEN")
    if not bot_token:
        logger.error("SLACK_BOT_TOKEN environment variable is not set.")
        raise ValueError("SLACK_BOT_TOKEN environment variable is not set.")

    return App(token=bot_token)

try:
    app = initialize_app()
except Exception as e:
    logger.critical(f"Failed to initialize Slack app: {e}")
    app = None

if app:
    @app.message("hello")
    def message_hello(message, say):
        """Example message handler that says hello back."""
        try:
            logger.info(f"Received hello message from user {message.get('user')}")
            say(f"Hello <@{message['user']}>! I am JARVIS. How can I assist you today?")
        except Exception as e:
            logger.error(f"Error handling message 'hello': {e}")

    # Add a catch-all event handler for testing / visibility
    @app.event("message")
    def handle_message_events(body, logger):
        """Catch-all for message events to prevent unhandled event warnings"""
        try:
            logger.info(f"Received unhandled message event: {body}")
        except Exception as e:
            logger.error(f"Error in catch-all message handler: {e}")

def main():
    """Main execution entry point."""
    if not app:
        logger.critical("App not initialized. Exiting.")
        return

    app_token = os.environ.get("SLACK_APP_TOKEN")
    if not app_token:
        logger.error("SLACK_APP_TOKEN environment variable is not set.")
        return

    try:
        logger.info("Starting JARVIS Controller in Socket Mode...")
        handler = SocketModeHandler(app, app_token)
        handler.start()
    except Exception as e:
        logger.critical(f"Critical error starting Socket Mode handler: {e}")
        logger.info("Attempting to shut down gracefully...")

if __name__ == "__main__":
    main()
