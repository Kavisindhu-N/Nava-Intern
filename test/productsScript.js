// async function loadProducts() {
//     const category = getCategoryFromPage(); // Identify category from page
//     const productsContainer = document.querySelector(".products-container");

//     const response = await fetch("http://localhost:3000/products");
//     const products = await response.json();
//     console.log(products);

//     const filteredProducts = products.filter(product => product.category === category);

//     if (filteredProducts.length === 0) {
//         productsContainer.innerHTML = "<p>No products available.</p>";
//         return;
//     }

//     filteredProducts.forEach(product => {
//         const productDiv = document.createElement("div");
//         productDiv.classList.add("new-product");

//         productDiv.innerHTML = `
//             <div class="imgcont"><img src="${product.productImage}" alt="${product.productName}"></div>
//             <p class="product-name">${product.productName}</p>
//             <p class="product-price">₹${product.productPrice}</p>
//             <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
//         `;

//         // **Add to Cart Event Listener**
//         productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
//             const loggedInUser = localStorage.getItem("loggedInUser");
//             if (!loggedInUser) {
//                 alert("Please log in to add items to your cart.");
//                 return;
//             }

//             const responseUsers = await fetch("http://localhost:3000/users");
//             const users = await responseUsers.json();
//             const user = users.find(u => u.email === loggedInUser);

//             if (!user) {
//                 alert("User not found!");
//                 return;
//             }

//             // Add product to user's cart
//             user.cartProducts.push(product);

//             // Update user's cart in the database
//             let res = await fetch(`http://localhost:3000/users/${user.id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(user),
//             });

//             if (res.ok) {
//                 alert("Product added to cart successfully!");
//             } else {
//                 alert("Error adding product to cart!");
//             }
//         });

//         productsContainer.appendChild(productDiv);
//     });
// }

// // **Identify Category Based on Page**
// function getCategoryFromPage() {
//     const pageName = window.location.pathname.split("/").pop();
//     switch (pageName) {
//         case "plants.html": return "plants";
//         case "lamps.html": return "lamps";
//         case "statue.html": return "statue";
//         case "wall.html": return "wall-hangings";
//         default: return "";
//     }
// }

// // **Call the function to load products**
// loadProducts();






async function loadProducts() {
    const category = getCategoryFromPage(); // Identify category from page
    const productsContainer = document.querySelector(".products-container");

    try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error("Failed to fetch products.");
        
        const products = await response.json();
        console.log(products);

        const filteredProducts = products.filter(product => product.category === category);

        productsContainer.innerHTML = ""; // Clear previous content

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<p>No products available.</p>";
            return;
        }

        filteredProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("new-product");

            productDiv.innerHTML = `
                <div class="imgcont"><img src="${product.productImage}" alt="${product.productName}"></div>
                <p class="product-name">${product.productName}</p>
                <p class="product-price">₹${product.productPrice}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;

            // **Add to Cart Event Listener**
            productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
                await addToCart(product);
            });

            productsContainer.appendChild(productDiv);
        });

    } catch (error) {
        console.error("Error loading products:", error);
        productsContainer.innerHTML = "<p>Error loading products.</p>";
    }
}

// **Add to Cart Function**
async function addToCart(product) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Please log in to add items to your cart.");
        return;
    }

    try {
        const responseUsers = await fetch("http://localhost:3000/users");
        if (!responseUsers.ok) throw new Error("Failed to fetch users.");

        const users = await responseUsers.json();
        const user = users.find(u => u.email === loggedInUser);

        if (!user) {
            alert("User not found!");
            return;
        }

        // Ensure `cartProducts` exists
        if (!Array.isArray(user.cartProducts)) {
            user.cartProducts = [];
        }

        // Check if product is already in the cart
        const existingProduct = user.cartProducts.find(item => item.id === product.id);
        if (existingProduct) {
            alert("This product is already in your cart!");
            return;
        }

        // Add product to cart
        user.cartProducts.push(product);

        // Update user's cart in the database
        const updateResponse = await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!updateResponse.ok) throw new Error("Failed to update cart.");

        alert("Product added to cart successfully!");
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding product to cart!");
    }
}

// **Identify Category Based on Page**
function getCategoryFromPage() {
    const pageName = window.location.pathname.split("/").pop();
    switch (pageName) {
        case "plants.html": return "plants";
        case "lamps.html": return "lamps";
        case "statue.html": return "statue";
        case "wall.html": return "wall-hangings";
        default: return "";
    }
}

// **Call the function to load products**
loadProducts();
