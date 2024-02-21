const fs = require("fs/promises");

// open(32) -> file descriptor
// read or write

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    try {
      // we want to check wheter or not we already have the file
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      // we already have that file...
      return console.log(`The file ${path} already exist`);
    } catch (error) {
      // we don't have the file, now we should create it
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file succesfully created");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    console.log(`Deleting ${path}...`);
  };

  const renameFile = async (oldPath, newPath) => {
    console.log(`renaming ${oldPath} to ${newPath}`);
  };

  const addToFile = async (path, content) => {
    console.log(`Adding to ${path}`);
    console.log(`Content: ${content}`);
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of text in the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength; // buffer size
    // the position that we want to start reading the file from
    const position = 0;

    // we want to read the content(from the beginning all the way to the end)
    await commandFileHandler.read(buff, offset, length, position);

    // decoder 01 -> meaningful
    // encoder meaningful -> 01
    const command = buff.toString("utf-8");

    // create a file:
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // delete a file
    // delete the file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename file:
    // rename the file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring();
    }
  });

  // watcher ...
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
