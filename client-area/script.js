/**
 * TechGrid Systems - Customer Portal Logic
 * Contains SHA-256 hashing and validation
 */

// Passwords stored as SHA-256 hashes
const credentials = {
    "Admin": "24073273c990956e3009765239e3868019323568971f11c7590832b4923e3129",
    "test": "1b3152528784d7a8d052d9a3b2b48d28a506841280b85295d85834907996c56d"
};

let count = 2; // Initial attempts

/**
 * Generate SHA-256 hex string from message
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Display messages in the UI box
 */
function showMessage(text, isError = true) {
    const box = document.getElementById('msg-box');
    if (!box) return;
    
    box.innerText = text;
    box.classList.remove('hidden', 'bg-red-50', 'text-red-600', 'bg-blue-50', 'text-blue-600');
    
    if (isError) {
        box.classList.add('bg-red-50', 'text-red-600');
    } else {
        box.classList.add('bg-blue-50', 'text-blue-600');
    }
}

/**
 * Main validation function
 */
async function validate() {
    const unField = document.getElementById('username');
    const pwField = document.getElementById('password');
    const btn = document.getElementById('login-btn');
    
    const un = unField.value;
    const pw = pwField.value;
    
    if (!un || !pw) {
        showMessage("Please enter both username and password.");
        return;
    }

    // Hash input to compare
    const hashedInputPw = await sha256(pw);

    if (credentials[un] === hashedInputPw) {
        showMessage("Login successful! Redirecting...", false);
        setTimeout(() => {
            window.location = "https://techgrid-systems.github.io/techgrid-systems/support/";
        }, 800);
        return;
    }

    if (count >= 1) {
        showMessage(`Invalid credentials. ${count} attempts remaining.`);
        count--;
    } else {
        // Lockout procedure
        showMessage("Account blocked due to multiple failed attempts.");
        unField.value = "ACCOUNT BLOCKED";
        pwField.value = "ACCOUNT BLOCKED";
        unField.disabled = true;
        pwField.disabled = true;
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// Basic security measures
function preback() { window.history.forward(); }
setTimeout(preback, 0);
window.onunload = function() { null };
