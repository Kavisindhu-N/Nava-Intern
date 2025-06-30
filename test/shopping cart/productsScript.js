//Intial Load to display the products*****************************************************************************
async function loadProducts() {
    const category = getCategoryFromPage(); // Identify category from page
    const productsContainer = document.querySelector(".products-container");

    try {
        //Fetching products from DB
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error("Failed to fetch products.");
        const products = await response.json();

        //Filters the product that is mached to the corresponding page
        const filteredProducts = products.filter(product => product.category === category);
        console.log("Corresponding Category products :", filteredProducts);

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<p>No products available.</p>";
            return;
        }

        //Displaying in the UI
        filteredProducts.map(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("new-product");

            productDiv.innerHTML = `
                <div class="imgcont"><img src="${product.productImage}" alt="${product.productName}"></div>
                <p class="product-name">${product.productName}</p>
                <p class="product-price">₹${product.productPrice}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;

            //Adding the product in the Logged In user's cart 
            productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
                let userId = localStorage.getItem("loggedInUser");

                try {
                    //fetching the Logged In User
                    const resUser = await fetch(`http://localhost:3000/users/${userId}`);
                    if (!resUser.ok) throw new Error("Failed to fetch user data.");

                    const user = await resUser.json();

                    //Checking whether the product is already in the cart or not
                    const existingItem = user.cart.find(item => item.productId === product.id);
                    if (existingItem) {
                        alert("Product is already in your cart.");
                        return;
                    }
                    //If the product is not already in the cart
                    user.cart.push({
                        productId: product.id,
                        productName: product.productName,
                        productPrice: product.productPrice,
                        productImage: product.productImage
                    });

                    const updateRes = await fetch(`http://localhost:3000/users/${userId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(user)
                    });

                    if (!updateRes.ok) throw new Error("Failed to update cart.");

                    alert("Product added to cart successfully!");
                } catch (err) {
                    console.error("Cart Error:", err);
                    alert(err.message);
                }
            });

            productsContainer.appendChild(productDiv);
        });

    } catch (err) {
        console.error("Product Load Error:", err);
        productsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

// Identify category based on the current page
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

loadProducts();
