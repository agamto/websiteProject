let categories = new Set(); //hashset to save  the cattegories
const importanceRunking = {"High":3,"Medium":2,"Low":1};
//check if save file is exist and if not to create a save file
function create_file_if_not_exist()
{
  const categories_File_Path = "categories.json";
  const Save_File_Path = "SaveForm.json";
  if(!(localStorage.getItem(categories_File_Path) || localStorage.getItem(Save_File_Path)))
  {
    const data = {};
    const jsonData = JSON.stringify(data);
    localStorage.setItem(categories_File_Path, jsonData);
    localStorage.setItem(Save_File_Path, jsonData);
  }
  else
  {
    const cattegories_data = (localStorage.getItem(categories_File_Path));
    const Save_data = localStorage.getItem(Save_File_Path);
    const Save_data_str = JSON.parse(Save_data);
    const cattegories_data_str = JSON.parse(cattegories_data);
    const keys = Object.keys(cattegories_data_str);
    keys.forEach(key =>
      {
          categories.add(key);
          add_category_to_list(key);
      });
    const keys_for_Save = Object.keys(Save_data_str);
    keys_for_Save.forEach(key =>
      {
        add_from_save(Save_data_str[key]);
      });
  }
}
//add from save
function add_from_save(value) {
  let table;
  if(value["completed"] === false)
  {
    table = document.getElementById("mission-list");
  }
  else
  {
    table = document.getElementById("completed-mission-list");
  }
  let placeForInsert = 0;
  if(table.childNodes.length != 3)
    for(let index = 3;index < table.childNodes.length;index++)
    {
      const currentNode = table.childNodes[index];
      if(importanceRunking[currentNode.childNodes[2].textContent] < importanceRunking[value["imprtence"]])
      {
        placeForInsert = index-3;
        break;
      }
      placeForInsert = index-2;
    }
    let newRow = table.insertRow(placeForInsert);
    let  i;
    let keys = Object.keys(value);
    for(i = 0; i <keys.length-1;i++)
      {
        let newCell = newRow.insertCell(i);
        let newText = document.createTextNode(value[keys[i]]);
        newCell.appendChild(newText);
      }
      let newCell = newRow.insertCell(5);
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      let doneButton = document.createElement("button");
      deleteButton.textContent = "מחק";
      editButton.textContent = "עריכה";
      doneButton.textContent = "הושלם";
      deleteButton.id = value["name"];
      editButton.id = value["name"];
      doneButton.id = value["name"];
      deleteButton.addEventListener("click",deleteRow);
      doneButton.addEventListener("click",moove_to_done);
      editButton.addEventListener("click",editRow);
      newCell.appendChild(editButton);
      newCell.appendChild(doneButton);
      newCell.appendChild(deleteButton);

}
//reset Tables
function resetTableBody() {
  var tableBody = document.querySelector('tbody');
  let  completed_table = document.getElementById("completed-mission-list");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  while(completed_table.firstChild)
  {
    completed_table.removeChild(completed_table.firstChild);
  }
  localStorage.setItem("SaveForm.json",JSON.stringify({}))
}
//send a form to local data
function send_form(event)
{
  event.preventDefault();
  
  if(!( document.getElementById("mission-category").value === '' ||document.getElementById("mission-name").value === '' ))
  {
   const FormData = localStorage.getItem("SaveForm.json");
   const Jason_data = JSON.parse(FormData);
   let name= document.getElementById("mission-name").value;
   if(Jason_data.hasOwnProperty(name))
   {
    alert("task already exist in current file");
    return;
   }
   let imprtence= document.getElementById("mission-importance").value;
   let notes= document.getElementById("mission-notes").value;
   let missionCattegory= document.getElementById("mission-category").value;
   let date= formatDate();
    const data = 
    {
      name: name,
      date: date,
      importance: imprtence,
      notes: notes,
      missionCategory: missionCattegory,
      completed:false
    }

    Jason_data[document.getElementById("mission-name").value] = data;
    const keyValueArray = Object.entries(Jason_data);
    keyValueArray.sort((a, b) => importanceRunking[b[1].importance]-importanceRunking[a[1].importance] );
    const updatedJsonData = JSON.stringify(Object.fromEntries(keyValueArray));
    localStorage.setItem("SaveForm.json",updatedJsonData);
    let table = document.getElementById("mission-list");
    let placeForInsert = 0;
    try
    {
    if(table.childNodes.length != 3)
    for(let index = 3;index < table.childNodes.length;index++)
    {
      const currentNode = table.childNodes[index];
      if(importanceRunking[currentNode.childNodes[2].textContent] < importanceRunking[imprtence])
      {
        placeForInsert = index-3;
        break;
      }
      placeForInsert = index-2;
    }
    let newRow = table.insertRow(placeForInsert);
    let  i;
    let keys = Object.keys(data);
    for(i = 0; i <keys.length-1;i++)
      {
        let newCell = newRow.insertCell(i);
        let newText = document.createTextNode(data[keys[i]]);
        newCell.appendChild(newText);
      }
      let newCell = newRow.insertCell(5);
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      let doneButton = document.createElement("button");
      deleteButton.textContent = "מחק";
      editButton.textContent = "עריכה";
      doneButton.textContent = "הושלם";
      deleteButton.id = name;
      editButton.id = name;
      doneButton.id = name;
      deleteButton.addEventListener("click",deleteRow);
      doneButton.addEventListener("click",moove_to_done);
      editButton.addEventListener("click",editRow);
      newCell.appendChild(editButton);
      newCell.appendChild(doneButton);
      newCell.appendChild(deleteButton);
    }
    catch(err)
    {
      console.log(err);
    }
  }
  else
  {
    alert(" נא למלא את כל התאים");
  }
}
//Save the edit
function SaveEdit(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let id = current_row.childNodes[5].childNodes[0].id;
  while(true)
  {
  
  if(importanceRunking.hasOwnProperty(current_row.childNodes[2].textContent)&& categories.has(current_row.childNodes[4].textContent))
    {
    break;
    }
  else
    {
      if(!importanceRunking.hasOwnProperty(current_row.childNodes[2].textContent))
    alert("need to choose beetween: High,Medium,Low");
    else{
      alert("category not in list");
    }
    return;  
    }
  }
  let table = document.getElementById(event.target.id).parentNode.parentNode.parentNode;
  let placeForInsert = 0;
  let i;
  for(i= 0; i < current_row.childNodes.length;i++)
  {
    current_row.childNodes[i].removeAttribute("contenteditable");
  }
  let button = document.getElementById(event.target.id);
  document.getElementById(event.target.id).parentNode.removeChild(button);
  let curr_row_cpy = current_row.innerHTML;
  if(table.childNodes.length != 3)
  for(i = 3;i < table.childNodes.length;i++)
  {
    const currentNode = table.childNodes[i];
    if(importanceRunking[currentNode.childNodes[2].textContent] < importanceRunking[current_row.childNodes[2].textContent])
    {
      placeForInsert = i-3;
      break;
    }
    placeForInsert = i-2;
  }
  table.removeChild(current_row);
  var new_row = table.insertRow(placeForInsert-1);
  new_row.innerHTML = curr_row_cpy;
  new_row.childNodes[5].childNodes[0].addEventListener("click",editRow);
  new_row.childNodes[5].childNodes[1].addEventListener("click",moove_to_done);
  new_row.childNodes[5].childNodes[2].addEventListener("click",deleteRow);
  const FormData = localStorage.getItem("SaveForm.json");
  const Jason_data = JSON.parse(FormData);
  
  let keys = Object.keys(Jason_data[id]);
  for(i = 0; i<keys.length-1;i++)
  {
    let key = keys[i];
    Jason_data[id][key] = new_row.childNodes[i].textContent;
  }

  const updatedJsonData = JSON.stringify(Jason_data);
  localStorage.setItem("SaveForm.json",updatedJsonData);
}
// make the rows editable
function editRow(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let i;
  for(i= 0; i < current_row.childNodes.length-1;i++)
  {
    current_row.childNodes[i].setAttribute("contenteditable", "true");
  }
  document.getElementById(event.target.id).removeEventListener("click",editRow);
  let SaveButton  = document.createElement("button");
  SaveButton.textContent = "שמור";
  SaveButton.id = "saveId";
  SaveButton.addEventListener("click",SaveEdit)
  document.getElementById(event.target.id).parentNode.appendChild(SaveButton);
}
//delete the current row
function deleteRow(event)
{
    let current_row = document.getElementById(event.target.id).parentNode.parentNode;
    let table_to_delete = document.getElementById(event.target.id).parentNode.parentNode.parentNode;
    let needToRemove = current_row.childNodes[0].textContent;
    let localget = localStorage.getItem("SaveForm.json");
    var local_text_json = JSON.parse(localget);
    let keys = Object.keys(local_text_json);
    for(let  i =0 ;i  <keys.length;i++)
    {
      
      if(local_text_json[keys[i]]["name"] === needToRemove)
      {
        delete local_text_json[keys[i]];
      }
    }
    localStorage.setItem("SaveForm.json",JSON.stringify(local_text_json));
    table_to_delete.removeChild(current_row);
}
//moove the row to the  done pile
function moove_to_done(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let dest_table = document.getElementById("completed-mission-list");
  dest_table.appendChild(current_row);
  let jsonOfSave = localStorage.getItem("SaveForm.json");
  let jason_data = JSON.parse(jsonOfSave);
  jason_data[event.target.id]["completed"] = true;
  let updatedJsonData = JSON.stringify(jason_data);
  localStorage.setItem("SaveForm.json",updatedJsonData);
}
//add a category to list
function add_category_to_list(cattegory)
{
    let newOption = document.createElement('option');
    newOption.text= cattegory;
    document.getElementById('mission-category').add(newOption);
}
//format the date for save
function formatDate(dateTime) {
  const now = dateTime || new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ,${hour}:${minutes}`;
}
//open and close the form button function
function OpenAndCloseForm()
{
  const  Btext = document.getElementById('create-mission-btn').textContent;
  if(Btext === "צור משימה חדשה")
  {
    document.getElementById('mission-form').classList.toggle("form-show");
    document.getElementById("mission-form-container").style.display = "block";
    document.getElementById('create-mission-btn').textContent = "סגור את הטופס";
  }
  else
  {
    document.getElementById('mission-form').classList.toggle("form-show");
    document.getElementById("mission-form-container").style.display = "none";
    document.getElementById('create-mission-btn').textContent = 'צור משימה חדשה';
  }
  
}
// add a category function
function createCategory()
{
  const cattegoryText = document.getElementById('category-name').value;
  if(!categories.has(cattegoryText) && cattegoryText !== '')
  {
    categories.add(cattegoryText);
    add_category_to_list(cattegoryText);
    document.getElementById('category-name').value = '';
    const categoriesData = localStorage.getItem("categories.json");
    const data = JSON.parse(categoriesData);
    data[cattegoryText] = cattegoryText;
    const updatedJsonData = JSON.stringify(data);
    localStorage.setItem("categories.json",updatedJsonData);
  }
}
//creates the listeners
function addListeners()
{
    document.getElementById('create-mission-btn').addEventListener("click",OpenAndCloseForm);
    document.getElementById('createCattegoryButton').addEventListener("click",createCategory);
    document.getElementById('addMissionButton').addEventListener("click",send_form);
    document.getElementById('clear-missions-btn').addEventListener("click",resetTableBody);
}
// initialize the buttons and js file
function init() {
 create_file_if_not_exist();
 addListeners();
 
}

init();