// Globally accessible variable to store whether function should add a new resource or update an existing resource.
let addResourceFunctionality = true;


// Create resource 
const createResourceObject = (name, role, email, billable, rate, billableStatus) => {
    const resourceDetails = {
        name: name,
        role: role,
        email: email,
        project_id:selectedProjectId,
        billable: billable,
        ratePerHour: billableStatus.checked ? Number(rate) : Number(0)
    }
    return resourceDetails
}

// Function to add or update resource.
function addOrUpdateObject (resourceDetails) {
    // if (!resources[selectedProjectId]) {
    //     resources[selectedProjectId] = [];
    // }
    if (addResourceFunctionality) {
        // Add new resource.
        postApi("http://localhost:8080/resources/allocate", resourceDetails, printResult);
        let resId = resources[resources.length-1].id+1;
        const gResourceDetails= {id:resId,...resourceDetails}
        resources.push(gResourceDetails);
        console.log(resources);
        
    } else {
        console.log("in else");
        // Update already existing resource.
        putApi("http://localhost:8080/resources/"+ `${selectedResource}`, resourceDetails, printDeletedResult)
        // resources[selectedProjectId][selectedResource] = resourceDetails;
        resources = resources.filter(e => !(e.project_id == selectedProjectId && e.id == selectedResource));
 
        const gResourceDetails= {id:Number(selectedResource),...resourceDetails}
        resources.push(gResourceDetails);
    
        // console.log(resources);
    }
} 

// Function call to update changes to remote storage bin.
function sendFormData (resourceDetails) {
   
    // put(urlList.resources, secretKey, resources, printResult);
    loadResources();
    resourceFormModal.style.display = "none";
    formsContainer.style.display = "none";
}

function addOrUpdateResource(e) {
    
    e.preventDefault()
    const nameStatus = resourceName.value.length != 0 && RegExp.prototype.isAlpha(resourceName.value) ? true : false,
    emailStatus = email.value.length > 0 && emailPatternCheck(email.value) ? true : false
    roleStatus = role.value.length != 0 && RegExp.prototype.isAlpha(role.value) ? true : false,
    rateStatus = rate.value != "" && billableStatus.checked ? true : false;
    var billables;
    let resourceDetails;

    if (nameStatus && emailStatus && roleStatus) {
        if (billableStatus.checked) { // Billable true
            if (rateStatus) {
                billables = 1;
                resourceDetails = createResourceObject(resourceName.value, role.value, email.value, billables, rate.value,billableStatus)
                addOrUpdateObject(resourceDetails)
                sendFormData(resourceDetails)
            }
            // Rate field empty error
            else {errorMessages(rate, "#rate-error", "Enter a valid amount")}
        } // billable false
        else { 
            billables =0;
            resourceDetails = createResourceObject(resourceName.value, role.value, email.value, billables, 0, billableStatus)
            addOrUpdateObject(resourceDetails)
            sendFormData(resourceDetails);
        }
    
        console.log("Data stored/updated")
        

    } // Name or email or role empty OR contains characters other than alphabets and spaces
    else {
        if (!nameStatus) resourceName.value.length == 0 ? errorMessages(resourceName, "#name-error", "This field cannot be empty") : (RegExp.prototype.isAlpha(resourceName.value) ? _ : errorMessages(resourceName, "#name-error", "Only alphabets and spaces are allowed"))
        if (!emailStatus)email.value.length == 0 ? errorMessages(email, "#email-error", "This field cannot be empty") : (emailPatternCheck(email.value) ? _ : errorMessages(email, "#email-error", "Invalid email address"))
        if (!roleStatus)role.value.length == 0 ? errorMessages(role, "#role-error", "This field cannot be empty") : (RegExp.prototype.isAlpha(role.value) ? _ : errorMessages(role, "#role-error", "Only alphabets and spaces are allowed"))
    }
    resetInvoiceTab();
}

// Store in variables HTML tags that trigger add/edit/delete resource functionalities.
// Checking billable checkbox will display ratePerHour input field. 
const addResource = document.getElementById("add-resource-icon");

