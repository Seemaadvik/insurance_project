// ================================
// BASE API URL
// ================================
const API = "http://127.0.0.1:5000";


// ================================
// LOAD ACCOUNTS INTO TABLE
// ================================
async function loadAccounts() {
    try {
        const res = await fetch(`${API}/accounts/`);
        const data = await res.json();

        let rows = "";

        data.forEach(acc => {
            rows += `
                <tr>
                    <td>${acc.id}</td>
                    <td>${acc.name}</td>
                    <td>${acc.policy_type}</td>
                    <td>${acc.premium}</td>
                    <td>
                        <button onclick="editAccount(${acc.id}, '${acc.name}', '${acc.policy_type}', ${acc.premium})">
                            Edit
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("tableData").innerHTML = rows;

    } catch (error) {
        console.error("Error loading accounts:", error);
        alert("Failed to load accounts.");
    }
}


// ================================
// CREATE ACCOUNT
// ================================
async function createAccount() {
    const name = document.getElementById("name").value;
    const policy_type = document.getElementById("policy").value;
    const premium = document.getElementById("premium").value;

    if (!name || !policy_type || !premium) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const res = await fetch(`${API}/accounts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                policy_type,
                premium: parseFloat(premium)
            })
        });

        if (!res.ok) throw new Error("Failed to create account");

        alert("Account Created Successfully ✅");

        document.getElementById("name").value = "";
        document.getElementById("policy").value = "";
        document.getElementById("premium").value = "";

        loadAccounts();

    } catch (error) {
        console.error("Error creating account:", error);
        alert("Error creating account.");
    }
}


// ================================
// UPDATE ACCOUNT
// ================================
async function editAccount(id, name, policy_type, premium) {

    const newName = prompt("Edit Name:", name);
    const newPolicy = prompt("Edit Policy Type:", policy_type);
    const newPremium = prompt("Edit Premium:", premium);

    if (!newName || !newPolicy || !newPremium) {
        alert("Update cancelled.");
        return;
    }

    try {
        const res = await fetch(`${API}/accounts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName,
                policy_type: newPolicy,
                premium: parseFloat(newPremium)
            })
        });

        if (!res.ok) throw new Error("Update failed");

        alert("Account Updated Successfully ✅");

        loadAccounts();

    } catch (error) {
        console.error("Error updating account:", error);
        alert("Error updating account.");
    }
}


// ================================
// SEARCH ACCOUNT BY ID (NEW FEATURE)
// ================================
async function searchAccount() {
    const id = document.getElementById("searchId").value;

    if (!id) {
        alert("Please enter Policy ID");
        return;
    }

    try {
        const res = await fetch(`${API}/accounts/${id}`);

        if (!res.ok) {
            document.getElementById("result").innerHTML = "❌ No record found";
            return;
        }

        const data = await res.json();

        document.getElementById("result").innerHTML = `
            <h4>Customer Details</h4>
            <p><b>ID:</b> ${data.id}</p>
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Policy:</b> ${data.policy_type}</p>
            <p><b>Premium:</b> ${data.premium}</p>
        `;

    } catch (error) {
        console.error("Search error:", error);
        alert("Error searching account.");
    }
}


// ================================
// AUTO LOAD TABLE ON PAGE LOAD
// ================================
window.onload = loadAccounts;