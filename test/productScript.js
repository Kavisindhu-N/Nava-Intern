async function loadProducts() {
    const category = getCategoryFromPage(); // Identify category from page
    const productsContainer = document.querySelector(".products-container");

        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();

        const filteredProducts = products.filter(product => product.category === category);

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
            // productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
                
            //         const cartResponse = await fetch("http://localhost:3000/cart", {
            //             method: "POST",
            //             headers: { "Content-Type": "application/json" },
            //             body: JSON.stringify(product)
            //         });

            //         alert("Product added to cart successfully!");
    
            // });


            productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
                const cartItem = { productId: product.id }; // Store only the productId
            
                const cartResponse = await fetch("http://localhost:3000/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cartItem),
                });
            
                alert("Product added to cart successfully!");
            });
            

            productsContainer.appendChild(productDiv);
        });
   
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
