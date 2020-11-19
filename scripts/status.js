// Adding status details in status tab 

const today = new Date();
const dateToday = Number(String(today.getDate()).padStart(2, '0'))
let ddlimit = Number(String(today.getDate()).padStart(2, '0')) - 6;
let mm = Number(String(today.getMonth() + 1).padStart(2, '0')); //January is 0
let yyyy = Number(today.getFullYear());
let dateList = []

while(ddlimit <= dateToday){
	const currentDate = String(ddlimit).padStart(2, '0') + '/' + String(mm).padStart(2, '0') + '/' + yyyy;
    dateList.push(currentDate);
    ddlimit++
}

const statusDateOptions = document.querySelector('#work-date')
for(const list of dateList.reverse()){
    statusDateOptions.innerHTML += `<option>${list}</option>`
}

const activityTypeList = ['Coding', 'Management', 'Training', 'Marketing', 'System Design', 'Testing' ,'Other'];
const workingHoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const statusActivityOptions = document.querySelector('#activity-type')
for(const list of activityTypeList){
    statusActivityOptions.innerHTML += `<option>${list}</option>`
}

const statusHourOptions = document.querySelector('#working-hours')
for(const list of workingHoursList){
    statusHourOptions.innerHTML += `<option>${list}</option>`
}

// status submit function and validation 

// let allStatusDetails = statusDetails
document.querySelector('.status-submit-btn').addEventListener('click', ()=>{
    const getCurrentProjectId = document.querySelector('.selection').dataset.projectid
    // const getCurrentProject = projects.projectList.filter((project)=>project.projectId == getCurrentProjectId)[0].projectName
    const selectedDateOptn = statusDateOptions.options[statusDateOptions.selectedIndex].value;
    const selectedResourceOptn = statusResourceOptions.options[statusResourceOptions.selectedIndex].value;
    const selectedResourceId = statusResourceOptions.options[statusResourceOptions.selectedIndex].dataset.id;
    const selectedActivityOptn = statusActivityOptions.options[statusActivityOptions.selectedIndex].value;
    const selectedHourOptn = statusHourOptions.options[statusHourOptions.selectedIndex].value;
    let selectedResourceExist = false;
    let selectedActivityExist = false
    
    if(currentDateDetails[selectedDateOptn]){
        for(const details of currentDateDetails[selectedDateOptn]){
            if(details.resourceName == selectedResourceOptn && details.activityType == selectedActivityOptn){
                selectedResourceExist = true;
                selectedActivityExist = true;
            }
        }
        var maxWorkHours = currentDateDetails[selectedDateOptn].filter(e=>e.resourceName == selectedResourceOptn).reduce((a,v) => (a+Number(v.workHours)),0);
        maxWorkHours += Number(selectedHourOptn);
    }
    
   
   

    if(selectedResourceOptn === 'None'){
        document.querySelector('.no-selection-error').innerHTML = 
        `<p style="color: rgb(228, 49, 49);font-size: 12px;">Select resource</p>`
    } else if(selectedResourceExist == true && selectedActivityExist == true){
        document.querySelector('.no-selection-error').innerHTML = 
        `<p style="color: rgb(228, 49, 49);font-size: 12px;">Status already exist for resource</p>`
    } else if((maxWorkHours) && (maxWorkHours>14)) {
        document.querySelector('.no-selection-error').innerHTML = 
        `<p style="color: rgb(228, 49, 49);font-size: 12px;">Work hours exceed maximum limit</p>`
    }
    else {
        document.querySelector('.no-selection-error').innerHTML = ""
        let dailyStatusDetail = {
            project_id: getCurrentProjectId,
            date: selectedDateOptn,
            resource_id: selectedResourceId ,
            activityType: selectedActivityOptn,
            workHours: selectedHourOptn,
            name: selectedResourceOptn
        }
       
        console.log(dailyStatusDetail);
        // put(urlList.statuses, statusSecretKey, allStatusDetails, printResult);
        postApi("http://localhost:8080/status", dailyStatusDetail, printDeletedResult);
        let statusId = statusDetails[statusDetails.length-1].id+1;
        statusDetails.push({id:statusId,...dailyStatusDetail});
        loadHistory();
        document.querySelector('.no-selection-error').innerHTML =
        `<p style="color: lightgreen;font-size: 12px;">Status successfully added</p>`
        setTimeout(function(){
            document.querySelector('.no-selection-error').innerHTML = ""
           }, 2000);
    }
    
})

//---------- Loading status history dynamically----------------
let currentDateDetails = {}
function loadHistory() {
    document.querySelector(".status-container").innerHTML = "";
    const CurrentProjectId = document.querySelector('.selection').dataset.projectid
    // const CurrentProject = projects.projectList.filter((project)=>project.projectId == CurrentProjectId)[0].projectName
    const currentProjStatus = statusDetails.filter(e => e.project_id == CurrentProjectId);
    if(currentProjStatus.length !== 0) {
        const statusDates = [...new Set(currentProjStatus.map((e)=>e.date))]
        const sortedstatusDates = statusDates.sort((a,b) => a < b ? 1 : -1);
        currentDateDetails = {}
    
        sortedstatusDates.forEach((e)=>{
            currentDateDetails[e] = currentProjStatus.filter((d)=> d.date == e)
        })
    
        let i = 0 ;  
        for(const details in currentDateDetails){
            let statusContainer = document.querySelector(".status-container");
            statusContainer.innerHTML +=
            `<div class="status-card">   
                <div class="dates-section">
                    <p><span class="date">${ details }</span></p>
                </div>
                <div class="details-section">
                </div>
            </div>`;
            let serialNumber = 1;
            for(const resources of currentDateDetails[details]){
    
                document.querySelectorAll('.details-section')[i].innerHTML += 
                `<div class="details-content">
                    <span style="padding: 0px 10px;" id="serialnumber">${serialNumber}</span>
                    <p>Name: <span class="details" id="name">${resources.name}</span></p>
                    <p>Activity:  <span class="details" id="activity">${resources.activityType}</span></p>
                    Hours:  <span style = "padding-right:10px" id="hours">${resources.workHours}</span>
                </div>` 
                serialNumber++;
            }
            i++
        }
    }
    else {
        document.querySelector(".status-container").innerHTML = `<p class="no-status">No status history available</p>`
    }
   
}

loadHistory();

