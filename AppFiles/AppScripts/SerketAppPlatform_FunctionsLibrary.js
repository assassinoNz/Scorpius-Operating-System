//SERVICE FUNCTIONS
//Refreshes the windowObject which owns this function
function refreshWindow() {
    //Reload window (true==forceGet, which means reload from scratch)
    location.reload(true);
}
//Requests data from a resource and executes a resolveFunction passing the retrieved data to it
function parseHttpDataRequest(resource, parametersObject, expectedResponseType, resolveFunction) {
    window.fetch(resource, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `parametersObject=${JSON.stringify(parametersObject)}`
    }).then(function (responseObject) {
        if (expectedResponseType === "json") {
            return responseObject.json();
        } else if (expectedResponseType === "text") {
            return responseObject.text();
        } else if (expectedResponseType === "blob") {
            return responseObject.blob();
        }
    }).then(function (parsedResponseObject) {
        if (resolveFunction !== undefined) {
            resolveFunction(parsedResponseObject);
        }
    });
}
//Parses a task without Requesting data from a resource and executes a resolveFunction
function parseHttpTaskRequest(resource, parametersObject, resolveFunction) {
    window.fetch(resource, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `parametersObject=${JSON.stringify(parametersObject)}`
    }).then(function (parsedResponseObject) {
        if (resolveFunction !== undefined) {
            resolveFunction();
        }
    })
}
//Outputs current time
function getCurrentTime() {
    //Create a new dateObject with currentDate
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    //Format hours and minutes for leading zero
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    //Output time
    return (hours + " : " + minutes);
}
//Formats a time given in seconds to HH:MM:SS format
function formatTime(totalSeconds) {
    //Calculate time to HH:MM:SS format
    var totalMinutes = totalSeconds / 60;
    var totalHours = parseInt(totalSeconds / 3600);
    var resultingMinutes = parseInt(totalMinutes - (totalHours * 60));
    var resultingSeconds = parseInt(totalSeconds - (resultingMinutes * 60) - (totalHours * 3600));
    //Format integers for leading zeros
    if (totalHours < 10) { totalHours = "0" + totalHours; }
    if (resultingMinutes < 10) { resultingMinutes = "0" + resultingMinutes; }
    if (resultingSeconds < 10) { resultingSeconds = "0" + resultingSeconds; }
    //Output formatted time
    return (totalHours + ":" + resultingMinutes + ":" + resultingSeconds);
}
//Returns a setInterval with the callbackFunction already invoked
function setImmediateInterval(setIntervalFunction, miliseconds) {
    setIntervalFunction();
    var setIntervalID = window.setInterval(setIntervalFunction, miliseconds);
    return setIntervalID;
}


//SERKET APP INTERFACE FUNCTIONS
//Switches between paneAreaDivisions in the paneArea
function switchPane(paneID, paneTab) {
    //Get panes in paneArea
    var paneAreaChildrenArray = document.getElementById("paneArea").children;
    //Get paneTabs in sidebarArea
    var sidebarAreaChildrenArray = document.getElementById("sidebarArea").children;
    //Hide all panes in paneArea
    for (var i = 0; i < paneAreaChildrenArray.length; i++) {
        paneAreaChildrenArray[i].style.display = "none";
    }
    //Unselect all paneTabs in sidebarArea
    for (var i = 0; i < sidebarAreaChildrenArray.length; i++) {
        sidebarAreaChildrenArray[i].classList.remove("sidebarAreaDivision-active");
    }
    //Make only the relevant pane visible
    document.getElementById(paneID).style.display = "block";
    //change color of only the relevant tab
    paneTab.classList.add("sidebarAreaDivision-active");
}
//Switches between panelAreaDivisions in panelArea
function switchPanel(panelID, panelTab) {
    //Get panes in paneArea
    var panelAreaChildrenArray = document.getElementById("panelArea").children;
    //Get panelTabs in panelsPane
    var panelsPaneChildrenArray = document.getElementById("panelsPane").children;
    //Hide all panels in panelArea
    for (var i = 0; i < panelAreaChildrenArray.length; i++) {
        panelAreaChildrenArray[i].style.display = "none";
    }
    //Unselect all panelTabs in panelsPane
    for (var i = 0; i < panelsPaneChildrenArray.length; i++) {
        panelsPaneChildrenArray[i].classList.remove("paneAreaDivisionSector-active");
    }
    //Make only the relevant panel visible
    document.getElementById(panelID).style.display = "flex";
    //change color of only the relevant tab
    panelTab.classList.add("paneAreaDivisionSector-active");
}


