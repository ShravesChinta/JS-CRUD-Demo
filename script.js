document.addEventListener("DOMContentLoaded",()=>{
    const url="https://jsonplaceholder.typicode.com/users";

    fetchData(url)
    .then((response)=>{
        displayData(response);
        console.log("Displaying data");
    })
    .catch((error)=>{
        displayError(error);
        console.log("Displaying error");
    })

    document.addEventListener("submit",(e)=>{
        e.preventDefault();
        const name=document.getElementById("name");
        const username=document.getElementById("username");
        const email=document.getElementById("email");
        if((name.value.trim()!=='') && (username.value.trim()!=='') && (email.value.trim()!==''))
            {
                createItem(name.value, username.value, email.value, url)
                .then((response)=>{
                    console.log("Data Added");
                    console.log(response);
                })
                .catch((error)=>{
                    console.log(error.message);
                })
                setFormValuesEmpty(name, username, email);
            }
    });

});

function setFormValuesEmpty(name, username, email)
{
    name.value="";
    username.value="";
    email.value="";
}

async function createItem(name, username, email, url)
{
    try{
        const response = await fetch( url, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({name, username, email})
        });
        if(!response.ok)
            {
                throw new Error("Could'nt add the data");
            }
        const data = await response.json();
        return data;
    }
    catch(error)
    {
     return error;
    }

}

async function fetchData(url)
{
    try{
    const response=await fetch(url);
    if(!response.ok)
        {
            throw new Error("Error in fetching data");
        }

    const data=await response.json();
    return data;
    }
    catch(error)
    {
        return error;
    }
}

function displayData(data)
{
    const list=document.getElementById("crudList");
    list.innerHTML="<ul></ul>";
    data.forEach((x)=>{
        const new_ele=document.createElement("li");
        new_ele.textContent=x.name;
        new_ele.dataset.id=x.id;

        const editButton=document.createElement("button");
        editButton.textContent='Edit';
        editButton.classList.add("edit-button");
        editButton.addEventListener("click",()=>{
            editItem(new_ele)
            .then((response)=>{
                alert("Name Modified to " + response.name);
                console.log(response);
            })
            .catch((error)=>{
              console.log(error.message);  
            })
        });

        const deleteButton=document.createElement("button");
        deleteButton.textContent='Delete';
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click",()=>{
            deleteItem(new_ele)
            .then((response)=>{
                alert("Item Deleted ");
                console.log(response);
            })
            .catch((error)=>{
              console.log(error.message);  
            })
        
        });

        new_ele.appendChild(editButton);
        new_ele.appendChild(deleteButton); 
        list.appendChild(new_ele);


    });
}

async function editItem(new_ele){
    const id = new_ele.dataset.id;
    const newName=prompt("Enter New Name");

    if(newName!==null && newName.trim()!=='')
        {
        const new_url="https://jsonplaceholder.typicode.com/users/"+id;
        try{
            const response = await fetch(new_url, {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({name:newName})
            })

            if(!response.ok)
                {
                    throw new Error("Data could not be updated");
                }
            const data=await response.json();
            return data;
        }
        catch(error)
        {
            return error;

        }
    }

}

async function deleteItem(new_ele){
    const id = new_ele.dataset.id;
    console.log(id);
    const new_url="https://jsonplaceholder.typicode.com/users/"+id;
try{
const response = await fetch(new_url, 
    {
        method:'DELETE'
    }
)
if(!response.ok)
    {
        throw new Error("Could Not Delete");
    }
    const data= await response.json();
    return data;
}
catch(error){
return error;
}
}

function displayError(error)
{
    const list=document.getElementById("crudList");
    list.innerHTML=`<h2><strong>${error.message}</strong></h2>`;
}