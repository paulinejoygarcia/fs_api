Meteor.startup(() => {
    console.log("");

    console.log("         ______                            __           ____________" + "   ___    ____  ____".cyan);
    console.log("  __  __".red + "/ ____/___  ____  ____  ___  _____/ /____  ____/ /  _/_  __/" + "  /   |  / __ \\/  _/".cyan);
    console.log(" / / / ".red + "/ /   / __ \\/ __ \\/ __ \\/ _ \\/ ___/ __/ _ \\/ __  // /  / /  " + "  / /| | / /_/ // /  ".cyan);
    console.log("/ /_/ ".red + "/ /___/ /_/ / / / / / / /  __/ /__/ /_/  __/ /_/ // /  / /  " + "  / ___ |/ ____// /   ".cyan);
    console.log("\\__,_/".red + "\\____/\\____/_/ /_/_/ /_/\\___/\\___/\\__/\\___/\\__,_/___/ /_/  " + "  /_/  |_/_/   /___/   ".cyan);

    showStatus('Initializing server setup...');
    Meteor.methods(functions);});