//SERKET UI CONTROLLER FUNCTIONS
//Defines a procedure for the interactionLifeCycle between user and a circularSlider
function startDragCircularSlider(sliderThumb, customStartFunction, customMoveFunction, customEndFunction) {
    //Get the boundary of the slider
    var sliderBoundary = sliderThumb.parentElement.parentElement.getBoundingClientRect();
    //Calculate slider's center using sliderTrackPosition
    sliderThumbContainerCenterY = (sliderBoundary.bottom - sliderBoundary.top) / 2 + sliderBoundary.top;
    sliderThumbContainerCenterX = (sliderBoundary.right - sliderBoundary.left) / 2 + sliderBoundary.left;
    //Add eventListeners
    document.addEventListener("mousemove", mouseMoveThumb);
    document.addEventListener("mouseup", mouseUpThumb);
    //Call the customStartFunction
    if (customStartFunction !== undefined) {
        customStartFunction();
    }
    //Define the function for mousemove event
    function mouseMoveThumb(eventDetails) {
        //Make sliderThumbContainer rotate with mouse
        rotateThumbContainer(eventDetails, sliderThumb);
        //Call the customMoveFunction
        if (customMoveFunction !== undefined) {
            customMoveFunction();
        }
    }
    //Declare the function for mouseup event
    function mouseUpThumb() {
        //Call the customEndFUnction
        if (customEndFunction !== undefined) {
            customEndFunction();
        }
        //Remove added eventListeners
        document.removeEventListener("mousemove", mouseMoveThumb);
        document.removeEventListener("mouseup", mouseUpThumb);
    }
}
//INFO: FUNCTION IS TO BE INVOKED INSIDE startDragCircularSlider
//Rotates a sliderThumbContainer along with the mouse
function rotateThumbContainer(eventDetails, sliderThumb) {
    //Get mousePositions
    var mousePositionY = eventDetails.clientY;
    var mousePositionX = eventDetails.clientX;
    //Calculate lengths of the adjacentSide (distanceDifferenceY) and the oppositeSide (distanceDifferenceX) relative to sliderCenter;
    var distanceDifferenceY = mousePositionY - sliderThumbContainerCenterY;
    var distanceDifferenceX = sliderThumbContainerCenterX - mousePositionX;
    //Calculate theta(acute angle) after calculating tanTheta(absoluteValue)
    var tanTheta = Math.abs(distanceDifferenceX / distanceDifferenceY);
    var theta = Math.atan(tanTheta) * (180 / Math.PI);
    //Adjust theta considering circular sides
    if (distanceDifferenceX > 0 && distanceDifferenceY > 0) {
        theta = theta;
    } else if (distanceDifferenceX > 0 && distanceDifferenceY < 0) {
        theta = 180 - theta;
    } else if (distanceDifferenceX < 0 && distanceDifferenceY < 0) {
        theta = 180 + theta;
    } else if (distanceDifferenceX < 0 && distanceDifferenceY > 0) {
        theta = 360 - theta;
    } else if (distanceDifferenceX > 0 && distanceDifferenceY == 0) {
        theta = 90;
    } else if (distanceDifferenceX < 0 && distanceDifferenceY == 0) {
        theta = 270;
    } else if (distanceDifferenceX == 0 && distanceDifferenceY > 0) {
        theta = 360;
    } else if (distanceDifferenceX == 0 && distanceDifferenceY < 0) {
        theta = 180;
    }
    //Rotate sliderThumbContainer according to theta
    sliderThumb.parentElement.style.transform = "rotate(" + theta + "deg)";
}
//Returns the value currently represented by a circularSliderThumb
function getCircularSliderValue(sliderThumbContainer, rangeUpperLimit) {
    //Get sliderValue as theta
    var thetaString = sliderThumbContainer.style.transform;
    var theta = thetaString.slice(7, thetaString.length - 4);
    //Calculate currentSeekedValue according to theta
    var unit = rangeUpperLimit / 360;
    var currentSeekedValue = theta * unit;
    //Output currentSeekedValue
    return currentSeekedValue;
}