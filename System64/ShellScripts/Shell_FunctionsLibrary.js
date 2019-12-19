//Declare and initialize globalArrays
const windowZIndexArray = ["reserved", "reserved", "startScreen"];
const windowMinimizedArray = ["reserved", "reserved", "startScreen"];
//Declare and initiate filesToIgnoreArray
const filesToIgnoreArray = ["start.html", "filesystem.php"];

function lockScreen() {
    //Hide taskArea and statusArea
    document.getElementById("taskArea").style.transform = "translateY(-90px)";
    document.getElementById("statusArea").style.transform = "translateY(90px)";
    //Get workspaceArea
    const workspaceArea = document.getElementById("workspaceArea");
    //Clear workspaceArea
    workspaceArea.innerHTML = "";
    //Add watermark and scale workspaceArea
    workspaceArea.style.transform = "scale(1.1, 1.1)";
    workspaceArea.style.backgroundImage = "url('System64/ImageRes/LockScreen_Watermark.png')";
    //Create lockScreenClock
    // var lockScreenClock = document.createElement("span");
    // lockScreenClock.style.fontSize = "150px";
    const lockScreenClock = document.createElement("iframe");
    lockScreenClock.src = "System64/ShellComponentFiles/AnalogClock.html";
    lockScreenClock.setAttribute("class", "componentIFrame");
    lockScreenClock.style.margin = "0 0 0 400px";
    //Append elements into HTML
    workspaceArea.appendChild(lockScreenClock);
    //Animate lockScreenClock
    const clockAnimationID = setImmediateInterval(function () {
        lockScreenClock.innerHTML = getCurrentTime();
    }, 60000);
    //Append elements into HTML
    workspaceArea.appendChild(lockScreenClock);
    //AddEventListener for unlockScreen
    workspaceArea.addEventListener("click", unlockScreen);
    //Define the function to unlockScreen
    function unlockScreen() {
        //Show taskArea and statusArea
        document.getElementById("taskArea").style.transform = "translateY(0)";
        document.getElementById("statusArea").style.transform = "translateY(0)";
        //Create shortcuts for apps
        installApps();
        //Remove watermark and scale workspaceArea
        workspaceArea.style.transform = "initial";
        workspaceArea.style.backgroundImage = "";
        //Stop lockScreenClock
        window.clearInterval(clockAnimationID);
        //Remove lockScreenClock
        lockScreenClock.remove();
        //Remove auto generated eventListeners
        workspaceArea.removeEventListener("click", unlockScreen);
    }
}

//WARNING: LOOSELY IMPLEMENTED
function onOffScreenSaver() {
    let verticalDirection = true;
    let horizontalDirection = true;
    //Create object
    const object = document.createElement("div");
    object.id = "screenSaverObject";
    object.setAttribute("class", "screenSaverObject");
    //Append elements to HTML
    document.getElementById("workspaceArea").appendChild(object);

    //Start animation of object
    const screenSaverAnimationID = window.setInterval(animateObject, 30, document.getElementById("screenSaverObject"), 2);

    //Declare the function to animateObject
    function animateObject(object, travel) {
        const verticalLimit = object.parentElement.getBoundingClientRect().height - object.getBoundingClientRect().height;
        const horizontalLimit = object.parentElement.getBoundingClientRect().width - object.getBoundingClientRect().width;

        const objectMarginTop = parseInt(object.offsetTop);
        const objectMarginLeft = parseInt(object.offsetLeft);
        //Determine verticalDirection
        if (objectMarginTop <= 0) {
            verticalDirection = true;
        } else if (objectMarginTop >= verticalLimit) {
            verticalDirection = false;
        }
        //Calculate newObjectPosition according to verticalDirection
        let newObjectMarginTop;
        if (verticalDirection == true) {
            newObjectMarginTop = objectMarginTop + travel;
        } else if (verticalDirection == false) {
            newObjectMarginTop = objectMarginTop - travel;
        }
        //Set newPosition of object
        object.style.top = newObjectMarginTop + "px";

        //Determine horizontalDirection
        if (objectMarginLeft <= 0) {
            horizontalDirection = true;
            object.style.transform = "scaleX(-1)";
        } else if (objectMarginLeft >= horizontalLimit) {
            horizontalDirection = false;
            object.style.transform = "initial";
        }
        //Calculate newObjectPosition according to horizontalDirection
        let newObjectMarginLeft;
        if (horizontalDirection == true) {
            newObjectMarginLeft = objectMarginLeft + travel;
        } else if (horizontalDirection == false) {
            newObjectMarginLeft = objectMarginLeft - travel;
        }
        //Set newPosition of object
        object.style.left = newObjectMarginLeft + "px";
    }
}

