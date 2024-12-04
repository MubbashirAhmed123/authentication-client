
const errorMsg=document.getElementById('errorMsg')
const successMsg=document.getElementById('successMsg')

//password validation
function validatePassword(password) {
    const specialChars = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '{', '}', '!']
    let containSpecialChar = false

    specialChars.forEach(char => {
        if (password.includes(char)) {
            containSpecialChar = true
        }
    })

    if (!containSpecialChar || password.length < 8) {
        return "Password must be at least 8 characters long and should contain at least one special character."
    }
    return ""
}


//registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if(!username || !email || !password){
        errorMsg.innerHTML = "<p class='text-red-900 bg-red-300 p-2 text-center'>All fields are required.</p>"
        return
    }

    if (username.length < 3) {
        errorMsg.innerHTML = "<p class='text-red-900 bg-red-300 p-2 text-center'>Enter Full Name</p>"
        return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
        errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${passwordError}</p>`
        return
    }

    try {
        const res = await fetch('https://user-authentication-khaki.vercel.app/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })

        const data = await res.json()
        if (res.ok) {
            successMsg.innerHTML = `<p class='text-green-900 bg-green-300 p-2 text-center'>${data.message}</p>`
            window.location.href = 'login.html'
        } else {
            errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${data.message}</p>`
        }
    } catch (error) {
        errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${error.message}</p>`
    }
})

// Reset Password
document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const newPassword = document.getElementById('newPassword').value

    if(!newPassword || !email ){
        errorMsg.innerHTML = "<p class='text-red-900 bg-red-300 p-2 text-center'>All fields are required.</p>"
        return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
        errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${passwordError}</p>`
        return
    }

    try {
        const res = await fetch('https://user-authentication-khaki.vercel.app/user/resetpassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        })

        const data = await res.json()
        if (res.ok) {
            successMsg.innerHTML = `<p class='text-green-900 bg-green-300 p-2 text-center'>${data.message}</p>`
            window.location.href = 'login.html'

        } else {
            errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${data.message}</p>`
        }
    } catch (error) {
        errorMsg.innerHTML = `<p class='text-red-900 bg-red-300 p-2 text-center'>${error.message}</p>`
    }
})


//Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if(!email || !password ){
        errorMsg.innerHTML = "<p class='text-red-900 bg-red-300 p-2 text-center'>All fields are required.</p>"
        return
    }


    try {
        const res = await fetch('https://user-authentication-khaki.vercel.app/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()
        if (res.ok) {
            successMsg.innerHTML=`<p class='text-green-900 bg-green-300 p-2 text-center'>${data.message}</p>`
            localStorage.setItem('token', data.token)
            window.location.href = 'index.html'
        } else {
            errorMsg.innerHTML=`<p class='text-red-900 bg-red-300 p-2 text-center'>${data.message}</p>`
        }
    } catch (error) {
        errorMsg.innerHTML=`<p class='text-red-900 bg-red-300 p-2 text-center'>${error.message}</p>`
    }
})



const token = localStorage.getItem('token')
const user = document.getElementById('user')
const guest = document.getElementById('guest')
const username = document.getElementById('username')
const logoutBtn = document.getElementById('logoutBtn')

//authorization
async function checkAuth() {

    if (!token) {
        guest.style.display = 'block'
        return
    }

    try {
        const res = await fetch('https://user-authentication-khaki.vercel.app/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
            const data = await res.json()
            username.innerText = data.username
            user.style.display = 'block'
            guest.style.display = 'none'
        } else {
            localStorage.removeItem('token')
            guest.style.display = 'block'
        }
    } catch (error) {
=        guest.style.display = 'block'
    }
}
checkAuth()


//logout
logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = 'login.html'
    alert('logout successful')
})


