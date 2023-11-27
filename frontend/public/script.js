const dropZone = document.getElementById("drop-zone");
        const browseButton = document.getElementById("browse-button");
        const fileInput = document.getElementById("file-input");

        async function handleFileSelection(event) {
            fileInput.click();
        }

        browseButton.addEventListener("click", handleFileSelection);


        // Prevent the default behavior of the browser when a file is dragged over the drop zone
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.style.border = "2px dashed #007BFF"; // Change the border color when hovering
        });

        // Restore the border color to its original state when the dragged item leaves the drop zone
        dropZone.addEventListener("dragleave", () => {
            dropZone.style.border = "2px dashed #ccc";
        });

        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                try {
                    // Display the uploaded image
                    await handleFileUpload(file);
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            else {
                alert("Please select a valid image file.");
            }
        });


        async function handleFileUpload(file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await fetch("http://localhost:8000/predict", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    const resultElement = document.getElementById("result");
                    resultElement.innerHTML = `
                               <p>Leaf condition: ${result["message"]}</p>
                               <p>Confidence: ${result["confidence"]}%</p>
                                `;
                    const uploadedImage = document.getElementById("uploaded-image");
                    uploadedImage.src = URL.createObjectURL(file);

                    // Show the image container
                    const imageContainer = document.getElementById("image-container");
                    imageContainer.style.display = "block";

                } else {
                    console.error("Error:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }


        // Handle the file drop event
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                handleFileUpload(file);
            } else {
                alert("Please drop a valid image file.");
            }
        });