//WARNING: LOOSELY IMPLEMENTED
function throwAlert(message) {
    const windowStackArea = document.getElementById("windowStackArea");
    const alertBox = document.createElement("p");
    alertBox.setAttribute("class", "alertBox");
    alertBox.innerHTML = message;
    windowStackArea.insertBefore(alertBox, windowStackArea.children[0])

    window.setTimeout(function () {
        alertBox.remove();
    }, 20000)
}

function installApps() {
    //Create iconDivision
    const iconDivision = document.createElement("div");
    iconDivision.setAttribute("class", "workspaceAreaDivision");
    //Objectify PHP parameters
    // const parametersObject = {
    //     functionString: "getFilePathsArray();",
    //     directoryPath: ""
    // };
    //WARNING: DO NOT RELY ON AUTOMATIC APP INSTALLATION
    //Request appPathsArray
    // parseHttpDataRequest('FileSystem.php', parametersObject, "json", function (appPathsArray) {
    //     //Create a shortcut for each appPath
    //     var appPathsArrayLength = appPathsArray.length;
    //     if (appPathsArrayLength !== 0) {
    //         for (var i = 0; i < appPathsArrayLength; i++) {
    //             //Checks if fileExtension matches with the supportedFileExtensionsArray elements
    //             var appExtension = appPathsArray[i].slice(appPathsArray[i].lastIndexOf(".")).toLowerCase();
    //             if (appExtension === ".html" || appExtension === ".php") {
    //                 if (filesToIgnoreArray.includes(appPathsArray[i].toLowerCase())) {
    //                     //Ignore systemFiles as an app
    //                     continue;
    //                 } else {
    //                     //Create iconSection
    //                     var iconSection = document.createElement("div");
    //                     iconSection.id = appPathsArray[i];
    //                     iconSection.setAttribute("class", "workspaceAreaDivisionIcon");
    //                     iconSection.addEventListener("dblclick", function () { createWindowBox(this.id); });
    //                     //Create iconLabel
    //                     var iconLabel = document.createElement("span");
    //                     //Get the appName
    //                     iconLabel.innerHTML = appPathsArray[i].slice(0, appPathsArray[i].lastIndexOf("."));
    //                     //Append elements into HTML
    //                     iconSection.appendChild(iconLabel);
    //                     iconDivision.appendChild(iconSection);
    //                 }
    //             }
    //         }
    //     }
    // });

    parseHttpDataRequest("System64/Registry/AppLinks.json", undefined, "json", function (appDataObject) {
        for (let appName in appDataObject) {
            //Create iconSection
            const iconSection = document.createElement("div");
            iconSection.id = appDataObject[appName][0];
            iconSection.setAttribute("class", "workspaceAreaDivisionIcon");
            iconSection.addEventListener("dblclick", function () { createWindowBox(this.id); });
            //Create iconThumbnail
            const iconThumbnail = document.createElement("div");
            iconThumbnail.setAttribute("class", "workspaceAreaDivisionIconThumbnail");
            iconThumbnail.style.backgroundImage = `url('${appDataObject[appName][1]}')`;
            //Create iconLabel
            const iconLabel = document.createElement("span");
            iconLabel.innerHTML = appName;
            //Append elements into HTML
            iconSection.appendChild(iconThumbnail);
            iconSection.appendChild(iconLabel);
            iconDivision.appendChild(iconSection);
        }
    });
    //Append elements into HTML
    document.getElementById("workspaceArea").appendChild(iconDivision);
}

