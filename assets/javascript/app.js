$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBfkrcYB3NxjPy7jTxLNO4MDnwfCES47Wk",
        authDomain: "trainscheduleproject-98879.firebaseapp.com",
        databaseURL: "https://trainscheduleproject-98879.firebaseio.com",
        projectId: "trainscheduleproject-98879",
        storageBucket: "",
        messagingSenderId: "637219215012"
    };
    
    firebase.initializeApp(config);

    var database = firebase.database();
    
    
    var trainName = '';
    var trainDestination = '';
    var firstTrainTime = '';
    var frequency = 0;
    var arrivalTimeArray = [];
    var initialLoad = true;
    
    database.ref('trains/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            // var currentTime = new Date();
            // var currentHours = currentTime.getHours();
            // var currentMins = currentTime.getMinutes();
            // var currentSeconds = currentTime.getSeconds();
            // var nextTrain;
            // var isFound = false;
            // var i = 0;
            //var currentTimeInMins = (currentHours * 60) + currentMins + (currentSeconds / 60);
           // console.log(currentTimeInMins);
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            console.log(childKey + ' ' + childData.trainDestination + ' ' + childData.firstTrainTime + ' ' + childData.frequency);
            if (initialLoad) {
                addToTable(childKey, childData.trainDestination, childData.frequency);
            }
            // while(!isFound && i < childData.arrivalTimes.length) {
            //     console.log(childData.arrivalTimes[i]);
            //     if (currentTimeInMins < childData.arrivalTimes[i]) {
                
            //         var foundIndex = i - 1;
            //         console.log(foundIndex);
            //         nextTrain = childData.arrivalTimes[foundIndex];
            //         isFound = true;
            //     } else {
            //         i++;
            //     }
            // }
            // console.log(nextTrain);
            // var nextTrainMinutes = nextTrain % 60;
            // console.log(nextTrainMinutes);
            findNextTime(childData.arrivalTimes);
        });
        
    });

    $('#add-train-button').on('click', function() {
        if (validateInput()) {
            initialLoad = false;
            trainName = $('#train-name').val().trim();
            trainDestination = $("#destination").val().trim();
            firstTrainTime = $('#first-train-time').val().trim();
            frequency = $('#frequency').val().trim();
            console.log(trainName);
            console.log(trainDestination);
            console.log(firstTrainTime);
            console.log(frequency);
            $('#name-error').hide();
            $('#destination-error').hide();
            $('#first-time-error').hide();
            $('#frequency-error').hide();
            var firstTimeAfterSplit = firstTrainTime.split(':');
            var firstTimeInMins = firstTimeAfterSplit[0] * 60 + parseInt(firstTimeAfterSplit[1]);
            for (var i = firstTimeInMins; i <= 1440; i+=parseInt(frequency)) {
                arrivalTimeArray.push(i);
            }
            var nextTrainTimeInMins = findNextTime(arrivalTimeArray);
            var nextTimeHours = parseInt(nextTrainTimeInMins / 60);
            console.log('hours: ' + nextTimeHours);
            var nextTimeMins = nextTrainTimeInMins % 60;
            console.log('minutes: ' + nextTimeMins);
            var newPostRef = database.ref('trains/' + trainName).set({
                trainDestination: trainDestination,
                firstTrainTime: firstTrainTime,
                frequency: frequency,
                arrivalTimes: arrivalTimeArray
            });
            // var postID = newPostRef.key;
            // keyArray.push(postID);
            // console.log(postID);
            // console.log(keyArray);
            console.log(newPostRef);
            addToTable(trainName, trainDestination, frequency);
            clearForm();
            
        }
        
    });

    function addToTable(name, dest, freq) {
        var newRowTag = $('<tr>');
        newRowTag.addClass('data-for-train');
        var trainNameDataTag = $('<td>');
        trainNameDataTag.html(name);
        newRowTag.append(trainNameDataTag);
        var destinationDataTag = $('<td>');
        destinationDataTag.html(dest);
        newRowTag.append(destinationDataTag);
        var frequencyDataTag = $('<td>');
        frequencyDataTag.html(freq);
        newRowTag.append(frequencyDataTag);
        $('.train-data').append(newRowTag);

    }

    function validateInput() {
        var validEntry = true;
        if (!$('#train-name').val()) {
            $('#name-error').show();
            validEntry = false;
        } 
        if (!$('#destination').val()) {
            console.log('entered second if');
            $('#destination-error').show();
            validEntry = false;
        }
        if (!$('#first-train-time').val()) {
            $('#first-time-error').show();
            validEntry = false;
        }
        if (!$('#frequency').val()) {
            $('#frequency-error').show();
            validEntry = false;
        }
        return validEntry;
    }

    function clearForm() {
        $('#train-name').val('');
        $('#destination').val('');
        $('#first-train-time').val('');
        $('#frequency').val('');
    }

    function findNextTime(arrayArrivalTimes) {
        var currentTime = new Date();
        var currentHours = currentTime.getHours();
        var currentMins = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();
        var nextTrain;
        var isFound = false;
        var i = 0;
        var currentTimeInMins = (currentHours * 60) + currentMins + (currentSeconds / 60);
        console.log(currentTimeInMins);
        while(!isFound && i < arrayArrivalTimes.length) {
            console.log(arrayArrivalTimes[i]);
            if (currentTimeInMins < arrayArrivalTimes[i]) {
                var foundIndex;
                if (i === 0) {
                    foundIndex = i;
                } else {
                    foundIndex = i - 1;
                }
                console.log(foundIndex);
                nextTrain = arrayArrivalTimes[foundIndex];
                isFound = true;
            } else if (i === arrayArrivalTimes.length - 1) {
                isFound = true;
                nextTrain = arrayArrivalTimes[0];
            } else {
                i++;
            }
        }
        console.log(nextTrain);
        return nextTrain;
    }
});