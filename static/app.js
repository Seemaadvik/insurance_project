const API = "https://insurance-project-h5ml.onrender.com";

// ================================
// LOAD ACCOUNTS
// ================================
async function loadAccounts() {
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
}


// ================================
// CREATE ACCOUNT
// ================================
async function createAccount() {
    await fetch(`${API}/accounts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            policy_type: document.getElementById("policy").value,
            premium: parseFloat(document.getElementById("premium").value)
        })
    });

    loadAccounts();
}


// ================================
// SEARCH ACCOUNT
// ================================
async function searchAccount() {
    const id = document.getElementById("searchId").value;

    const res = await fetch(`${API}/accounts/${id}`);

    if (!res.ok) {
        document.getElementById("result").innerHTML = "Not found ❌";
        return;
    }

    const data = await res.json();

    document.getElementById("result").innerHTML = `
        <p>ID: ${data.id}</p>
        <p>Name: ${data.name}</p>
        <p>Policy: ${data.policy_type}</p>
        <p>Premium: ${data.premium}</p>
    `;
}


// ================================
// EDIT ACCOUNT
// ================================
async function editAccount(id, name, policy, premium) {
    const newName = prompt("Name:", name);
    const newPolicy = prompt("Policy:", policy);
    const newPremium = prompt("Premium:", premium);

    await fetch(`${API}/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: newName,
            policy_type: newPolicy,
            premium: parseFloat(newPremium)
        })
    });

    loadAccounts();
}


// ================================
// REGISTER USER
// ================================
async function registerUser() {
    const res = await fetch(`${API}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("regName").value,
            password: document.getElementById("regPassword").value
        })
    });

    alert("User Registered ✅");
}


// ================================
// LOGIN USER
// ================================
async function loginUser() {
    const res = await fetch(`${API}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("loginName").value,
            password: document.getElementById("loginPassword").value
        })
    });

    const data = await res.json();

    if (res.ok) {
        document.getElementById("loginStatus").innerText = "Login Success ✅";
        localStorage.setItem("user", data.user);
    } else {
        document.getElementById("loginStatus").innerText = "Login Failed ❌";
    }
}


// ================================
// INIT
// ================================
window.onload = loadAccounts;