function createWindowBox(appPath) {
    if (windowZIndexArray.length > 7) {
        //Limit window instances to a maximum of 5
        window.alert("Maximum number of window instances reached. Close one or more open windows and try again.");
    } else {
        //Window creation
        const windowBox = document.createElement("div");
        windowBox.id = windowZIndexArray.length + "Window";
        windowBox.setAttribute("class", "window");
        windowBox.style.display = "block";
        windowBox.style.zIndex = (windowZIndexArray.length - 1).toString();
        //Add eventListeners for focusWindow and startDragWindow
        windowBox.addEventListener("mousedown", function (eventDetails) {
            startDragWindow(eventDetails, this);
            focusWindow(parseInt(this.id));
        });
        //iframe creation
        const iFrame = document.createElement("iframe");
        iFrame.setAttribute("class", "iFrame");
        iFrame.src = appPath;
        //Add eventListener for the purpose of loading quickAccessArea and setting developer defined dimensions initially
        iFrame.addEventListener("load", function () {
            focusWindow(parseInt(this.parentElement.id));
            setIFrameDimensions(parseInt(this.parentElement.id));
        });
        //Append elements into HTML
        windowBox.appendChild(iFrame);
        document.getElementById("body").appendChild(windowBox);
        //Insert windowBox into windowZIndexArray
        windowZIndexArray.push(windowBox);
    }
}

//INFO: FUNCTION IS TO BE INVOKED INSIDE focusWindow
function updateQuickAccessWindowStackAreas(windowIndex) {
    //Define the function to createQuickAccessArea
    function createQuickAccessArea(windowIndex) {
        //Get iFrame's document object
        const iFrameDocumentObject = windowZIndexArray[windowIndex].children[0].contentWindow.document;
        //Save windowIndex representing the whole window in its dataCarrier
        iFrameDocumentObject.getElementById("dataCarrier").dataset.windowIndex = windowIndex;
        //Assign program's desktopBottom to current desktopBottom
        document.getElementById("quickAccessArea").innerHTML = iFrameDocumentObject.getElementById("quickAccessArea").innerHTML;
        //Exclusively set iFrame's hidden synchronizableInputPrimaryValue to synchronizableInputPrimaryValue
        //WARNING:THIS SOLUTION MUST BE IMPROVED
        if (iFrameDocumentObject.getElementById("synchronizableInputPrimary")) {
            document.getElementById("synchronizableInputPrimary").value = iFrameDocumentObject.getElementById("synchronizableInputPrimary").value;
        }
    }

    //Define the function to createWindowStackArea
    function createWindowStackArea() {
        //Get windowStackArea
        const windowStackArea = document.getElementById("windowStackArea");
        //Clear windowStackArea
        windowStackArea.innerHTML = "";
        //Create windowStackAreaButton for startScreen
        const startWindowStackAreaButton = document.createElement("span");
        startWindowStackAreaButton.innerHTML = "| Start |";
        //Append elements into HTML
        windowStackArea.appendChild(startWindowStackAreaButton);
        //Update windowStackArea according to windowZIndexArray
        for (let i = 3; i < windowZIndexArray.length; i++) {
            //Create a windowStackAreaButton
            const windowStackAreaButton = document.createElement("span");
            windowStackAreaButton.id = i + "WindowStackAreaButton";
            //Add eventListeners for peekFunctionality
            windowStackAreaButton.addEventListener("mouseover", function () { peekWindow(parseInt(this.id)); });
            windowStackAreaButton.addEventListener("mouseout", peekOutWindows);
            //Check if windowStackAreaButton represents a maximizedWindow
            if (windowZIndexArray[i] instanceof Element) {
                //Check if the windowZIndexArray[i] is the focusedWindow
                if (i === windowZIndexArray.length - 1) {
                    windowStackAreaButton.innerHTML = "| " + windowZIndexArray[i].children[0].contentWindow.document.getElementById("title").innerHTML + " |";
                } else {
                    windowStackAreaButton.innerHTML = windowZIndexArray[i].children[0].contentWindow.document.getElementById("title").innerHTML;
                }
                //Add eventListener for minimizeWindow
                windowStackAreaButton.addEventListener("click", function () { minimizeWindow(parseInt(this.id)); });
            } else {
                windowStackAreaButton.innerHTML = windowMinimizedArray[i].children[0].contentWindow.document.getElementById("title").innerHTML;
                windowStackAreaButton.setAttribute("class", "linkButton");
                //Add eventListener for maximizeWindow
                windowStackAreaButton.addEventListener("click", function () { maximizeWindow(parseInt(this.id)); });

            }
            //Append elements into HTML
            windowStackArea.appendChild(windowStackAreaButton);
        }
    }

    //createQuickAccessArea as defined only if the index doesn't belong to startScreen
    if (windowIndex !== windowZIndexArray.indexOf("startScreen")) {
        createQuickAccessArea(windowIndex);
    }
    //createWindowStackArea as defined
    createWindowStackArea();
}

