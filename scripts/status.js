const today = new Date();
const dateToday = Number(String(today.getDate()).padStart(2, '0'))
let ddlimit = Number(String(today.getDate()).padStart(2, '0')) - 7;
let mm = Number(String(today.getMonth() + 1).padStart(2, '0')); //January is 0
let yyyy = Number(today.getFullYear());
let dateList = []

while(ddlimit <= dateToday){
	const currentDate = ddlimit + '/' + mm + '/' + yyyy;
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

const statusResourceOptions = document.querySelector('#resource-list')
for(const list of uniqueResources){
    statusResourceOptions.innerHTML += `<option>${list}</option>`
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
        console.log(allStatusDetails)
        put(urlList.statuses, statusSecretKey, allStatusDetails, printResult);
    }

})
