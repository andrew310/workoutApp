/**
 * Created by Andrew on 12/2/2015.
 */

/*add listeners for the buttons*/
document.addEventListener('DOMContentLoaded', bindButton);

function bindButton(){

    document.getElementById('AddRow').addEventListener('click', function(event){
        alert("HI");
        var postReq = new XMLHttpRequest();
        var payload = JSON.stringify({
            name: document.getElementById('name').value,
            reps: document.getElementById('reps').value,
            weight: document.getElementById('weight').value,
            date: document.getElementById('date').value,
            lbs: document.getElementById('lbs').value
        });

        alert(payload.name);
        postReq.open('POST', '/addRow', false);
        //set request header to JSON
        postReq.setRequestHeader('Content-Type', 'application/json');
        //send our data
        postReq.send(payload);
        //log status and results
        alert(postReq.statusText);
        console.log(postReq.statusText);
        console.log(postReq.responseText);

        //convert responseText to JSON and set the values to show up in their respective fields
        var results = JSON.parse(postReq.responseText);
        document.getElementById('echofName').textContent = results.json.name;
        document.getElementById('echolName').textContent = results.json.reps;

        event.preventDefault();
    })

}