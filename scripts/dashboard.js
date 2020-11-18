// Expand Menu Option: User name, Logout button
const navSlide = () => {
    const burger = document.querySelector(".hamburger");
    const nav = document.querySelector(".options");
    burger.addEventListener('click', _ => nav.classList.toggle('options-active'));
}

navSlide();

// Global variables to store data commonly accessed by multiple functions.
let projects;
let resources;

// Fetches all dashboard data.
const fetchDashboardData = () => {

    getApi("http://localhost:8080/projects", storeProjectData);
    getApi("http://localhost:8080/technologies", storeTechData);
    projects = { projectList: projectDetails, technologies: technologyNames };
    getApi("http://localhost:8080/resources", storeResourceData);

    loadDashboardData();
}

fetchDashboardData();

// Loads dashboard data.
function loadDashboardData() {
    const projectsCount = document.querySelector('#projects-count');
    projectsCount.innerText = totalProjects();
    const employeesCount = document.querySelector('#employees-count');
    employeesCount.innerText = totalDistinctResources();
    const billables = document.querySelector('#billables');
    const shadows = document.querySelector('#shadows');
    [billables.innerText, shadows.innerText] = totalBillableAndShadowResources();
    loadProjectsPerTechnology();
    projectTechnologyChart();
    resourceProjectChart();
}

// Returns total number of projects.
function totalProjects() {
    return projects.projectList.length;
}

// Returns total number of distinct resources.
function totalDistinctResources() {


    const distinctResourcesList = [...new Set( resources.map(item => item.id))];
    return distinctResourcesList.length;
}

// Returns total number of billables and shadows.
function totalBillableAndShadowResources() {

    let billableCount = resources.filter(item => item.project_id!=null && item.billable == 1);
    let shadowCount = resources.filter(item => item.project_id!=null && item.billable == 0);
    return [billableCount.length, shadowCount.length];
}

// Loads projects per technology list.
function loadProjectsPerTechnology() {
    const sortable = projectsPerTechnology();
    
    // Sort projects per technology in descending order
    const projectsPerTechnologyList = Object.entries(sortable)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const technologyProjectCount = document.querySelector('#technology-project-count');
    const technologyProjectCountArray = Object.values(projectsPerTechnologyList);
    for (let x in projectsPerTechnologyList) {
        const projectsPerTechnologyListCard = `<div class="technology display-flex row-align space-evenly">
        <span class="count">${projectsPerTechnologyList[x]}</span>
        <span class="technology__details display-flex column-align">
            <span class="technology-name">${x}</span>
            <span class="progress"></span>
        </span>
    </div>`;
        technologyProjectCount.innerHTML += projectsPerTechnologyListCard;
    }
    const totalProjects = projects.projectList.length;
    const progressBar = d3.selectAll('.progress')
        .data(technologyProjectCountArray);

    const animateDuration = 1000;
    const animateDelay = 100;

    progressBar.transition()
        .style('width', function (d) {
            return d / totalProjects * 100 + '%';
        })
        .duration(animateDuration)
        .delay(function (d, i) {
            return i * animateDelay;
        })
        .ease('elastic');
}

// Creates project vs. technology chart.
function projectTechnologyChart() {
    const technologyCount = projectsPerTechnology();
    const canvasId = document.querySelector('#project-vs-tech-chart').getContext('2d');
    const technologies = Object.keys(technologyCount);
    const projectsNumber = Object.values(technologyCount);
    const legendLabel = 'Projects';
    const graphBarColor = 'rgba(99, 203, 137, 0.4)';
    const graphBarBorderColor = 'rgb(99, 203, 137)';
    createChart(canvasId, technologies, legendLabel, projectsNumber, graphBarColor, graphBarBorderColor);
}

// Returns number of projects per technology.
function projectsPerTechnology() {
    const technologyCount = projects.technologies.reduce((acc, currVal) => (acc[currVal] = 0, acc), {});
    projects.projectList.forEach(project => {
        JSON.parse(project.technologies).forEach(tech => technologyCount[tech]++);
    });
    return technologyCount;
}

// Creates resource vs. project chart.
function resourceProjectChart() {
    const resourceCount = resourcesPerProject();
    const canvasId = document.querySelector('#resource-vs-project-chart')
    const projectNamesList = projects.projectList.map(project => project.projectName);
    const resourcesNumber = Object.values(resourceCount);
    const legendLabel = 'Resources';
    const graphBarColor = 'rgba(201, 203, 207, 0.4)';
    const graphBarBorderColor = 'rgb(201, 203, 207)';
    createChart(canvasId, projectNamesList, legendLabel, resourcesNumber, graphBarColor, graphBarBorderColor);
    
}

// Returns number of resources per project.
function resourcesPerProject() {

    let resourceCount={};
    const count =  projects.projectList.forEach(p => {
        resources.reduce((a,v) => (v.project_id == p.projectId ?resourceCount[v.project_id] = a+1 : a),0)
    });
    return resourceCount;
  
}