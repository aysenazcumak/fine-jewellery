document.addEventListener("DOMContentLoaded", () => {

    const products = document.querySelectorAll(".product");
    let currentCategory = "all";
    let currentCarat = "all";
    let currentPrice = "all";

    /* ======================
       FAVORİ YARDIMCILAR
    ====================== */
    const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];
    const saveFavorites = favs => localStorage.setItem("favorites", JSON.stringify(favs));

    /* ======================
       KALPLERİ GÜNCELLE
    ====================== */
    function updateHearts() {
        const favs = getFavorites();
        products.forEach(p => {
            const fav = p.querySelector(".fav");
            if (!fav) return;
            const exists = favs.find(f => f.id === p.dataset.id);
            fav.textContent = exists ? "❤" : "♡";
            fav.style.color = exists ? "red" : "black";
        });
    }
    updateHearts();

    /* ======================
       FAVORİ EKLE / ÇIKAR
    ====================== */
    document.addEventListener("click", e => {
        if (!e.target.classList.contains("fav")) return;

        e.stopPropagation();
        const product = e.target.closest(".product");
        const id = product.dataset.id;

        let favs = getFavorites();
        const index = favs.findIndex(f => f.id === id);

        if (index > -1) {
            favs.splice(index, 1);
        } else {
            favs.push({
                id,
                name: product.querySelector(".name").innerText,
                price: product.querySelector(".price").innerText,
                img: product.querySelector("img").src,
                category: product.dataset.category,
                carat: product.dataset.carat
            });
        }

        saveFavorites(favs);
        updateHearts();
    });

    /* ======================
       FİLTRELEME ANA FONKSİYONU
    ====================== */
    function filterProducts() {
        products.forEach(p => {
            const category = p.dataset.category;
            const carat = parseFloat(p.dataset.carat);
            const price = parseInt(p.querySelector(".price").innerText.replace(/\D/g, ""));

            let show = true;

            if (currentCategory !== "all" && category !== currentCategory) show = false;

            if (currentCarat === "0-1" && carat > 1) show = false;
            if (currentCarat === "1-2" && (carat <= 1 || carat > 2)) show = false;
            if (currentCarat === "2+" && carat <= 2) show = false;

            if (currentPrice === "0-50000" && price > 50000) show = false;
            if (currentPrice === "50000-100000" && (price < 50000 || price > 100000)) show = false;
            if (currentPrice === "100000+" && price < 100000) show = false;

            p.style.display = show ? "block" : "none";
        });
    }

    /* ======================
       KATEGORİ
    ====================== */
    document.querySelectorAll("#categoryList li").forEach(li => {
        li.addEventListener("click", () => {
            currentCategory = li.dataset.filter;
            filterProducts();
        });
    });

    /* ======================
       KARAT
    ====================== */
    document.querySelectorAll("#caratList li").forEach(li => {
        li.addEventListener("click", () => {
            currentCarat = li.dataset.carat;
            filterProducts();
        });
    });

    /* ======================
       FİYAT
    ====================== */
    document.querySelectorAll("#priceList li").forEach(li => {
    li.addEventListener("click", () => {
        const range = li.dataset.price;

        document.querySelectorAll(".product").forEach(p => {
            const price = parseInt(p.querySelector(".price").innerText.replace(/\D/g,""));
            let show = false;

            if (range === "0-50000" && price <= 50000) show = true;
            if (range === "50000-100000" && price > 50000 && price <= 100000) show = true;
            if (range === "100000+" && price > 100000) show = true;

            p.style.display = show ? "block" : "none";
        });
    });
});
    /* ======================
       ARAMA
    ====================== */
    document.querySelector(".search").addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        products.forEach(p => {
            const name = p.querySelector(".name").innerText.toLowerCase();
            p.style.display = name.includes(value) ? "block" : "none";
        });
    });

    /* ======================
       FAVORİLER SAYFASI
    ====================== */
    if (window.location.pathname.includes("favorites.html")) {
        const grid = document.querySelector(".grid");
        const favs = getFavorites();

        if (favs.length === 0) {
            grid.innerHTML = "<p>Favori ürün yok.</p>";
        } else {
            grid.innerHTML = favs.map(p => `
                <div class="product" data-id="${p.id}">
                    <span class="fav" style="color:red;">❤</span>
                    <img src="${p.img}">
                    <p class="name">${p.name}</p>
                    <p class="price">${p.price}</p>
                    <button class="add-cart">Sepete Ekle</button>
                </div>
            `).join("");
        }
    }

    /* ======================
       SEPETE EKLE
    ====================== */
    document.addEventListener("click", e => {
        if (!e.target.classList.contains("add-cart")) return;

        const product = e.target.closest(".product");
        const item = {
            id: product.dataset.id,
            name: product.querySelector(".name").innerText,
            price: product.querySelector(".price").innerText,
            img: product.querySelector("img").src
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Ürün sepete eklendi 🛒");
    });

});
// DROPDOWN AÇ / KAPA
const accountBtn = document.getElementById("accountBtn");
const infoBtn = document.getElementById("infoBtn");

accountBtn.addEventListener("click", e => {
    e.stopPropagation();
    document.querySelector(".account-menu").style.display = "block";
    document.querySelector(".info-menu").style.display = "none";
});

infoBtn.addEventListener("click", e => {
    e.stopPropagation();
    document.querySelector(".info-menu").style.display = "block";
    document.querySelector(".account-menu").style.display = "none";
});

// Sayfaya tıklayınca kapat
document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
});

/* ======================
   FİYATA GÖRE SIRALAMA
====================== */

const sortSelect = document.getElementById("sort");
const grid = document.querySelector(".grid");

if (sortSelect && grid) {
    sortSelect.addEventListener("change", () => {
        const products = Array.from(grid.querySelectorAll(".product"));

        products.sort((a, b) => {
            const priceA = parseInt(
                a.querySelector(".price").textContent.replace(/\D/g, "")
            );
            const priceB = parseInt(
                b.querySelector(".price").textContent.replace(/\D/g, "")
            );

            if (sortSelect.value === "asc") {
                return priceA - priceB; // Artan ⬆️
            } else if (sortSelect.value === "desc") {
                return priceB - priceA; // Azalan ⬇️
            }
            return 0;
        });

        // Grid’i temizle ve sıralı ürünleri tekrar ekle
        grid.innerHTML = "";
        products.forEach(p => grid.appendChild(p));
    });
}
