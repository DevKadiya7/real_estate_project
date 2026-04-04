function showPage(id) {
    let pages = document.querySelectorAll(".page");

    pages.forEach(p => p.classList.remove("active"));

    document.getElementById(id).classList.add("active");
}

// default page
document.getElementById("home").classList.add("active");