function peekWindow(windowIndex) {
    //Make every window blurred
    for (let i = 3; i < windowZIndexArray.length; i++) {
        if (windowZIndexArray[i] instanceof Element) {
            windowZIndexArray[i].classList.add("window-blurred");
        } else {
            windowMinimizedArray[i].classList.add("window-blurred");
        }
    }
    //Get the minimumPossibleZIndex
    //minimumPossibleZIndex equals to windowZIndexArrayLength. So no need of recalculation
    //Update the zIndex and style only of the windowToPeek
    if (windowZIndexArray[windowIndex] instanceof Element) {
        windowZIndexArray[windowIndex].style.zIndex = windowZIndexArray.length;
        windowZIndexArray[windowIndex].classList.remove("window-blurred");
    } else {
        windowMinimizedArray[windowIndex].style.zIndex = windowZIndexArray.length;
        windowMinimizedArray[windowIndex].style.visibility = "visible";
        windowMinimizedArray[windowIndex].classList.remove("window-blurred");
    }
}

function peekOutWindows() {
    //Make every window un-blurred, every minimizedWindow hidden, every window's zIndex match their windowIndex
    for (let i = 3; i < windowZIndexArray.length; i++) {
        if (windowZIndexArray[i] instanceof Element) {
            windowZIndexArray[i].classList.remove("window-blurred");
            windowZIndexArray[i].style.zIndex = i;
        } else {
            windowMinimizedArray[i].classList.remove("window-blurred");
            windowMinimizedArray[i].style.visibility = "hidden";
            windowMinimizedArray[i].style.zIndex = i;
        }
    }
}

function startDragWindow(eventDetails, windowBox) {
    //Turn off all pointer events for all iFrames
    const iFramesArray = document.getElementsByTagName("iframe");
    for (let i = 0; i < iFramesArray.length; i++) {
        iFramesArray[i].classList.add("iFrame-disabled");
    }
    //Get the originalMousePositions
    const originalMousePositionX = eventDetails.screenX;
    const originalMousePositionY = eventDetails.screenY;
    //Add eventListeners
    window.addEventListener("mousemove", mouseMoveWindow);
    window.addEventListener("mouseup", endDragWindow);
    //Declare and initialize variables to store difference
    let differenceX = 0;
    let differenceY = 0;
    //Define the function for mouseMove event
    function mouseMoveWindow(eventDetails) {
        //Calculate the travelledDistance of the mouse as a vector
        differenceX = eventDetails.screenX - originalMousePositionX;
        differenceY = eventDetails.screenY - originalMousePositionY;
        //Translate windowBox accordingly
        windowBox.style.transform = "translate(" + differenceX + "px, " + differenceY + "px)";
    }
    //Define the function for mouseup event
    function endDragWindow() {
        //Turn back on all pointer events for all iFrames
        const iFramesArray = document.getElementsByTagName("iframe");
        for (let i = 0; i < iFramesArray.length; i++) {
            iFramesArray[i].classList.remove("iFrame-disabled");
        }
        //Apply translation into permanent position
        windowBox.style.left = (parseInt(window.getComputedStyle(windowBox).left) + differenceX) + "px";
        windowBox.style.top = (parseInt(window.getComputedStyle(windowBox).top) + differenceY) + "px";
        //Remove translation
        windowBox.style.transform = "none";
        //Remove all auto generated eventListeners
        window.removeEventListener("mousemove", mouseMoveWindow);
        window.removeEventListener("mouseup", endDragWindow);
    }
}

