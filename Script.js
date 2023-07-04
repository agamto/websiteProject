let categories = new Set(); //hashset to save  the cattegories
const importanceRunking = {"גבוהה":3,"בינונית":2,"נמוכה":1};
let yesOrNo = false;
let draggedRow = null;
let isDragging = false;
let initialOffsetX = 0;
let initialOffsetY = 0;
let animationElement = null;
let theadHeight = 0;
let current_table = null;
function close_add_cattegories_form()
{
  document.getElementById('add_cattegory_form').style.display = "none";
}
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
    const cattegories_data_str = JSON.parse(cattegories_data);
    const keys = Object.keys(cattegories_data_str);
    keys.forEach(key =>
      {
          categories.add(key);
          add_category_to_list(key);
          add_row_to_cattegories_table(key);
      });
      updateFromSave();
  }
}
//updates the tables from saved data
function updateFromSave()
{
  clear_Table(document.getElementById("mission-list"));
  clear_Table(document.getElementById("completed-mission-list"));
  const Save_File_Path = "SaveForm.json";
  const Save_data = localStorage.getItem(Save_File_Path);
  const Save_data_str = JSON.parse(Save_data);
  const keys_for_Save = Object.keys(Save_data_str);
  keys_for_Save.forEach(key =>
    {
      add_from_save(Save_data_str[key],key);
    });
    
}
function add_row_to_cattegories_table(value)
{
var tbody = document.getElementById('category-table-body-id');
let new_row = tbody.insertRow(-1);

let buttonCell = new_row.insertCell(0);
let button = document.createElement("button");
button.id = value;
button.textContent = "-";
button.addEventListener("click",deleteCattegory);
buttonCell.appendChild(button);
let textCell = new_row.insertCell(1);
textCell.id = value;
textCell.addEventListener("click",create_table_of_filtered_users);
let textContent = document.createTextNode(value);
textCell.appendChild(textContent);

}
//create  a table of filtered users
function create_table_of_filtered_users()
{
    let list_Of_Rows_Indexes = [];
    let list_Of_Rows_Indexes_for_not_done = [];
    var UnfillteredMissionTable = document.getElementById('mission-list');
    var UnfillteredMissionTable_For_Not_Done = document.getElementById('completed-mission-list');
    let  i;
    for(i =3; i < UnfillteredMissionTable.childNodes.length;i++)
    {
      if(UnfillteredMissionTable.childNodes[i].childNodes[4].textContent === this.id)
      {
        list_Of_Rows_Indexes.push(i);
      }
    }
    for(i = 3; i <UnfillteredMissionTable_For_Not_Done.childNodes.length;i++)
    {
      if(UnfillteredMissionTable_For_Not_Done.childNodes[i].childNodes[4].textContent === this.id)
      {
        list_Of_Rows_Indexes_for_not_done.push(i);
      }
    }
    if(list_Of_Rows_Indexes.length === 0 && list_Of_Rows_Indexes_for_not_done.length === 0)
    {
      alert("אין משימות בקטגוריה זו");
      return;
    }
    var filtered_Mission_Table = document.getElementById('filtered-mission-table');
    document.getElementById("filltered-mission-table-container").style.display ="inline-block";
    clear_Table(filtered_Mission_Table);
    for(i = 0; i <list_Of_Rows_Indexes.length;i++)
    {
      filtered_Mission_Table.appendChild(UnfillteredMissionTable.childNodes[list_Of_Rows_Indexes[i]].cloneNode(true));
      filtered_Mission_Table.childNodes[i+3].childNodes[5].childNodes[0].addEventListener("click",editRow);
      filtered_Mission_Table.childNodes[i+3].childNodes[5].childNodes[1].addEventListener("click",moove_to_done);
      filtered_Mission_Table.childNodes[i+3].childNodes[5].childNodes[2].addEventListener("click",deleteRow);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mousedown', onMouseDown);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mousemove', onMouseMove);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mouseup', onMouseUp);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchmove', onTouchMove);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchend', onTouchEnd);
      filtered_Mission_Table.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchstart',onTouchStart);
    }
    var filtered_Mission_Table_not_done = document.getElementById('filtered-mission-table-not-done');
    clear_Table(filtered_Mission_Table_not_done);
    for(i = 0; i <list_Of_Rows_Indexes_for_not_done.length;i++)
    {
      filtered_Mission_Table_not_done.appendChild(UnfillteredMissionTable_For_Not_Done.childNodes[list_Of_Rows_Indexes_for_not_done[i]].cloneNode(true));
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[5].childNodes[0].addEventListener("click",editRow);
      if(filtered_Mission_Table_not_done.childNodes[i+3].childNodes[5].childNodes[1].textContent === "החזר למשימות")
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[5].childNodes[1].addEventListener("click",moove_to_not_done);
      else
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[5].childNodes[1].addEventListener("click",moove_to_done);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[5].childNodes[2].addEventListener("click",deleteRow);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mousedown', onMouseDown);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mousemove', onMouseMove);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('mouseup', onMouseUp);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchmove', onTouchMove);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchend', onTouchEnd);
      filtered_Mission_Table_not_done.childNodes[i+3].childNodes[6].childNodes[0].addEventListener('touchstart',onTouchStart);
    }

}
//clear the table from nodes
function clear_Table(table)
{
  while(table.rows.length > 0)
  {
    table.deleteRow(0);
  }

}
//add from save
function add_from_save(value,key) {
  
  let table;
  let completed_flag = false;
  if(value["completed"] === false)
  {
    table = document.getElementById("mission-list");
  }
  else
  {
    table = document.getElementById("completed-mission-list");
    completed_flag = true;
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
      deleteButton.id = key;
      editButton.id = key;
      doneButton.id = key;
      deleteButton.addEventListener("click",deleteRow);
      doneButton.addEventListener("click",moove_to_done);
      editButton.addEventListener("click",editRow);
      if(completed_flag)
      {
        doneButton.textContent = "החזר למשימות";
        doneButton.addEventListener("click",moove_to_not_done);
      }
      newCell.appendChild(editButton);
      newCell.appendChild(doneButton);
      newCell.appendChild(deleteButton);

      let MooveRowCell = newRow.insertCell(6);
      let mooveRowButton = document.createElement("button");
      mooveRowButton.addEventListener('mousedown', onMouseDown);
      mooveRowButton.addEventListener('mousemove', onMouseMove);
      mooveRowButton.addEventListener('mouseup', onMouseUp);
      mooveRowButton.addEventListener('touchmove', onTouchMove);
      mooveRowButton.addEventListener('touchend', onTouchEnd);
      mooveRowButton.addEventListener('touchstart',onTouchStart);
      mooveRowButton.textContent="≡";
      mooveRowButton.classList.add("dragButton");
      MooveRowCell.appendChild(mooveRowButton);

}
//reset Tables
function resetTableBody() {
  
  const FormData = localStorage.getItem("SaveForm.json");
  const Jason_data = JSON.parse(FormData);
  let keys = Object.keys(Jason_data);
  for(i =0; i <keys.length;i++)
  { 
      if(Jason_data[keys[i]]["completed"] === true)
      {
        delete Jason_data[keys[i]];
      }
  }
  localStorage.setItem("SaveForm.json",JSON.stringify(Jason_data));
  updateFromSave();
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
    Jason_data[Object.keys(Jason_data).length] = data;
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
    newRow.classList.add('draggable-row');
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
      deleteButton.id = Object.keys(Jason_data).length;
      editButton.id = Object.keys(Jason_data).length;
      doneButton.id = Object.keys(Jason_data).length;
      deleteButton.addEventListener("click",deleteRow);
      doneButton.addEventListener("click",moove_to_done);
      editButton.addEventListener("click",editRow);
      newCell.appendChild(editButton);
      newCell.appendChild(doneButton);
      newCell.appendChild(deleteButton);
      let MooveRowCell = newRow.insertCell(6);
      let mooveRowButton = document.createElement("button");
      mooveRowButton.addEventListener('mousedown', onMouseDown);
      mooveRowButton.addEventListener('mousemove', onMouseMove);
      mooveRowButton.addEventListener('mouseup', onMouseUp);
      mooveRowButton.textContent="≡";
      mooveRowButton.classList.add("dragButton");
      MooveRowCell.appendChild(mooveRowButton);
      const  Btext = document.getElementById('create-mission-btn');
      Btext.textContent =  "צור משימה חדשה";
      var formSend = document.getElementById('mission-form-container');
      formSend.style.display = 'none';    
      document.getElementById('mission-form').reset();
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
    alert("צריך לבחור בין:גבוהה,נמוכה,בינונית");
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
  updateFromSave();

}
// make the rows editable
function editRow(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let i;
  for(i= 0; i < current_row.childNodes.length-2;i++)
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
//creating a promise for the yes button
function waitForButtonClick()
{
  return new Promise(function(resolve) {
    var button = document.getElementById("Yes_button");

    function functionTrue()
    {
    yesOrNo = true;
    hideAlert();
    resolve();
    }

    button.addEventListener("click", functionTrue);
  });
}
//creating a promise for the no button
function waitForButtonClickNo()
{
  return new Promise(function(resolve) {
    var button = document.getElementById("No_button");

    function functionTrue()
    {
    yesOrNo = false;
    hideAlert();
    resolve();
    }

    button.addEventListener("click", functionTrue);
  });
}
//start the critical race beetween button1 and button2
 function initiate_race()
{
  return Promise.race([waitForButtonClickNo(), waitForButtonClick()]);
}
// checks if a cattegory is exist in the current save file
async function find_Cattegory(cattegory)
{
  let allData = [];
  let localget = localStorage.getItem("SaveForm.json");
  var local_text_json = JSON.parse(localget);
  let keys = Object.keys(local_text_json);
  let flag = false;
  let  i;
  for(i =0 ;i  <keys.length;i++)
  {
    if(local_text_json[keys[i]]["missionCategory"]  === cattegory)
    {
      flag = true;
      break;
    }
  }
  if(flag)
  {
    showAlert();
    try {
      const clickedButton = await initiate_race();
    } catch (error) {
      console.error("Error:", error);
    }
    if(yesOrNo)
    {
      
      for(i =0 ;i  <keys.length;i++)
    {
    if(local_text_json[keys[i]]["missionCategory"]  === cattegory)
      {
        local_text_json[keys[i]]["missionCategory"] = "";
        break;
      }
    }
    }
  }
  localStorage.setItem("SaveForm.json",JSON.stringify(local_text_json));
  updateFromSave();
  return flag;
  
}
//starting an async function to find a cattegory and deploy an alart box if cattegory exist
function startProcess(cattegory)
{
  return find_Cattegory(cattegory);
}
//delete the current cattegory
async function deleteCattegory(event)
{
  let  needToRemove = event.target.id;
  if(await startProcess(needToRemove)&&!yesOrNo)
  {return;}

  let localget = localStorage.getItem("categories.json");
  var local_text_json = JSON.parse(localget);
  let keys = Object.keys(local_text_json);
  for(let  i =0 ;i  <keys.length;i++)
  {
    
    if(local_text_json[keys[i]] === needToRemove)
    {
      delete local_text_json[keys[i]];
    }
  }
  localStorage.setItem("categories.json",JSON.stringify(local_text_json));
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let table_to_delete = document.getElementById(event.target.id).parentNode.parentNode.parentNode;
  table_to_delete.removeChild(current_row);
  categories.delete(needToRemove);
  var cattegoryList = document.getElementById('mission-category');
  for(let i = 0; i < cattegoryList.childNodes.length;i++)
  {
    if(cattegoryList.childNodes[i].textContent === needToRemove)
      cattegoryList.removeChild(cattegoryList.childNodes[i]);
  }
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
    updateFromSave();

}
//moove back to not done pile
function moove_to_not_done(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let dest_table = document.getElementById("mission-list");  
  if(current_row.parentNode.id === "filtered-mission-table-not-done")
  {
    let fillteredDoneTable = document.getElementById("filtered-mission-table");
      fillteredDoneTable.appendChild(current_row.cloneNode(true));
      let buttonCell = fillteredDoneTable.childNodes[fillteredDoneTable.childNodes.length-1].childNodes[5];
      buttonCell.childNodes[0].addEventListener("click",editRow);
      buttonCell.childNodes[1].textContent = "הושלם";
      buttonCell.childNodes[1].addEventListener("click",moove_to_done);
      buttonCell.childNodes[2].addEventListener("click",deleteRow);
  }
  dest_table.appendChild(current_row);
  let jsonOfSave = localStorage.getItem("SaveForm.json");
  let jason_data = JSON.parse(jsonOfSave);
  jason_data[parseInt(event.target.id)]["completed"] = false;
  let updatedJsonData = JSON.stringify(jason_data);
  localStorage.setItem("SaveForm.json",updatedJsonData);
  updateFromSave();
}
//moove the row to the  done pile
function moove_to_done(event)
{
  let current_row = document.getElementById(event.target.id).parentNode.parentNode;
  let dest_table = document.getElementById("completed-mission-list");
  if(current_row.parentNode.id === "filtered-mission-table")
  {
    let fillteredDoneTable = document.getElementById("filtered-mission-table-not-done");
      fillteredDoneTable.appendChild(current_row.cloneNode(true));
      let buttonCell = fillteredDoneTable.childNodes[fillteredDoneTable.childNodes.length-1].childNodes[5];
      buttonCell.childNodes[0].addEventListener("click",editRow);
      buttonCell.childNodes[1].textContent = "החזר למשימות";
      buttonCell.childNodes[1].addEventListener("click",moove_to_not_done);
      buttonCell.childNodes[2].addEventListener("click",deleteRow);
  }
  dest_table.appendChild(current_row);
  let jsonOfSave = localStorage.getItem("SaveForm.json");
  
  let jason_data = JSON.parse(jsonOfSave);
  jason_data[parseInt(event.target.id)]["completed"] = true;
  let updatedJsonData = JSON.stringify(jason_data);
  localStorage.setItem("SaveForm.json",updatedJsonData);
  updateFromSave();
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
  if(document.getElementById('open_cattegories_button').textContent !== "צור קטגוריה")
  {
    open_cattegories_form();
  }
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
    add_row_to_cattegories_table(cattegoryText);
    close_add_cattegories_form();
  }
  else if(cattegoryText === '')
  {
    alert("אי אפשר לשים קטגוריה ריקה");
  }
  else
  {
    alert("כבר קיימת קטגוריה זו");
  }
}
//open create cattegory form
function open_cattegories_form()
{
  if(document.getElementById('create-mission-btn').textContent !== "צור משימה חדשה")
  {
    OpenAndCloseForm();
  }
  var button = document.getElementById('open_cattegories_button');
  console.button
  if(button.textContent === "צור קטגוריה")
  {
  document.getElementById('category-form-container').style.display ="inline-block";
  button.textContent = "סגור טופס";
  close_add_cattegories_form();

  }
  else
  {
  document.getElementById('category-form-container').style.display ="none";
  button.textContent = "צור קטגוריה";
  close_add_cattegories_form();

  }
  

}

//close create cattegory form
function open_create_categories()
{
  document.getElementById('add_cattegory_form').style.display = "inline-block";
}
//closing filltered mission table
function close_filltered_table()
{
  var filtered_Mission_Table = document.getElementById('filtered-mission-table');
  document.getElementById("filltered-mission-table-container").style.display ="none";
  clear_Table(filtered_Mission_Table);
  clear_Table(document.getElementById('filtered-mission-table-not-done'));
}
// Display the custom alert box
function showAlert() {
  var customAlert = document.getElementById("custom-alert");
  customAlert.style.display = "block";

}
// Hide the custom alert box and re-enable interactions
function hideAlert() {
  var customAlert = document.getElementById("custom-alert");
  customAlert.style.display = "none";

}
//returns the false for a callback
function functionFalse()
{
    yesOrNo  = false;
    hideAlert();
}
//activatate the drag start on the tr
function onMouseDown(event) {
  if (event.target.classList.contains('dragButton')) {
    event.preventDefault();

    startDragging(event.clientX, event.clientY);
  }
}
//touch start moove
function onTouchStart(event) {
  if (event.target.classList.contains('dragButton') && event.touches.length === 1) {
    event.preventDefault();

    const touch = event.touches[0];
    startDragging(touch.clientX, touch.clientY);
  }
}
//the start dragging state
function startDragging(clientX, clientY) {
  draggedRow = event.target.closest('tr');
  isDragging = true;
  current_table = draggedRow.closest('table');

  const tableBoundingRect = draggedRow.closest('table').getBoundingClientRect();
  initialOffsetX = clientX - tableBoundingRect.left - draggedRow.offsetLeft;
  initialOffsetY = clientY - tableBoundingRect.top - draggedRow.offsetTop;

  const thead = draggedRow.closest('table').querySelector('thead');
  theadHeight = thead ? thead.offsetHeight : 0;

  animationElement = document.createElement('div');
  animationElement.className = 'animationElement';
  document.body.appendChild(animationElement);

  draggedRow.style.transition = 'none';
  draggedRow.style.zIndex = '9999';

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchmove', preventScrolling, { passive: false });
}
//while the drag function is being used
function onMouseMove(event) {
  if (isDragging ) {
    try
    {
    event.preventDefault();

    const mouseX = event.clientX - initialOffsetX;
    const mouseY = event.clientY - initialOffsetY;
    const tbodyHeight = draggedRow.closest('tbody').offsetHeight;
    const maxAllowedY = tbodyHeight - draggedRow.offsetHeight;
    animationElement.style.transform = `translate(${mouseX}px, ${Math.max(theadHeight, Math.min(mouseY, maxAllowedY))}px)`;
    
    handleDrop(event.clientX, event.clientY);
    }
    catch(err)
    {}
  }
}
//while droping the tr
function onMouseUp(event) {
  if (isDragging) {
    event.preventDefault();

    document.body.removeChild(animationElement);
    animationElement = null;

    draggedRow.style.left = '';
    draggedRow.style.top = '';
    draggedRow.style.transition = '';
    draggedRow.style.zIndex = '';
    draggedRow.classList.remove("draggedRow");

    resetDragState();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchmove',preventScrolling);
  }
}
//hendle the drop on change
function handleDrop(clientX, clientY) {
  try
  {
  const dropTarget = document.elementFromPoint(clientX, clientY).closest('tr');
  const tbody = current_table.querySelector('tbody');
  if (dropTarget && dropTarget !== draggedRow && tbody === dropTarget.closest('tbody')) {
    const newRowIndex = Array.from(dropTarget.parentNode.children).indexOf(dropTarget);
    const draggedRowIndex = Array.from(draggedRow.parentNode.children).indexOf(draggedRow);
    if (newRowIndex > draggedRowIndex) {
      dropTarget.parentNode.insertBefore(draggedRow, dropTarget.nextElementSibling);
    } else {
      dropTarget.parentNode.insertBefore(draggedRow, dropTarget);
    }
  }
  }
  catch(err)
  {
    
  }
}
//while you move in the touch phase
function onTouchMove(event) {
  if (isDragging && event.touches.length === 1) {
    event.preventDefault();

    const touch = event.touches[0];
    const touchX = touch.clientX - initialOffsetX;
    const touchY = touch.clientY - initialOffsetY;
    const tbodyHeight = draggedRow.closest('tbody').offsetHeight;
    const maxAllowedY = tbodyHeight - draggedRow.offsetHeight;
    animationElement.style.transform = `translate(${touchX}px, ${Math.max(theadHeight, Math.min(touchY, maxAllowedY))}px)`;
    
    handleDrop(touch.clientX, touch.clientY);
  }
}
//touch ending function
function onTouchEnd(event) {
  if (isDragging && event.touches.length === 0) {
    event.preventDefault();
    resetDragState();
  }
}
//reset the table to base status
function resetDragState() {
  draggedRow = null;
  isDragging = false;
}
//function that preventscrolling while dragging
function preventScrolling(event) {
  if (isDragging) {
    event.preventDefault();
  }
}
//function that will occur on scrolling showing the top button
function onScrolling()
{
  if(document.body.scrollTop >20 ||document.documentElement.scrollTop > 20)
  {
    document.getElementById("back_to_top_button").style.display = "block";
  }
  else
  {
    document.getElementById("back_to_top_button").style.display = "none";
  }
}
//returns to the top of the page
function toTop()
{
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
//creates the listeners
function addListeners()
{
    window.onscroll = function() {onScrolling()};
    document.getElementById("back_to_top_button").addEventListener("click",toTop);
    document.getElementById('close_filtered_mission_table').addEventListener("click",close_filltered_table);
    document.getElementById('close-cattegory-form').addEventListener("click",close_add_cattegories_form);
    document.getElementById('open_cattegories_button').addEventListener("click",open_cattegories_form);
    document.getElementById('open-add-pop-up').addEventListener("click",open_create_categories);
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