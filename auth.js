const isAuthenticated = () => {
    const token = getCookie('token');
    return !!token; // Mengubah logika return
};

const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
};

if (!isAuthenticated()) {
    window.location.href = '../../404.html';
}

const clearAuthToken = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

const logout = () => {
    clearAuthToken();
    window.location.href = '../../logout-splash.html';
};

document.getElementById('logoutBtn').addEventListener('click', logout);
