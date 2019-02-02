<?php
    //Convert the JSONString sent by JavaScript into an object
    $parametersObject = json_decode($_POST["parametersObject"]);
    //Get the functionString
    $functionString = $parametersObject->functionString;
    //Call function in the functionString
    eval($functionString);

    function getContentPathsArray() {
        //Get required parameters from parametersObject
        $directoryPath = $GLOBALS["parametersObject"]->directoryPath;
        //Modify the directoryPath to return all filePaths and directoryPaths
        $modifiedDirectoryPath = $directoryPath . "*";
        //Get only directoryPaths for the directoryPath
        $contentPathsArray = glob($modifiedDirectoryPath, GLOB_MARK);
        //Send stringified directoryPathsArray
        echo json_encode($contentPathsArray); 
    }

    //Gets the file paths of a given directory into an array 
    function getFilePathsArray() {
        //Get required parameters from parametersObject
        $directoryPath = $GLOBALS["parametersObject"]->directoryPath;
        //Modify the directoryPath to return all filePaths
        $modifiedDirectoryPath = $directoryPath . "*.*";
        //Get all filesPathsArray for the directoryPath
        $filesPathsArray = glob($modifiedDirectoryPath, GLOB_NOSORT);
        //Send stringified filePathsArray
        echo json_encode($filesPathsArray);
    }

    //Gets the directory paths of a given directory into an array 
    function getDirectoryPathsArray() {
        //Get required parameters from parametersObject
        $directoryPath = $GLOBALS["parametersObject"]->directoryPath;
        //Modify the directoryPath to return all filePaths and directoryPaths
        $modifiedDirectoryPath = $directoryPath . "*";
        //Get only directoryPaths for the directoryPath
        $directoryPathsArray = glob($modifiedDirectoryPath, GLOB_ONLYDIR);
        //Send stringified directoryPathsArray
        echo json_encode($directoryPathsArray);
    }

    //Creates a directory by a specified name
    function createDirectory() {
        //Get required parameters from parametersObject
        $directoryPath = $GLOBALS["parametersObject"]->directoryPath;
        //Create a directory for the directoryPath
        mkdir($directoryPath);
    }

    //Moves a file/directory to a specified location
    function moveFileDirectoryTo() {
        //Get required parameters from parametersObject
        $itemPath = $GLOBALS["parametersObject"]->itemPath;
        $newDirectoryPath = $GLOBALS["parametersObject"]->newDirectoryPath;
        //Move file/directory from itemPath to newDirectoryPath
        rename($itemPath, $newDirectoryPath . basename($itemPath));
    }

    //Moves a file/directory to a specified name
    function renameFileDirectory() {
        //Get required parameters from parametersObject
        $itemPath = $GLOBALS["parametersObject"]->itemPath;
        $newName = $GLOBALS["parametersObject"]->newName;
        //Check if the itemPath leads to a directory
        if (is_dir($itemPath) == true) {
            //Only modify itemPath's basename into newName
            $modifiedItemPath = pathinfo($itemPath, PATHINFO_DIRNAME) . "/" .$newName;
        } else {
            //Only modify itemPath's basename into newName
            $modifiedItemPath = pathinfo($itemPath, PATHINFO_DIRNAME) . "/" .$newName . "." .pathinfo($itemPath, PATHINFO_EXTENSION);
        }
        //Rename itemPath to reflect newName
        rename($itemPath, $modifiedItemPath);
    }

    //Removes a given file/directory
    function removeFileDirectory() {
        //Get required parameters from parametersObject
        $itemPath = $GLOBALS["parametersObject"]->itemPath;
        //Remove item from itemPath
        removeFileDirectoryRecursively($itemPath);
    }

    //Copies a given file/directory to another given directory
    function copyFileDirectoryTo() {
        //Get required parameters from parametersObject
        $itemPath = $GLOBALS["parametersObject"]->itemPath;
        $newDirectoryPath = $GLOBALS["parametersObject"]->newDirectoryPath;
        //Copy item from itemPath inside newDirectoryPath
        copyFileDirectoryRecursivelyTo($itemPath, $newDirectoryPath);
    }

    //Save a text to a given filePath
    function saveTextToFile() {
        //Get required parameters from parametersObject
        $filePath = $GLOBALS["parametersObject"]->filePath;
        $contentString = $GLOBALS["parametersObject"]->contentString;
        //Create the file in filePath
        $fileToWrite = fopen($filePath, "w");
        //Write contentString to the file
        fwrite($fileToWrite, $contentString);
        //Close the file
        fclose($fileToWrite);
    }

    //INFO: FUNCTION IS TO BE INVOKED INSIDE removeFileDirectory
    //Removes a file/directory including all the child content and the file/directory itself
    function removeFileDirectoryRecursively($itemPath) {
        //Check if the itemPath leads to a directory
        if(is_dir($itemPath) == true){
            //Get files and directories into an array
            $contentPathsArray = glob($itemPath . '*', GLOB_MARK); //GLOB_MARK adds a "/" at the end of directories (Helps in recursion)
            //Recursively remove each contentItem only if there are any
            if (count($contentPathsArray) != false) {
                foreach($contentPathsArray as $contentItemPath){
                    removeFileDirectoryRecursively($contentItemPath);      
                }
            }
            //Remove the empty directory
            rmdir($itemPath);
        } else {
            //Remove the file
            unlink($itemPath);  
        }
    }

    //INFO: FUNCTION IS TO BE INVOKED INSIDE copyFileDirectoryTo
    //Copies a file/directory including all the child content and the file/directory itself
    function copyFileDirectoryRecursivelyTo($itemPath, $newDirectoryPath) {
        //Change the newDirectoryPath to new one
        $newDirectoryPath = $newDirectoryPath . "/" . basename($itemPath);
        //Check if the itemPath lead to a directory
        if (is_dir($itemPath) == true) {
            //Create a new directory in the newDirectoryPath as itemPath
            mkdir($newDirectoryPath);
            $contentPathsArray = glob( $itemPath . '/*');
            //Recursively copy each contentItem only if there are any
            if (count($contentPathsArray) != false) {
                foreach($contentPathsArray as $contentItemPath){
                    copyFileDirectoryRecursivelyTo($contentItemPath, $newDirectoryPath);      
                }
            }
        } else {
            //Simply copy the file
            copy($itemPath, $newDirectoryPath);
        }
    }
?>