// Add resource event listener.
// Its callback function displays add resource form.
addResource.addEventListener('click', _ => {

    clearErrorMessages();
    document.querySelector('#resource-form').reset();
    
    // Display add resource form.
    formsContainer.style.display = "flex";
    document.getElementById("modal-content-project").style.display = "none";
    document.getElementById("modal-content--resource").style.display = "block";
    document.getElementById("modal-content--delete-resource").style.display = "none";

    //Set form title text and form submit button text.
    document.querySelector('#resource-form--title').innerText = 'Add Resource';
    document.querySelector('#resource-submit--button').value = 'Add Resource';

    const resourceName = document.querySelector('#name'), emailId = document.querySelector('#email');
    
    document.querySelector('#rate-label').style.display = billableStatus.checked ? 'flex' : 'none';

    resourceName.readOnly = false;
    emailId.readOnly = false;
});


// Globally accessible variable to store currently selected resource for updation or deletion.
let selectedResource;

function displayEditResourceForm(e) {
    e.preventDefault()
    selectedResource = e.currentTarget.dataset.editresourceid;

    formsContainer.style.display = "flex";
    document.getElementById("modal-content-project").style.display = "none";
    document.getElementById("modal-content--resource").style.display = "block";
    document.getElementById("modal-content--delete-resource").style.display = "none";

    document.querySelector('#resource-form--title').innerText = 'Update Resource';
    document.querySelector('#resource-submit--button').value = 'Update Resource';

    addResourceFunctionality = false;

    clearErrorMessages();

    resourceList = resources.filter(e => e.project_id == selectedProjectId);
    console.log(resourceList);
    const resource = resourceList.find(e => e.id == selectedResource);
    console.log(resource)
    resourceName.value = resource.name;
    email.value = resource.email;
    role.value = resource.role;
    billableStatus.checked = resource.billable;

    document.querySelector('#rate-label').style.display = billableStatus.checked ? 'flex' : 'none';
    rate.value = resource.ratePerHour;

    resourceName.readOnly = true;
    email.readOnly = true;
}

function clearErrorMessages () {
    const resourceNameError = document.querySelector('#name-error'),
    emailIdError = document.querySelector('#email-error'),
    resourceRoleError = document.querySelector('#role-error'),
    ratePerHourError = document.querySelector('#rate-error');
    const resourceName = document.getElementById("name"), 
        email = document.getElementById("email"),
        role = document.getElementById("role"), 
        billableStatus = document.getElementById("billable"), 
        rate = document.getElementById("rate")

    resourceName.innerText = '';
    email.innerText = '';
    role.innerText = '';
    rate.innerText = '';

    resourceNameError.innerText = '';
    emailIdError.innerText = '';
    resourceRoleError.innerText = '';
    ratePerHourError.innerText = '';

    resourceName.style.border = 'none';
    email.style.border = 'none';
    role.style.border = 'none';
    rate.style.border = 'none';
}

const cancelResource = document.getElementById("cancel-resource");
cancelResource.addEventListener('click', _ => {formsContainer.style.display = "none"; document.getElementById("rate-label").style.display = "none"; addResourceFunctionality = true; });

const submitResourceForm = document.querySelector('#resource-submit--button');
submitResourceForm.addEventListener('click', addOrUpdateResource);

// Function displays delete resource modal.
function displayDeleteResourceModal(e) {
    selectedResource = e.currentTarget.dataset.deleteresourceid;
    formsContainer.style.display = "flex";
    document.getElementById("modal-content-project").style.display = "none";
    document.getElementById("modal-content--resource").style.display = "none";
    document.getElementById("modal-content--delete-resource").style.display = "block";
}

// Event listener for delete resource modal's cancel button.
const cancelDeleteResource = document.getElementById("cancel-delete-resource");
cancelDeleteResource.onclick = () => formsContainer.style.display = "none";

const deleteResourceButton = document.querySelector('#delete-resource');
deleteResourceButton.addEventListener('click', function (e) {
    e.preventDefault()
    // resources[selectedProjectId].splice(selectedResource, 1);
    
    resourceFormModal.style.display = "none";
    formsContainer.style.display = "none";
    console.log(selectedResource);
    // Function call to update changes to remote storage bin.
    // put(urlList.resources, secretKey, resources, printResult);
    deleteApi("http://localhost:8080/resources/" + `${selectedResource}`, {"project_id": selectedProjectId}, printDeletedResult);
    loadResources();
    resetInvoiceTab();
});

// Billable status
const billable = document.getElementById("billable");
billable.addEventListener('click', _ => {
    const status = billable.checked
    if (status) document.getElementById("rate-label").style.display = "flex"
    else document.getElementById("rate-label").style.display = "none"
});