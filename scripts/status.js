const today = new Date();
const dateToday = Number(String(today.getDate()).padStart(2, '0'))
let ddlimit = Number(String(today.getDate()).padStart(2, '0')) - 7;
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

const activityTypeList = ['Coding', 'Management', 'Training']
const workingHoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const statusActivityOptions = document.querySelector('#activity-type')
for(const list of activityTypeList){
    statusActivityOptions.innerHTML += `<option>${list}</option>`
}

const statusHourOptions = document.querySelector('#working-hours')
for(const list of workingHoursList){
    statusHourOptions.innerHTML += `<option>${list}</option>`
}

statusResourceList = ['None']
resources.forEach(element => {if(element != null){element.map(obj => {
    statusResourceList.push(obj.name)
  })}})
const uniqueResources = new Set(statusResourceList)

const statusResourceOptions = document.querySelector('#resource-list');

for(const list of uniqueResources){
    statusResourceOptions.innerHTML += `<option>${list}</option>`;
    
}

let Statusobj = []
let allStatusDetails = [...statusDetails]
document.querySelector('.status-submit-btn').addEventListener('click', ()=>{
    const getCurrentProjectId = document.querySelector('.selection').dataset.projectid
    const getCurrentProject = projects.projectList.filter((project)=>project.projectId == getCurrentProjectId)[0].projectName
    const selectedDateOptn = statusDateOptions.options[statusDateOptions.selectedIndex].value;
    const selectedResourceOptn = statusResourceOptions.options[statusResourceOptions.selectedIndex].value;
    const selectedActivityOptn = statusActivityOptions.options[statusActivityOptions.selectedIndex].value;
    const selectedHourOptn = statusHourOptions.options[statusHourOptions.selectedIndex].value

    if(selectedResourceOptn === 'None'){
        alert('incorrect')
    } else {
        let dailyStatusDetail = {
            projectName: getCurrentProject,
            date: selectedDateOptn,
            resourceName: selectedResourceOptn,
            activityType: selectedActivityOptn,
            workHours: selectedHourOptn
        }
        allStatusDetails.push(dailyStatusDetail)
        put(urlList.statuses, statusSecretKey, allStatusDetails, printResult);
    }

})

//---------- Loading status history dynamically----------------

const statusDates = [...new Set(statusDetails.map((e)=>e.date))]
const sortedstatusDates = statusDates.sort((a,b) => a < b ? 1 : -1);
const currentDateDetails = {}

sortedstatusDates.forEach((e)=>{
    currentDateDetails[e] = statusDetails.filter((d)=> d.date == e)
})

let i = 0 ;  
for(const details in currentDateDetails){
    const statusContainer = document.querySelector(".status-container");
    statusContainer.innerHTML +=
    `<div class="status-card">   
        <div class="dates-section">
            <p><span class="date">${ details }</span></p>
        </div>
        <div class="details-section">
        </div>
    </div>`;
 
    for(const resources of currentDateDetails[details]){
        document.querySelectorAll('.details-section')[i].innerHTML += 
        `<div class="details-content">
            <p><span class="details" id="serialnumber">1</span></p>
            <p>Name: <span class="details" id="name">${resources.resourceName}</span></p>
            <P>Activity:  <span class="details" id="activity">${resources.activityType}</span></P>
            <p>Hours:  <span class="details" id="hours">${resources.workHours}</span></p>
        </div>` 
        
    }
    i++
}


