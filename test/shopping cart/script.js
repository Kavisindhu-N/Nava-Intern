//Function to redirect to user detils
function displayUserDetails() {
    window.location.href = "userDetails.html";
}


// log out button
const logOutButton = document.getElementById("logOutButton");
logOutButton.addEventListener("click", () => {
    window.location.href = "loginandsignup.html"
});


// Fetch products from JSON database and display on page load ***************************************************
async function loadProducts() {

    try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();
        // console.log("Fetched products from the DB on Page load :" ,products);

        // Populate the UI with products
        products.map(addProductToUI);   //addProductToUI(products[0]);
    } catch (error) {
        console.error("Error loading products:", error);
        alert("Failed to load products. Please try again later.");
    }


}

// This function will be executed when the page gets refreshed
document.addEventListener("DOMContentLoaded", loadProducts);





// Visibility of category-section ********************************************************************************
// let selectedCategory = "";

const buttons = document.querySelectorAll(".dropdown-content > button");
console.log("drop down buttons to select category : ", buttons);

const allSections = document.querySelectorAll(".category-section");
console.log("plants,statue,wall,lamps", allSections);

// Hide all sections initially
allSections.forEach(section => section.classList.add("hidden"));

buttons.forEach(button => {     //buttons is a node list so loop it to add the click event
    button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Get category name in lowercase with hyphens 
        let selectedCategory = this.textContent.trim().toLowerCase().replace(/\s+/g, "-");
        console.log(selectedCategory); //it matches my category section #id

        // Hide all category sections
        allSections.forEach(section => section.classList.add("hidden"));

        // Show the selected category section
        const targetSection = document.getElementById(selectedCategory);
        if (targetSection) {
            console.log("selectedCategory :", targetSection);
            targetSection.classList.remove("hidden");
        }
    });
});





// Image Preview ************************************************************************************************
let imageBase64 = ""; // Variable to store the image

document.getElementById("imageInput").addEventListener("change", function (event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result; // Display preview
            imageBase64 = e.target.result; // Store Base64 string in variable
        };
        reader.readAsDataURL(file);
    }
});





// Add Product button for popup *********************************************************************************
const addProductPopup = document.querySelector(".overlay");
addProductPopup.style.display = "none"; // Hide initially

const addProductButtons = document.querySelectorAll(".category-section > div > button");

addProductButtons.forEach(button => {
    button.addEventListener("click", function () {
        addProductPopup.style.display = "block"; //shows the overlay and the form
        console.log("Popup displayed");
    });
});





// Cancel button to clear the input fields and close the popup ***************************************************
document.getElementById("cancelPopup").addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    resetForm();
});

// Reset form function
function resetForm() {
    document.getElementById("imageInput").value = "";
    document.getElementById("previewImage").src = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    addProductPopup.style.display = "none";
    editingProductId = null; // Reset edit mode
}






// Global variable to track editing product ID
let editingProductId = null;   //ID of the product being edited





// Save Button Click Event (Handles Both Add & Edit) ************************************************************
const saveButton = document.getElementById("saveProduct");
saveButton.addEventListener("click", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const productName = document.getElementById("productName").value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const category = document.querySelector(".category-section:not(.hidden)").id;
    const productImage = imageBase64;

    //cheking the missing fields
    if (!productName || !productPrice || !productImage) {
        alert("Please fill in all fields!");
        return;
    }

    //editingProductId is not null this block will get executed

    try {
        if (editingProductId) {
            const updatedProduct = {
                id: editingProductId,
                category: category,
                productName: productName,
                productPrice: productPrice,
                productImage: productImage
            };

            const response = await fetch(`http://localhost:3000/products/${editingProductId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                alert("Error updating product!");
                return;
            }
            alert("Product updated successfully");
            updateProductInUI(updatedProduct); //object is passed as argument
        } else {
            // **Add new product (Add mode)** //if editingProductId is null
            const newProduct = { // creating an object with the product details
                id: Date.now().toString(),
                category: category,
                productName: productName,
                productPrice: productPrice,
                productImage: productImage
            };

            const response = await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                alert("Error saving product!");
                return;
            }

            alert("Product added successfully");
            addProductToUI(newProduct);
        }
    } catch {
        console.error("Error saving product:", error);
        alert("Failed to save product. Please try again.");
    }


    resetForm();
});





// **Update UI after Editing*************************************************************************************
function updateProductInUI(updatedProduct) {
    const productDiv = document.querySelector(`[data-id='${updatedProduct.id}']`);
    if (!productDiv) return;

    productDiv.querySelector("img").src = updatedProduct.productImage;
    productDiv.querySelector(".product-name").textContent = updatedProduct.productName;
    productDiv.querySelector(".product-price").textContent = `₹${updatedProduct.productPrice}`;

    // Update the edit button event listener with the latest data
    productDiv.querySelector(".edit-btn").onclick = () => editProduct(updatedProduct); //updatedProduct =>object
}





// Add Product to UI Function ***********************************************************************************
function addProductToUI(product) {
    const categorySection = document.getElementById(product.category); // Finding and selecting the Category Section
    console.log("Add new product in the :", categorySection);

    const productContainer = categorySection.querySelector(".products-container");
    console.log(productContainer);

    const productDiv = document.createElement("div");
    productDiv.classList.add("new-product");
    productDiv.setAttribute("data-id", product.id); //Definig ID for (editing or deleting)

    productDiv.innerHTML = `
        <div class="imgcont"><img src="${product.productImage}" alt="${product.productName}"></div>
        <p class="product-name">${product.productName}</p>
        <p class="product-price">₹${product.productPrice}</p>
        <div class="ed-buttons">
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
        </div>
    `;

    productContainer.appendChild(productDiv);

    // Attach event listeners for Edit and Delete buttons
    productDiv.querySelector(".edit-btn").addEventListener("click", () => {
        editProduct(product);
        console.log("product being edited",product)
    });
    productDiv.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(product.id, productDiv));
}





// Edit Product Functionality ***********************************************************************************
function editProduct(product) {
    addProductPopup.style.display = "block";
    document.getElementById("productName").value = product.productName;
    document.getElementById("productPrice").value = product.productPrice;
    document.getElementById("previewImage").src = product.productImage;
    imageBase64 = product.productImage;
    editingProductId = product.id; // Store the editing product ID
    console.log("Editing product:", editingProductId);
}





// Delete Product Functionality**********************************************************************************
async function deleteProduct(productId, productDiv) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error(`error! Status: ${response.status}`);

        alert("Product deleted successfully");
        productDiv.remove();
    } catch (error) {
        console.error("Error deleting product:", error);
        console.log(error.message);
        alert("Failed to delete product. Please try again.");
    }
}


