function focusWindow(windowIndex) {
    //Check if the windowIndex is the startScreenIndex
    if (windowZIndexArray[windowIndex] === "startScreen") {
        //Assign system default quickAccessArea
        document.getElementById("quickAccessArea").innerHTML = document.getElementById("quickAccessAreaStart").innerHTML;
        //UpdateWindowStackArea
        updateQuickAccessWindowStackAreas(windowZIndexArray.indexOf("startScreen"));
    } else {
        //Remove focusedStyle from every maximized window
        for (let i = windowZIndexArray.length - 1; i > 2; i--) {
            //Remove styling only of the topmostWindowElement
            if (windowZIndexArray[i] instanceof Element) {
                windowZIndexArray[i].classList.remove("window-active");
            } else {
                continue;
            }
        }
        //Get windowToFocus from the windowZIndexArray while freeing and filling up its index
        const windowToFocus = windowZIndexArray.splice(windowIndex, 1)[0];
        //Add windowToFocus at the end(i.e. the last index) of the windowZIndexArray
        windowZIndexArray.push(windowToFocus);
        // Update zIndex + windowID of all windows according to windowZIndexArray
        for (let i = 3; i < windowZIndexArray.length; i++) {
            //Do updating only of windowElements
            if (windowZIndexArray[i] instanceof Element) {
                windowZIndexArray[i].style.zIndex = i;
                windowZIndexArray[i].id = i + "Window";
            } else {
                continue;
            }
        }
        //Add style for the newlyFocusedWindow
        windowToFocus.classList.add("window-active");
        //Change the minimizedWindow Indexes according to windowZIndexArray reference
        //Declare and initialize a temporal array for minimized windows
        const temporalWindowMinimizedArray = ["reserved", "reserved", "startScreen"];
        for (let i = 3; i < windowZIndexArray.length; i++) {
            //Check for windowReferences(i.e. strings with windowID's) in the windowZIndexArray
            if (windowZIndexArray[i] instanceof Element) {
                continue;
            } else {
                //Copy windowElements to temporalWindowMinimizedArray using WindowZIndexArray references
                temporalWindowMinimizedArray[i] = windowMinimizedArray[parseInt(windowZIndexArray[i])];
                //Rename windowZIndexArray's ID reference to match current index
                windowZIndexArray[i] = i + "Window";
            }
        }
        //Clear windowMinimizedArray
        windowMinimizedArray.length = 0;
        //Replace windowMinimizedArray with temporalWindowMinimizedArray
        for (let i = 0; i < temporalWindowMinimizedArray.length; i++) {
            windowMinimizedArray[i] = temporalWindowMinimizedArray[i];
        }
        //Assign relevant quickAccessArea for focusedWindow
        const newWindowIndex = windowZIndexArray.indexOf(windowToFocus);
        updateQuickAccessWindowStackAreas(newWindowIndex);

    }
}

