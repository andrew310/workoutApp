/**
 * Created by Andrew on 12/2/2015.
 */

/*add listeners for the buttons*/
document.addEventListener('DOMContentLoaded', bindButton);

function bindButton(){
    //finds the addrow button
    document.getElementById('AddRow').addEventListener('click', function(event){
        alert("HI");
        //create new ajax request
        var postReq = new XMLHttpRequest();
        //convert values from fields to json string
        var payload = JSON.stringify({
            name: document.getElementById('name').value,
            reps: document.getElementById('reps').value,
            weight: document.getElementById('weight').value,
            date: document.getElementById('date').value,
            lbs: document.getElementById('lbs').value
        });

        alert(payload.name);
        //open url REMEMBER TO CONVERT TO ASYNCHRONOUS
        postReq.open('POST', '/addRow', false);
        //set request header to JSON

        //set header to json=true
        postReq.setRequestHeader('Content-Type', 'application/json');
        //send our data
        postReq.send(payload);
        //log status and results
        alert(postReq.statusText);
        console.log(postReq.statusText);
        console.log(postReq.responseText);

        //convert responseText to JSON and set the values to show up in their respective fields
        var results = JSON.parse(postReq.responseText);
        //update table with results from the server (it sends back the same data, but ensures it is valid per database standards
        var table = document.getElementById("workoutNav");
        //get row count
        var index = table.rows.length;
        //add row
        var row = table.insertRow(index);
        //add all cells into the current row
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        cell1.innerHTML = results.name;
        cell2.innerHTML = results.reps;
        cell3.innerHTML = results.weight;
        cell4.innerHTML = results.date;
        cell5.innerHTML = results.lbs;
        cell6.innerHTML = "<input type=\"button\" value=\"delete\" onclick=\"deleteRow(\'workoutNav\',this, " + results.id +")\" />";
        cell7.innerHTML = "<input type=\"button\" value=\"update\" onclick=\"deleteRow(\'workoutNav\',this, " + results.id +")\" />";

        //document.getElementById('echofName').textContent = results.json.name;
        //document.getElementById('echolName').textContent = results.json.reps;
        event.preventDefault();
    })
}

//deleteRow function
function updateRow(tableID,currentRow, rowID) {
    alert(rowID);
    var payload = JSON.stringify({
        id: rowID,
    });

    var postReq = new XMLHttpRequest();
    //open url REMEMBER TO CONVERT TO ASYNCHRONOUS
    postReq.open('POST', '/update', false);
    //set header to json=true
    postReq.setRequestHeader('Content-Type', 'application/json');
    postReq.send(payload);
    //alert(postReq.statusText);
}



//deleteRow function
function deleteRow(tableID,currentRow, rowID) {
    var payload = JSON.stringify({id: rowID});
    var postReq = new XMLHttpRequest();
    //open url REMEMBER TO CONVERT TO ASYNCHRONOUS
    postReq.open('POST', '/deleteRow', false);
    //set header to json=true
    postReq.setRequestHeader('Content-Type', 'application/json');
    postReq.send(payload);
    alert(postReq.statusText);
    console.log(postReq.statusText);
    console.log(postReq.responseText);

    alert(rowID);
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];

            if (row==currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete the header row.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}
