//@ts-check

//NOTE: directoryPaths have a "/" at the end of their pathName (applies to both input and output pathNames)
//NOTE: filePaths don not have a "/" at the end of their pathName (applies to both input and output pathNames)
//NOTE: All relativePaths start with "./" (applies to both input and output pathNames)

const fs = require("fs");

module.exports = {
    getContentPaths: function (parameters) {
        //Get only directoryPaths for the directoryPath
        const contentPaths = fs.readdirSync(parameters.directoryPath);
        //Append the relativePath into the beginning of each fileName
        for (let i = 0; i < contentPaths.length; i++) {
            contentPaths[i] = parameters.directoryPath + contentPaths[i];
            //Add the "/" at the end of directoryPaths
            if (fs.lstatSync(contentPaths[i]).isDirectory()) {
                contentPaths[i] += "/";
            }
        }
        //Send stringified directoryPaths
        return JSON.stringify(contentPaths);
    },
    
    //Gets the file paths of a given directory into an array 
    getFilePaths: function(parameters) {
        //Get only directoryPaths for the directoryPath
        const contentPaths = fs.readdirSync(parameters.directoryPath);
        //Append the relativePath into the beginning of each fileName
        for (let i = 0; i < contentPaths.length; i++) {
            contentPaths[i] = parameters.directoryPath + contentPaths[i];
        }
        const filePaths = [];
        //Search for filePaths in contentPaths and add them to filePaths
        for (let i = 0; i < contentPaths.length; i++) {
            if (fs.lstatSync(contentPaths[i]).isFile()) {
                filePaths.push(contentPaths[i]);
            }
        }
        //Send stringified directoryPaths
        return JSON.stringify(filePaths);
    },
    
    //Gets the directory paths of a given directory into an array 
    getDirectoryPaths: function(parameters) {
        //Get only directoryPaths for the directoryPath
        const contentPaths = fs.readdirSync(parameters.directoryPath);
        //Append the relativePath into the beginning of each fileName
        for (let i = 0; i < contentPaths.length; i++) {
            contentPaths[i] = parameters.directoryPath + contentPaths[i];
        }
        const directoryPaths = [];
        //Search for filePaths in contentPathsArray and add them to directoryPathsArray
        for (let i = 0; i < contentPaths.length; i++) {
            if (fs.lstatSync(contentPaths[i]).isDirectory()) {
                directoryPaths.push(contentPaths[i] + "/");
            }
        }
        //Send stringified directoryPathsArray
        return JSON.stringify(directoryPaths);
    },
    
    //Creates a directory by a specified name
    createDirectory: function(parameters) {
        //Create a directory for the directoryPath
        if (!fs.existsSync(parameters.directoryPath)) {
            fs.mkdirSync(parameters.directoryPath);
        }
    },
    
    //Moves a file/directory to a specified location
    moveFileDirectoryTo: function(parameters) {
        if (fs.lstatSync(parameters.itemPath).isDirectory()) {
            //Remove the "/" at the end of the pathName
            parameters.itemPath = parameters.itemPath.slice(0, parameters.itemPath.lastIndexOf("/"));
            fs.renameSync(parameters.itemPath, parameters.newDirectoryPath + parameters.itemPath.slice(parameters.itemPath.lastIndexOf("/") + 1));
        } else {
            fs.renameSync(parameters.itemPath, parameters.newDirectoryPath + parameters.itemPath.slice(parameters.itemPath.lastIndexOf("/") + 1));
        }
    },
    
    //Renames a file/directory to a specified name
    renameFileDirectory: function(parameters) {
        //Check if the itemPath leads to a directory
        if (fs.lstatSync(parameters.itemPath).isDirectory()) {
            //Remove the "/" at the end of the pathName
            parameters.itemPath = parameters.itemPath.slice(0, parameters.itemPath.lastIndexOf("/"));
            //Only modify itemPath's basename into newName
            const modifiedItemPath = parameters.itemPath.slice(0, parameters.itemPath.lastIndexOf("/") + 1) + parameters.newName;
            fs.renameSync(parameters.itemPath, modifiedItemPath);
        } else {
            //Only modify itemPath's basename into newName
            const modifiedItemPath = parameters.itemPath.slice(0, parameters.itemPath.lastIndexOf("/") + 1) + parameters.newName + parameters.itemPath.slice(parameters.itemPath.lastIndexOf("."));
            fs.renameSync(parameters.itemPath, modifiedItemPath);
        }
    },
    
    //Removes a given file/directory
    removeFileDirectory: function(parameters) {
        //Removes a file/directory including all the child content and the file/directory itself
        function removeFileDirectoryRecursively(itemPath) {
            //Check if the itemPath leads to a directory
            if (fs.lstatSync(itemPath).isDirectory()) {
                //Get files and directories into an array
                const contentPathsArray = fs.readdirSync(itemPath);
                //Append the relativePath into the beginning of each fileName
                for (let i = 0; i < contentPathsArray.length; i++) {
                    contentPathsArray[i] = itemPath + contentPathsArray[i];
                    //Add the "/" at the end of directoryPaths
                    if (fs.lstatSync(contentPathsArray[i]).isDirectory()) {
                        contentPathsArray[i] += "/";
                    }
                }
                //Recursively remove each contentItem only if there are any
                if (contentPathsArray.length !== 0) {
                    contentPathsArray.forEach(function (contentItemPath) {
                        removeFileDirectoryRecursively(contentItemPath);
                    });
                }
                //Remove the empty directory
                fs.rmdirSync(itemPath);
            } else {
                //Remove the file
                fs.unlinkSync(itemPath);
            }
        }
        //Remove item from itemPath
        removeFileDirectoryRecursively(parameters.itemPath);
    },
    
    //Copies a given file/directory to another given directory
    copyFileDirectoryTo: function(parameters) {
        //Copies a file/directory including all the child content and the file/directory itself
        function copyFileDirectoryRecursivelyTo(itemPath, newDirectoryPath) {
            //Check if the itemPath leads to a directory
            if (fs.lstatSync(itemPath).isDirectory()) {
                //Create a new directory in the newDirectoryPath as itemPath's basename
                let itemPathBasename = itemPath.slice(0, itemPath.lastIndexOf("/"));
                itemPathBasename = itemPathBasename.slice(itemPathBasename.lastIndexOf("/"));
                fs.mkdirSync(newDirectoryPath + itemPathBasename + "/");
                //Get all contents of the directory lead by itemPath
                const contentPathsArray = fs.readdirSync(itemPath);
                //Append the relativePath into the beginning of each fileName
                for (let i = 0; i < contentPathsArray.length; i++) {
                    contentPathsArray[i] = itemPath + contentPathsArray[i];
                    //Add the "/" at the end of directoryPaths
                    if (fs.lstatSync(contentPathsArray[i]).isDirectory()) {
                        contentPathsArray[i] += "/";
                    }
                }
                //Recursively copy each contentItem only if there are any
                if (contentPathsArray.length !== 0) {
                    contentPathsArray.forEach(function (contentItemPath) {
                        copyFileDirectoryRecursivelyTo(contentItemPath, newDirectoryPath + itemPathBasename + "/");
                    });
                }
            } else {
                const itemPathBasename = itemPath.slice(itemPath.lastIndexOf("/"));
                //Simply copy the file
                fs.copyFileSync(itemPath, newDirectoryPath + itemPathBasename);
            }
        }
    
        //Copy item from itemPath inside newDirectoryPath
        copyFileDirectoryRecursivelyTo(parameters.itemPath, parameters.newDirectoryPath);
    },
    
    //Save a text to a given filePath
    saveTextToFile: function(parameters) {
        if (fs.existsSync(parameters.filePath.slice(0, parameters.filePath.lastIndexOf("/") + 1))) {
            fs.writeFileSync(parameters.filePath, parameters.content);
        }
    },
};
