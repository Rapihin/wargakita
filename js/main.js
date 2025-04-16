document.addEventListener('DOMContentLoaded', () => {
    // ... (Data Simulasi dan fungsi dasar sebelumnya) ...
    let currentOtp = null; // Untuk menyimpan OTP simulasi

    // === FUNGSI BARU / MODIFIKASI ===

    // III. Fungsionalitas & UX: Menampilkan/Menyembunyikan Spinner
    const showSpinner = (button) => {
        const spinner = button.querySelector('.spinner');
        if (spinner) spinner.classList.remove('hidden');
        button.classList.add('is-loading'); // Tambahkan class untuk styling saat loading
        button.disabled = true; // Disable tombol saat loading
    };

    const hideSpinner = (button) => {
        const spinner = button.querySelector('.spinner');
        if (spinner) spinner.classList.add('hidden');
        button.classList.remove('is-loading');
        button.disabled = false;
    };

    // III. Fungsionalitas & UX: Simulasi OTP
    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('#register-name').value;
        const address = form.querySelector('#register-address').value;
        const contact = form.querySelector('#register-contact').value;
        const password = form.querySelector('#register-password').value;
        const otpSection = document.getElementById('otp-section');
        const otpInput = document.getElementById('otp-input');
        const registerButton = form.querySelector('button[type="submit"]');
        const registerBtnText = document.getElementById('register-btn-text');

        // --- Tahap 1: Minta OTP ---
        if (otpSection.classList.contains('hidden')) {
            if (!name || !address || !contact || !password) {
                alert("Mohon isi semua field pendaftaran awal.");
                return;
            }
            if (users.some(user => user.contact === contact)) {
                alert("Email/Kontak sudah terdaftar. Silakan login.");
                return;
            }

            showSpinner(registerButton);
            // Simulasi pengiriman OTP
            setTimeout(() => {
                hideSpinner(registerButton);
                currentOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit OTP
                document.getElementById('otp-destination').textContent = contact; // Tampilkan tujuan OTP
                otpSection.classList.remove('hidden'); // Tampilkan input OTP
                alert(`(Simulasi) Kode OTP (${currentOtp}) telah dikirim ke ${contact}.`);
                registerBtnText.textContent = 'Verifikasi & Selesaikan Pendaftaran'; // Ubah teks tombol
                // Sembunyikan field awal (opsional)
                form.querySelector('#register-name').closest('.form-group').classList.add('hidden');
                form.querySelector('#register-address').closest('.form-group').classList.add('hidden');
                form.querySelector('#register-contact').closest('.form-group').classList.add('hidden');
                form.querySelector('#register-password').closest('.form-group').classList.add('hidden');

            }, 1500); // Simulasi delay network

        }
        // --- Tahap 2: Verifikasi OTP ---
        else {
            const enteredOtp = otpInput.value;
            if (!enteredOtp) {
                alert("Masukkan kode OTP yang Anda terima.");
                return;
            }

            showSpinner(registerButton);
            // Simulasi verifikasi OTP
            setTimeout(() => {
                hideSpinner(registerButton);
                if (enteredOtp === currentOtp) {
                    // --- Registrasi User (setelah OTP valid) ---
                    const newUser = { /* ... (buat objek user seperti sebelumnya) ... */
                         id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                         name: name, address: address, contact: contact, password: password, isVerified: true, /* ... fields lain ... */
                    };
                    users.push(newUser);
                    loggedInUser = newUser;
                    saveData();
                    alert("Verifikasi berhasil! Pendaftaran selesai. Selamat datang di WargaKita!");
                    window.location.href = 'browse.html';
                } else {
                    alert("Kode OTP salah. Silakan coba lagi.");
                    otpInput.value = ''; // Kosongkan input OTP
                    // Berikan opsi kirim ulang OTP di sini (jika diperlukan)
                }
                currentOtp = null; // Reset OTP setelah percobaan
            }, 1000);
        }
    };

    // III. Fungsionalitas & UX: Penanganan Lupa Password
    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const contact = form.querySelector('#reset-contact').value;
        const button = form.querySelector('button[type="submit"]');

        if (!contact) { alert("Masukkan email atau nomor kontak."); return; }

        showSpinner(button);
        // Simulasi pengecekan kontak dan pengiriman link
        setTimeout(() => {
            hideSpinner(button);
            // Di aplikasi nyata, cek dulu apakah kontak ada di database
            alert(`(Simulasi) Jika ${contact} terdaftar, instruksi reset password telah dikirim.`);
            // Opsional: Simpan token palsu jika perlu simulasi lebih lanjut
            // localStorage.setItem('resetToken', 'simulated_token_123');
            // localStorage.setItem('resetContact', contact);
            form.reset(); // Kosongkan form
        }, 1500);
    };

    // III. Fungsionalitas & UX: Penanganan Reset Password
    const handleResetPasswordSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const newPassword = form.querySelector('#new-password').value;
        const confirmPassword = form.querySelector('#confirm-password').value;
        const token = form.querySelector('#reset-token').value; // Ambil token (simulasi)
        const button = form.querySelector('button[type="submit"]');

        if (!newPassword || !confirmPassword) { alert("Mohon isi kedua field password."); return; }
        if (newPassword !== confirmPassword) { alert("Password baru dan konfirmasi tidak cocok."); return; }
        if (newPassword.length < 8) { alert("Password minimal 8 karakter."); return; }

        showSpinner(button);
        // Simulasi validasi token dan update password
        setTimeout(() => {
            hideSpinner(button);
            // Di aplikasi nyata, validasi token di backend & update password user terkait
            // Contoh simulasi update di localStorage:
            // const contactToReset = localStorage.getItem('resetContact');
            // const userIndex = users.findIndex(user => user.contact === contactToReset);
            // if (userIndex > -1 && token === localStorage.getItem('resetToken')) {
            //     users[userIndex].password = newPassword; // Ganti password (hash di backend!)
            //     saveData();
            //     localStorage.removeItem('resetToken');
            //     localStorage.removeItem('resetContact');
                 alert("(Simulasi) Password berhasil direset! Silakan login dengan password baru.");
                 window.location.href = 'index.html'; // Redirect ke login
            // } else {
            //     alert("Token reset tidak valid atau telah kedaluwarsa.");
            // }
        }, 1500);
    };


    // === PENDAFTARAN EVENT LISTENER ===

    // ... (Listener untuk toggle login/register, logout) ...

    // Gunakan fungsi baru untuk form registrasi
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistrationSubmit);
    }

    // Listener untuk form lupa password
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
    }

    // Listener untuk form reset password
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);
    }

    // Listener untuk form login (tambahkan spinner)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = loginForm.querySelector('button[type="submit"]');
            showSpinner(button);
            const email = /* ... */; const password = /* ... */;

            // Simulasi Cek Login (dengan delay)
            setTimeout(() => {
                hideSpinner(button);
                const foundUser = users.find(user => user.contact === email && user.password === password);
                if (foundUser) {
                    loggedInUser = foundUser; saveData();
                    alert(`Selamat datang kembali, ${loggedInUser.name}!`);
                    window.location.href = 'browse.html';
                } else {
                    alert("Email atau password salah.");
                }
            }, 1000);
        });
    }

    // Listener untuk form posting (tambahkan spinner)
     const postForm = document.getElementById('post-form');
    if (postForm) {
        checkLogin(); // Pastikan login
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!checkLogin()) return;
            const button = postForm.querySelector('button[type="submit"]');
            showSpinner(button);
            const type = /* ... */; /* ... ambil data lain ... */

            // Simulasi Simpan Postingan (dengan delay)
            setTimeout(() => {
                 hideSpinner(button);
                 if (!category || !title || !description) { /* ... validasi ... */ }
                 const newListing = { /* ... buat objek listing ... */ };
                 listings.unshift(newListing); saveData();
                 alert("Postingan Anda berhasil dipublikasikan!");
                 window.location.href = 'browse.html';
            }, 1200);
        });
    }

    // ... (Listener lain untuk browse, profile, dll.)

}); // Akhir DOMContentLoaded
