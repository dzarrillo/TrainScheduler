
$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyAqI-ILfwuVugMapd2Q_2CyHTKxPeY3Uwo",
        authDomain: "mymusic-f24cb.firebaseapp.com",
        databaseURL: "https://mymusic-f24cb.firebaseio.com",
        projectId: "mymusic-f24cb",
        storageBucket: "mymusic-f24cb.appspot.com",
        messagingSenderId: "745921920653"
    };
    firebase.initializeApp(config);

    //Get data from firebase & populate the table
    var database = firebase.database();
    var databaseReference = firebase.database().ref("alltrains/");

    databaseReference.on("child_added", function (snapshot) {
        var destination = snapshot.val().destination;
        var trainName = snapshot.val().trainname;
        var frequency = parseInt(snapshot.val().frequency);
        var firstTime = snapshot.val().firsttraintime;

        //   get current time
        var currentTime = moment();
        console.log("Current time: " + currentTime);

        // Get time difference
        var firstdateConvert = moment(firstTime, "hh:mm").subtract(1, "years");
        console.log("CONVERTED DATE: " + firstdateConvert);

        var timeTrain = moment(firstdateConvert).format("HH:mm.ss");
        console.log("Train Time: " + timeTrain);

        var trainConvert = moment(timeTrain, "HH:mm.ss").subtract(1, "years");
        var timeDifference = moment().diff(moment(trainConvert), "minutes");
        console.log("Time Difference: " + timeDifference);

        var timeRemainder = timeDifference % frequency;
        console.log("Time Remaining: " + timeRemainder);
        console.log("Frequency: " + frequency);

        var minsAway = frequency - timeRemainder;
        console.log("Minutes until next train arrives: " + minsAway);

        var nextTrain = moment().add(minsAway, "minutes");
        console.log("Arrival time: " + moment(nextTrain).format("hh:mm A"));
       

        $("#train-tbl").append(
            "<tr></tr>" +
            "<td>" + trainName + "</td>" +
            "<td>" + destination + "</td>" +
            "<td>" + frequency + "</td>" +

            "<td>" + moment(nextTrain).format("hh:mm A") + "</td>" +
            "<td>" + minsAway + "</td>"

        );

        // Saving data to firebase
        $("#add-train-btn").on("click", function () {
            event.preventDefault();

            trainName = $("#trainname-input").val().trim();
            frequency = $("#frequency-input").val().trim(); 
            firstTime = $("#firsttrain-input").val().trim();
            destination = $("#destination-input").val().trim();

            // console.log("Train Name: " + trainName);
            // console.log("Frequency: " + frequency);
            // console.log("Train Time: " + firstTime);
            // console.log("Train Destination: " + destination);
            // database structure:
            // This was the biggest pain in the ass, I blew out my database several times untl I got it right
                
                // alltrains
                //     hazlet
                //         trainname
                //         frequency
                //         firsttraintime
                //         destination

             
            // var nodeRef = databaseReference.ref.set(trainName);
            var ref = firebase.database().ref().child("alltrains");
            
            // create node 
            ref.child(trainName).set({
                trainname: trainName,
                frequency: frequency,
                firsttraintime: firstTime,
                destination: destination   
            });
            
            // ToDo: I would like to verify if data was actually saved before clearing input data out
            $("#trainname-input").val("");
            $("#frequency-input").val(""); 
            $("#firsttrain-input").val("");
            $("#destination-input").val("");
            
        })
    });

});