// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the form and image input elements
  const form = document.querySelector("form");
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("preview");

  // When the user selects an image, show a preview
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a file reader
      reader.onload = e => {
        preview.src = e.target.result; // Set preview image source
        preview.style.display = "block"; // Show the preview image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      preview.style.display = "none"; // Hide preview if no file
    }
  });

  // When the form is submitted, check the inputs
  form.addEventListener("submit", e => {
    // Get values from the form
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);

    // Check if values are valid
    if (!title || !description || isNaN(price) || price <= 0 || isNaN(quantity) || quantity < 1) {
      alert("Please fill out all fields correctly."); // Show error message
      e.preventDefault(); // Stop the form from submitting
    }
  });
});