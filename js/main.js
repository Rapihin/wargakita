document.addEventListener('DOMContentLoaded', () => {

    // === DATA SIMULASI (Ganti dengan API call jika ada backend) ===
    // Mengambil data dari localStorage atau menggunakan data default jika kosong
    let users = JSON.parse(localStorage.getItem('wargaKitaUsers')) || [];
    let listings = JSON.parse(localStorage.getItem('wargaKitaListings')) || [
        // Contoh data awal (sesuaikan dengan kebutuhan WargaKita)
        { id: 1, userId: 1, userName: 'Budi Santoso', userAddress: 'RT 01/RW 05', type: 'offer', category: 'Perawatan Rumah', title: 'Jasa Potong Rumput Halaman', description: 'Bisa bantu potong rumput halaman depan/belakang. Bawa alat sendiri.', availability: 'Sabtu/Minggu Pagi', reward: 50, createdAt: '2025-04-15T10:00:00Z' },
        { id: 2, userId: 2, userName: 'Citra Lestari', userAddress: 'RT 02/RW 05', type: 'request', category: 'Pendidikan', title: 'Butuh Bantuan Ajari Anak Matematika SD', description: 'Anak kelas 4 SD kesulitan perkalian. Butuh bantuan 1-2 jam seminggu.', availability: 'Sore hari kerja', reward: 75, createdAt: '2025-04-14T15:30:00Z' },
        { id: 3, userId: 1, userName: 'Budi Santoso', userAddress: 'RT 01/RW 05', type: 'offer', category: 'Peminjaman Barang', title: 'Pinjamkan Tangga Lipat', description: 'Tersedia tangga lipat 3 meter untuk dipinjam.', availability: 'Konfirmasi dulu', reward: 10, createdAt: '2025-04-16T08:00:00Z' },
        { id: 4, userId: 3, userName: 'Agus Wijaya', userAddress: 'RT 01/RW 05', type: 'request', category: 'Teknologi', title: 'Laptop Lemot, Ada yang Bisa Cek?', description: 'Laptop terasa lambat, mungkin perlu dibersihkan atau cek virus.', availability: 'Fleksibel', reward: 60, createdAt: '2025-04-16T09:15:00Z' },
        { id: 5, userId: 2, userName: 'Citra Lestari', userAddress: 'RT 02/RW 05', type: 'offer', category: 'Hewan Peliharaan', title: 'Bisa Bantu Titip Kucing Saat Libur', description: 'Punya pengalaman merawat kucing, bisa bantu titip saat Anda pergi.', availability: 'Libur panjang / sesuai kesepakatan', reward: 80, createdAt: '2025-04-13T11:00:00Z' },
    ];
    let loggedInUser = JSON.parse(localStorage.getItem('wargaKitaLoggedInUser'));
    let currentOtp = null; // Untuk menyimpan OTP simulasi

    // === FUNGSI HELPER ===

    // Fungsi helper untuk menyimpan data ke localStorage
    const saveData = () => {
        localStorage.setItem('wargaKitaUsers', JSON.stringify(users));
        localStorage.setItem('wargaKitaListings', JSON.stringify(listings));
        localStorage.setItem('wargaKitaLoggedInUser', JSON.stringify(loggedInUser));
    };

     // Fungsi untuk cek apakah user sudah login
     // redirectIfLoggedOut = true akan redirect ke index.html jika belum login
     // redirectIfLoggedIn = true akan redirect ke browse.html jika *sudah* login (berguna untuk halaman auth)
    const checkLogin = (redirectIfLoggedOut = true, redirectIfLoggedIn = false) => {
        if (loggedInUser) {
            if (redirectIfLoggedIn && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'))) {
                window.location.href = 'browse.html'; // Redirect ke browse jika sudah login dan ada di halaman auth
            }
            return true; // User sudah login
        } else {
            // User belum login
            const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('forgot-password.html') || window.location.pathname.endsWith('reset-password.html');
            if (redirectIfLoggedOut && !isAuthPage) {
                alert("Anda harus login terlebih dahulu.");
                window.location.href = 'index.html'; // Redirect ke halaman login jika belum login dan tidak di halaman auth
            }
            return false; // User belum login
        }
    };

    // Fungsi untuk logout
    const logout = () => {
        loggedInUser = null;
        localStorage.removeItem('wargaKitaLoggedInUser'); // Hapus user dari localStorage
        alert("Anda telah keluar.");
        window.location.href = 'index.html'; // Redirect ke halaman login
    };

    // Menampilkan/Menyembunyikan Spinner pada Tombol
    const showSpinner = (button) => {
        const spinner = button.querySelector('.spinner');
        if (spinner) spinner.classList.remove('hidden');
        button.classList.add('is-loading');
        button.disabled = true;
    };

    const hideSpinner = (button) => {
        const spinner = button.querySelector('.spinner');
        if (spinner) spinner.classList.add('hidden');
        button.classList.remove('is-loading');
        button.disabled = false;
    };

    // Fungsi validasi input sederhana (bisa diperluas)
    const validateInput = (inputElement) => {
        const formGroup = inputElement.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        const successIcon = formGroup.querySelector('.validation-icon.success');
        const errorIcon = formGroup.querySelector('.validation-icon.error');
        let isValid = true;

        // Sembunyikan ikon & pesan error sebelumnya
        if (errorMsg) errorMsg.classList.add('hidden');
        if (successIcon) successIcon.classList.add('hidden');
        if (errorIcon) errorIcon.classList.add('hidden');
        formGroup.classList.remove('is-invalid', 'is-valid');

        // Contoh validasi: tidak boleh kosong
        if (inputElement.required && inputElement.value.trim() === '') {
            isValid = false;
            if (errorMsg) {
                errorMsg.textContent = `${inputElement.labels[0]?.textContent || 'Field'} wajib diisi.`;
                errorMsg.classList.remove('hidden');
            }
            if (errorIcon) errorIcon.classList.remove('hidden');
            formGroup.classList.add('is-invalid');
        }
        // Contoh validasi: email format (sederhana)
        else if (inputElement.type === 'email' && !/\S+@\S+\.\S+/.test(inputElement.value)) {
             isValid = false;
             if (errorMsg) {
                 errorMsg.textContent = 'Format email tidak valid.';
                 errorMsg.classList.remove('hidden');
             }
              if (errorIcon) errorIcon.classList.remove('hidden');
             formGroup.classList.add('is-invalid');
        }
         // Contoh validasi: password minimal 8 karakter
        else if (inputElement.id === 'register-password' && inputElement.value.length < 8) {
             isValid = false;
             if (errorMsg) {
                 errorMsg.textContent = 'Password minimal 8 karakter.';
                 errorMsg.classList.remove('hidden');
             }
              if (errorIcon) errorIcon.classList.remove('hidden');
             formGroup.classList.add('is-invalid');
        }
        // Jika valid
        else if (inputElement.required) {
            if (successIcon) successIcon.classList.remove('hidden');
             formGroup.classList.add('is-valid');
        }

        return isValid;
    };

     // Fungsi validasi seluruh form
     const validateForm = (formElement) => {
         let isFormValid = true;
         const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
         inputs.forEach(input => {
             if (!validateInput(input)) {
                 isFormValid = false;
             }
         });
         return isFormValid;
     };


    // === FUNGSI LOGIKA APLIKASI ===

    // Simulasi OTP & Registrasi
    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const otpSection = document.getElementById('otp-section');
        const registerButton = form.querySelector('button[type="submit"]');
        const registerBtnText = document.getElementById('register-btn-text');

        // Validasi field yang terlihat
        const inputsToValidate = otpSection.classList.contains('hidden')
            ? form.querySelectorAll('#register-name, #register-address, #register-contact, #register-password')
            : form.querySelectorAll('#otp-input'); // Hanya validasi OTP jika section terlihat

        let isStageValid = true;
        inputsToValidate.forEach(input => {
            if (!validateInput(input)) {
                isStageValid = false;
            }
        });

        // Jika tahap 1 (belum minta OTP) dan valid
        if (otpSection.classList.contains('hidden') && isStageValid) {
            const contact = form.querySelector('#register-contact').value;
            if (users.some(user => user.contact === contact)) {
                alert("Email/Kontak sudah terdaftar. Silakan login.");
                // Tandai field kontak sebagai invalid
                const contactInput = form.querySelector('#register-contact');
                const formGroup = contactInput.closest('.form-group');
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Kontak sudah terdaftar.';
                    errorMsg.classList.remove('hidden');
                }
                formGroup.classList.add('is-invalid');
                formGroup.classList.remove('is-valid'); // Hapus valid jika ada
                 const errorIcon = formGroup.querySelector('.validation-icon.error');
                 if(errorIcon) errorIcon.classList.remove('hidden');
                return;
            }

            showSpinner(registerButton);
            setTimeout(() => { // Simulasi pengiriman OTP
                hideSpinner(registerButton);
                currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
                document.getElementById('otp-destination').textContent = contact;
                otpSection.classList.remove('hidden');
                alert(`(Simulasi) Kode OTP (${currentOtp}) telah dikirim ke ${contact}.`);
                registerBtnText.textContent = 'Verifikasi & Selesaikan Pendaftaran';
                 // Sembunyikan field awal (opsional)
                 form.querySelectorAll('.form-group:not(#otp-section)').forEach(fg => fg.style.display = 'none');
            }, 1500);
        }
        // Jika tahap 2 (verifikasi OTP) dan valid
        else if (!otpSection.classList.contains('hidden') && isStageValid) {
            const enteredOtp = form.querySelector('#otp-input').value;
            showSpinner(registerButton);
            setTimeout(() => { // Simulasi verifikasi OTP
                hideSpinner(registerButton);
                if (enteredOtp === currentOtp) {
                    const name = form.querySelector('#register-name').value; // Ambil lagi nilainya
                    const address = form.querySelector('#register-address').value;
                    const contact = form.querySelector('#register-contact').value;
                    const password = form.querySelector('#register-password').value;

                    const newUser = {
                         id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                         name, address, contact, password, // Di backend, password HARUS di-hash
                         isVerified: true, bio: '', skills: [], needs: [], createdAt: new Date().toISOString()
                    };
                    users.push(newUser);
                    loggedInUser = newUser;
                    saveData();
                    alert("Verifikasi berhasil! Pendaftaran selesai. Selamat datang di WargaKita!");
                    window.location.href = 'browse.html'; // Redirect ke halaman utama setelah login
                } else {
                    alert("Kode OTP salah. Silakan coba lagi.");
                    validateInput(form.querySelector('#otp-input')); // Tandai OTP input sebagai invalid
                }
                currentOtp = null; // Reset OTP
            }, 1000);
        }
        // Jika ada field yang tidak valid
        else if (!isStageValid) {
             console.log("Form registrasi tidak valid.");
             // Pesan error sudah muncul dari validateInput
        }
    };

    // Penanganan Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');

        if (!validateForm(form)) {
            console.log("Form login tidak valid.");
            return;
        }

        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;

        showSpinner(button);
        setTimeout(() => { // Simulasi Cek Login
            hideSpinner(button);
            const foundUser = users.find(user => user.contact === email && user.password === password); // Di backend, bandingkan HASH password
            if (foundUser) {
                loggedInUser = foundUser;
                saveData();
                alert(`Selamat datang kembali, ${loggedInUser.name}!`);
                window.location.href = 'browse.html';
            } else {
                alert("Email atau password salah.");
                // Tandai field sebagai invalid
                 validateInput(form.querySelector('#login-email'));
                 validateInput(form.querySelector('#login-password'));
                 // Beri pesan error spesifik jika perlu
                 const emailGroup = form.querySelector('#login-email').closest('.form-group');
                 const passGroup = form.querySelector('#login-password').closest('.form-group');
                 const errorMsg = emailGroup.querySelector('.error-message') || document.createElement('small');
                 errorMsg.textContent = 'Email atau password salah.';
                 errorMsg.classList.add('error-message');
                 errorMsg.classList.remove('hidden');
                 if (!emailGroup.contains(errorMsg)) emailGroup.appendChild(errorMsg); // Tambahkan pesan error jika belum ada
                 emailGroup.classList.add('is-invalid');
                 passGroup.classList.add('is-invalid');
            }
        }, 1000);
    };

    // Penanganan Lupa Password
    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        const contactInput = form.querySelector('#reset-contact');

        if (!validateInput(contactInput)) return; // Validasi input

        const contact = contactInput.value;

        showSpinner(button);
        setTimeout(() => { // Simulasi pengiriman link
            hideSpinner(button);
            alert(`(Simulasi) Jika ${contact} terdaftar, instruksi reset password telah dikirim.`);
            form.reset();
        }, 1500);
    };

    // Penanganan Reset Password
    const handleResetPasswordSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        const newPasswordInput = form.querySelector('#new-password');
        const confirmPasswordInput = form.querySelector('#confirm-password');

        // Validasi form
        const isNewPassValid = validateInput(newPasswordInput);
        const isConfirmPassValid = validateInput(confirmPasswordInput);
        let isMatchValid = true;

        if (newPasswordInput.value !== confirmPasswordInput.value) {
             isMatchValid = false;
             alert("Password baru dan konfirmasi tidak cocok.");
             // Tandai kedua field sebagai invalid
             newPasswordInput.closest('.form-group').classList.add('is-invalid');
             confirmPasswordInput.closest('.form-group').classList.add('is-invalid');
             const errorMsg = confirmPasswordInput.closest('.form-group').querySelector('.error-message') || document.createElement('small');
             errorMsg.textContent = 'Password tidak cocok.';
             errorMsg.classList.add('error-message');
             errorMsg.classList.remove('hidden');
              if (!confirmPasswordInput.closest('.form-group').contains(errorMsg)) confirmPasswordInput.closest('.form-group').appendChild(errorMsg);

        } else if (isNewPassValid && isConfirmPassValid) { // Hanya hapus invalid jika keduanya valid dan cocok
             newPasswordInput.closest('.form-group').classList.remove('is-invalid');
             confirmPasswordInput.closest('.form-group').classList.remove('is-invalid');
             const errorMsg = confirmPasswordInput.closest('.form-group').querySelector('.error-message');
             if(errorMsg) errorMsg.classList.add('hidden');
        }


        if (!isNewPassValid || !isConfirmPassValid || !isMatchValid) {
             console.log("Form reset password tidak valid.");
             return;
        }

        const newPassword = newPasswordInput.value;
        // const token = form.querySelector('#reset-token').value; // Ambil token jika perlu

        showSpinner(button);
        setTimeout(() => { // Simulasi update password
            hideSpinner(button);
            alert("(Simulasi) Password berhasil direset! Silakan login dengan password baru.");
            window.location.href = 'index.html';
        }, 1500);
    };

    // Fungsi untuk menampilkan listing (contoh dasar, perlu disesuaikan)
    const displayListings = (listingsToShow) => {
        const container = document.getElementById('listings-container');
        if (!container) return;
        container.innerHTML = '<h3>Hasil Pencarian</h3>'; // Reset container

        if (!listingsToShow || listingsToShow.length === 0) {
            container.innerHTML += '<p id="no-listings-msg">Tidak ada postingan yang ditemukan.</p>';
            return;
        }

        listingsToShow.forEach(listing => {
            const card = document.createElement('div');
            card.className = 'listing-card';
            // Struktur HTML kartu disesuaikan dengan CSS baru
            card.innerHTML = `
                ${listing.image ? `<div class="listing-card-image" style="background-image: url('${listing.image}')"></div>` : ''}
                <div class="listing-card-content">
                    <div class="listing-card-header">
                        ${listing.categoryIcon ? `<span class="category-icon">${listing.categoryIcon}</span>` : ''}
                        <h4>${listing.title}</h4>
                    </div>
                    <div class="listing-card-body">
                        <p class="card-description">${listing.description}</p>
                    </div>
                    <div class="card-meta">
                        <span><svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg> ${listing.userName}</span>
                        <span><svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> ${listing.userAddress}</span>
                        <span><svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg> ${listing.category}</span>
                        <span><svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> ${new Date(listing.createdAt).toLocaleDateString('id-ID')}</span>
                        <span><svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 11.25Zm-18 0h13.5v-1.5c0-.621-.504-1.125-1.125-1.125H4.125a1.125 1.125 0 0 0-1.125 1.125v1.5Z" /></svg> ${listing.reward} Poin</span>
                    </div>
                     ${checkLogin(false) ? `
                     <div class="listing-card-footer">
                        <button class="btn btn-small btn-accent interest-btn" data-listing-id="${listing.id}">
                             Tunjukkan Minat
                             <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c.966 0 1.891.166 2.757.472.612.206 1.066.79 1.066 1.42C15.823 22.51 14.01 23 12 23s-3.823-.49-3.823-1.858c0-.63.454-1.214 1.066-1.42.866-.306 1.791-.472 2.757-.472Z" /> <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 12.75h.008v.008H12v-.008Z" /> </svg>
                         </button>
                     </div>` : ''}
                </div>
            `;
            container.appendChild(card);
        });

        // Tambahkan listener ke tombol minat setelah card dibuat
        addInterestButtonListeners(container);
    };

     // Fungsi untuk menambahkan event listener ke tombol "Tunjukkan Minat"
     const addInterestButtonListeners = (container) => {
        const interestButtons = container.querySelectorAll('.interest-btn');
         interestButtons.forEach(button => {
             // Hapus listener lama jika ada (untuk mencegah duplikasi saat filter)
             button.replaceWith(button.cloneNode(true));
         });
         // Tambahkan listener ke tombol baru
         container.querySelectorAll('.interest-btn').forEach(button => {
             button.addEventListener('click', handleInterestClick);
         });
     };

     const handleInterestClick = (e) => {
         if (!checkLogin()) return;
         const listingId = e.target.closest('.interest-btn').dataset.listingId;
         const listing = listings.find(l => l.id == listingId);
         alert(`(Simulasi) Anda menunjukkan minat pada "${listing.title}" oleh ${listing.userName}. Fitur chat akan muncul di sini.`);
         // Di aplikasi nyata, ini akan memicu notifikasi atau membuka chat
     };


    // === PENDAFTARAN EVENT LISTENER UTAMA ===

    // Toggle Login/Register Form
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    if (showRegisterLink && showLoginLink && loginSection && registerSection) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.classList.add('hidden');
            registerSection.classList.remove('hidden');
        });
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }

    // Handle Form Submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegistrationSubmit);

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);

    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);

    // Handle Logout (cari tombol logout di halaman manapun)
    // Perlu menempatkan tombol logout di HTML (misal di header jika sudah login)
    const logoutButton = document.getElementById('logout-btn'); // Asumsi ID tombol logout
     if (logoutButton) {
         // Hanya tampilkan tombol logout jika user login
         if(checkLogin(false)) { // false = jangan redirect jika belum login
             logoutButton.style.display = 'inline-block'; // atau 'block'
             logoutButton.addEventListener('click', (e) => {
                 e.preventDefault();
                 logout();
             });
         } else {
              logoutButton.style.display = 'none';
         }
     }

    // Inisialisasi Halaman Browse (jika ada di halaman browse)
    const filterButton = document.getElementById('filter-btn');
    if (filterButton) {
        checkLogin(); // Pastikan user login untuk melihat halaman browse
        // filterButton.addEventListener('click', filterListings); // Definisikan fungsi filterListings
        displayListings(listings); // Tampilkan semua listing awal
    }

     // Inisialisasi Halaman Post (jika ada di halaman post)
    const postForm = document.getElementById('post-form');
    if (postForm) {
         checkLogin(); // Pastikan user login untuk post
         // Tambahkan event listener untuk submit form post (seperti di respons sebelumnya)
         postForm.addEventListener('submit', (e) => {
             e.preventDefault();
             if (!checkLogin()) return;
             const button = postForm.querySelector('button[type="submit"]');
             // Validasi Form Post
             if (!validateForm(postForm)) {
                  console.log("Form posting tidak valid.");
                  return;
             }
             showSpinner(button);
             // Ambil data form
             const type = postForm.querySelector('input[name="post-type"]:checked').value;
             const category = postForm.querySelector('#post-category').value;
             const title = postForm.querySelector('#post-title').value;
             const description = postForm.querySelector('#post-description').value;
             const availability = postForm.querySelector('#post-availability').value;
             const reward = parseInt(postForm.querySelector('#post-reward').value) || 0;

             setTimeout(() => { // Simulasi Simpan Postingan
                 hideSpinner(button);
                 const newListing = {
                     id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
                     userId: loggedInUser.id,
                     userName: loggedInUser.name,
                     userAddress: loggedInUser.address,
                     type, category, title, description, availability, reward,
                     createdAt: new Date().toISOString()
                 };
                 listings.unshift(newListing); saveData();
                 alert("Postingan Anda berhasil dipublikasikan!");
                 window.location.href = 'browse.html';
             }, 1200);
         });
     }

     // Inisialisasi Halaman Profil (jika ada di halaman profil)
    const profileName = document.getElementById('profile-name');
    if (profileName) {
         checkLogin(); // Pastikan user login
         // Definisikan & panggil fungsi loadUserProfile()
         // Definisikan & panggil fungsi addProfileItem()
         // Tambahkan event listener untuk tombol simpan bio, tambah skill, tambah need
         // (Logika ini bisa diambil dari respons JS sebelumnya jika diperlukan)
         // Contoh pemanggilan: loadUserProfile();
    }

    // Cek status login saat memuat halaman auth
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        checkLogin(false, true); // false=jangan redirect jika logout, true=redirect jika login
    }


}); // Akhir dari DOMContentLoaded