function closeWindow(windowIndex) {
    //Get windowToClose from the windowZIndexArray while freeing and filling up its index
    const windowToClose = windowZIndexArray.splice(windowIndex, 1)[0];
    //Add the closeAnimation for the windowToClose
    windowToClose.style.animationName = "closeWindowAnimation";
    //Remove windowToClose with a delay to play the animation
    window.setTimeout(function () { windowToClose.remove(); }, 250);
    //Get the topmostWindowIndex
    //Declare and initialize topmostWindowIndex to represent startScreenIndex in case of a no topmostWindow
    let topmostWindowIndex = 2;
    for (let i = windowZIndexArray.length - 1; i > 2; i--) {
        if (windowZIndexArray[i] instanceof Element) {
            topmostWindowIndex = i;
            break;
        } else {
            continue;
        }
    }
    //Focus the topmostWindow
    focusWindow(topmostWindowIndex);
}

function minimizeWindow(windowIndex) {
    //Hide the windowToMinimize
    windowZIndexArray[windowIndex].style.visibility = "hidden";
    //Add the windowToMinimize into windowMinimizedArray's same index
    windowMinimizedArray[windowIndex] = windowZIndexArray[windowIndex];
    //Replace the index used by windowToMinimize with its ID
    windowZIndexArray[windowIndex] = windowZIndexArray[windowIndex].id;
    //Get the topmostWindowIndex
    //Initiate topmostWindowIndex to represent startScreenIndex in case of no windows
    let topmostWindowIndex = 2;
    for (let i = windowZIndexArray.length - 1; i > 2; i--) {
        if (windowZIndexArray[i] instanceof Element) {
            topmostWindowIndex = i;
            break;
        } else {
            continue;
        }
    }
    //Focus the topmostWindow
    focusWindow(topmostWindowIndex);
}

function maximizeWindow(windowMinimizedArrayIndex) {
    //Make the windowToMaximize visible
    windowMinimizedArray[windowMinimizedArrayIndex].style.visibility = "visible";
    //Add the windowToMaximize into windowZIndexArray's same index
    windowZIndexArray[windowMinimizedArrayIndex] = windowMinimizedArray[windowMinimizedArrayIndex];
    //Free up the index used by the windowToMaximize
    windowMinimizedArray[windowMinimizedArrayIndex] = undefined;
    //Focus the windowToMaximize
    focusWindow(windowMinimizedArrayIndex);
}

function setIFrameDimensions(windowIndex) {
    //Get dimensions from the dataCarrier
    const iFrameHeight = document.getElementById("dataCarrier").dataset.height;
    const iFrameWidth = document.getElementById("dataCarrier").dataset.width;
    //Get windowToResize
    const iFrameToResize = windowZIndexArray[windowIndex].children[0];
    //Set dimensions for windowToResize
    iFrameToResize.style.height = iFrameHeight;
    iFrameToResize.style.width = iFrameWidth;
}

function synchronizeInput(windowIndex) {
    //Get the iFrame's document object
    const iFrameDocumentObject = windowZIndexArray[windowIndex].children[0].contentWindow.document;
    //Get the value of the synchronizableInputPrimary
    const synchronizableInputPrimaryValue = document.getElementById("synchronizableInputPrimary").value;
    //Assign synchronizableInputPrimaryValue to synchronizableInputSecondary
    iFrameDocumentObject.getElementById("synchronizableInputSecondary").value = synchronizableInputPrimaryValue;
    //Assign synchronizableInputPrimaryValue to synchronizableInputPrimary of the iFrame
    iFrameDocumentObject.getElementById("synchronizableInputPrimary").value = synchronizableInputPrimaryValue;
}

function parseInnerScript(functionName) {
    //Get the windowIndex related to the current quickAccessArea
    const windowIndex = document.getElementById("dataCarrier").dataset.windowIndex;
    //Create an evalString to execute the function
    const evalString = `windowZIndexArray[${windowIndex}].children[0].contentWindow.${functionName}()`;
    eval(evalString);
}

function parseOuterScript(functionName) {
    //Get the windowIndex related to the current quickAccessArea
    const windowIndex = document.getElementById("dataCarrier").dataset.windowIndex;
    //Create an evalString to execute the function
    const evalString = `${functionName}(${windowIndex})`;
    eval(evalString);
}

function initialize() {
    //Call startupFunctions
    installApps();
}