export const LIST_ASSETS = [
    {
        id: "video-0",
        name: "kartini",
        src: "/video/kartini.mp4",
        imgSrc: "/images/kartini.jpg",
        type: "video",
        description:
            "Raden Ayu Adipati Kartini Djojoadhiningrat (21 April 1879 – 17 September 1904) atau sering disebut dengan gelarnya sebelum menikah: Raden Ajeng Kartini, adalah seorang tokoh Jawa dan Pahlawan Nasional Indonesia.",
    },
    {
        id: "video-1",
        name: "basoeki",
        src: "/video/bwman.mp4",
        imgSrc: "/images/basoeki.JPG",
        type: "video",
        description:
            "Fransiskus Xaverius Basuki Abdullah (ejaan lama: Basoeki Abdullah; 25 Januari 1915 – 5 November 1993) adalah salah seorang pelukis Indonesia",
    },
    {
        id: "video-2",
        name: "soekarno",
        src: "/video/soekarno.mp4",
        imgSrc: "/images/soekarno.jpg",
        type: "video",
        description: "Soekarno adalah Presiden Indonesia pertama yang menjabat pada periode 1945–1967. Ia adalah pemimpin proklamator kemerdekaan Indonesia.",
    },
    {
        id: "img-1",
        name: "gatotkaca",
        src: "/images/gatotkaca.JPG",
        imgSrc: "/images/gatotkaca.JPG",
        type: "img",
        description: "Gatotkaca adalah tokoh pewayangan Jawa yang terkenal sebagai ksatria gagah perkasa dalam kisah Mahabharata.",
    },
    {
        id: "img-2",
        name: "florafauna",
        src: "/images/florafauna.jpg",
        imgSrc: "/images/florafauna.jpg",
        type: "img",
        description: "Flora dan fauna adalah istilah yang merujuk pada tumbuhan dan hewan yang hidup di suatu wilayah atau zaman tertentu.",
    },
];

export const MESSAGE = {
    login: "Berhasil masuk!",
    register: "Berhasil daftar dan masuk!",
    reset: "Email reset password berhasil dikirim!",
    nameValidation: "Nama minimal 3 karakter",
    roleValidation: "Role minimal 3 karakter",
    emailValidation: "Email tidak valid",
    passwordValidation: "Password minimal 6 karakter",
    confirmPasswordValidation: "Konfirmasi password harus minimal 6 karakter",
    passwordNotMatch: "Password dan konfirmasi password tidak sama",
    terms: "Kamu harus menyetujui kebijakan privasi"
}

export const FIREBASE_ERRORS_CODE = {
    "auth/invalid-credential": "Email atau password salah.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/email-already-in-use": "Email sudah digunakan.",
    "auth/network-request-failed": "Jaringan bermasalah.",
    "auth/expired-action-code": "Kode verifikasi sudah kadaluarsa.",
    "auth/user-not-found": "User tidak ditemukan.",
    "auth/invalid-action-code": "Kode verifikasi tidak valid.",
    "auth/user-disabled": "User dinonaktifkan.",
    "auth/wrong-password": "User atau Password yang anda masukkan salah.",
    default: "Terjadi kesalahan saat signup/login",
}