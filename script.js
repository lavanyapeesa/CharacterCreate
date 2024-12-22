document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('character-form');
    const characterList = document.getElementById("character-list");
    const searchBar = document.getElementById('search-bar');
    const addTraitButton = document.getElementById("add-trait");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const raceFilter = document.getElementById('race-filter');
    const ageFilter = document.getElementById('age-filter');
    const genderFilter = document.getElementById('gender-filter');
    const sortBy = document.getElementById('sort-by');

    // Load characters on page load
    loadCharacters();

    function saveCharacter(character) {
        const characters = JSON.parse(localStorage.getItem("characters")) || [];
        characters.push(character);
        localStorage.setItem("characters", JSON.stringify(characters));
    }

    function updateCharacter(index, updatedCharacter) {
        const characters = JSON.parse(localStorage.getItem("characters")) || [];
        characters[index] = updatedCharacter;
        localStorage.setItem("characters", JSON.stringify(characters));
    }

    function deleteCharacter(index) {
        const characters = JSON.parse(localStorage.getItem("characters")) || [];
        characters.splice(index, 1);
        localStorage.setItem("characters", JSON.stringify(characters));
        loadCharacters();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.name.value;
        const age = form.age.value;
        const description = form.description.value;
        const gender = form.gender.value;
        const race = form.race.value;
        const traits = Array.from(form.querySelectorAll('.traits-input')).map(input => input.value).filter(value => value.trim() !== '');
        const image = form.image.files[0] ? URL.createObjectURL(form.image.files[0]) : null;
        const customDialogue = form.customDialogue.value.trim(); // Custom dialogue

        const character = { name, age, description, gender, race, traits, image, customDialogue };

        saveCharacter(character);
        loadCharacters();

        form.reset();
        resetTraitInputs();
        clearImagePreview();
    });

    function loadCharacters() {
        const characters = JSON.parse(localStorage.getItem("characters")) || [];
        characterList.innerHTML = '';
        characters.forEach((character, index) => {
            addCharacterToPortfolio(character, index);
        });
    }

    function addCharacterToPortfolio(character, index) {
        const traitsText = Array.isArray(character.traits) ? character.traits.join(', ') : '';
        const customDialogueText = character.customDialogue || 'No custom dialogue provided.';

        const characterCard = `
            <div class="bg-white p-6 rounded-lg shadow-lg mb-4" data-index="${index}">
                <h2 class="text-2xl font-semibold">${character.name}</h2>
                <p><strong>Age:</strong> ${character.age}</p>
                <p><strong>Description:</strong> ${character.description}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Race:</strong> ${character.race}</p>
                <p><strong>Traits:</strong> ${traitsText}</p>
                ${character.image ? `<img src="${character.image}" alt="${character.name}" class="w-full h-32 object-cover rounded-lg">` : ''}
                <p><strong>Custom Dialogue:</strong> ${customDialogueText}</p>
                <div class="mt-4">
                    <button class="edit-character bg-blue-500 text-white py-2 px-4 rounded">Edit</button>
                    <button class="delete-character bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                    <button class="generate-dialogue bg-green-500 text-white py-2 px-4 rounded mt-2">Generate Dialogue</button>
                </div>
            </div>
        `;
        characterList.innerHTML += characterCard;
    }

    characterList.addEventListener('click', function (e) {
        const index = e.target.closest("[data-index]").dataset.index;
        const characters = JSON.parse(localStorage.getItem("characters"));

        if (e.target.classList.contains("delete-character")) {
            deleteCharacter(index);
        } else if (e.target.classList.contains("edit-character")) {
            const character = characters[index];
            form.name.value = character.name;
            form.age.value = character.age;
            form.description.value = character.description;
            form.gender.value = character.gender;
            form.race.value = character.race;
            form.customDialogue.value = character.customDialogue || ''; // Pre-fill custom dialogue

            resetTraitInputs();
            character.traits.forEach(trait => addTraitInput(trait));
            clearImagePreview();
        } else if (e.target.classList.contains("generate-dialogue")) {
            const dialogue = generateDialogue(characters[index]);
            alert(dialogue);
        }
    });

    function generateDialogue(character) {
        const dialogueStarters = {
            Friendly: "Hey there! Let's be friends!",
            Brave: "I fear no challenge!",
            Wise: "Knowledge is the key to power.",
            Curious: "I wonder what lies ahead...",
        };

        return character.traits.map(trait => dialogueStarters[trait] || "Hello!").join(' ');
    }

    searchBar.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase();
        const characters = JSON.parse(localStorage.getItem("characters")) || [];
        const filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(query));
        displayFilteredCharacters(filteredCharacters);
    });

    function displayFilteredCharacters(characters) {
        characterList.innerHTML = '';
        characters.forEach((character, index) => addCharacterToPortfolio(character, index));
    }

    function resetTraitInputs() {
        const traitContainer = document.querySelector(".traits-container");
        traitContainer.innerHTML = '';
        addTraitInput();
    }

    function addTraitInput(value = "") {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('traits-input');
        input.value = value;
        document.querySelector('.traits-container').appendChild(input);
    }

    addTraitButton.addEventListener("click", function () {
        addTraitInput();
    });

    function clearImagePreview() {
        imagePreviewContainer.innerHTML = '';
    }

    // Image preview functionality
    const imageInput = form.querySelector("#image");
    imageInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                // Clear previous preview
                clearImagePreview();
                // Create new image element
                const img = document.createElement("img");
                img.src = event.target.result;
                img.classList.add("w-full", "h-32", "object-cover", "rounded-lg");
                imagePreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});
