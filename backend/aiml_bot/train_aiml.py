import aiml
import os

BRAIN_FILE = "bot_brain.brn"
AIML_DIR = os.path.join(os.path.dirname(__file__), "")

def train():
    kernel = aiml.Kernel()
    if os.path.exists(BRAIN_FILE):
        kernel.loadBrain(BRAIN_FILE)
    else:
        # load all AIML files in the directory
        for file in os.listdir(AIML_DIR):
            if file.endswith('.aiml'):
                kernel.learn(os.path.join(AIML_DIR, file))
        kernel.saveBrain(BRAIN_FILE)
    return kernel

if __name__ == '__main__':
    k = train()
    print('Training complete. Try chatting with the bot:')
    while True:
        user = input('You: ')
        print('Bot:', k.respond(user))
