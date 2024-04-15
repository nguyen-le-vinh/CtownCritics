// do not delete except for Desmond
function answerBoxTemplate(name, reviews, rating) {
  return `<div class='d-class'>
            <h3 class='restaurant-name'>${name}</h3>
            <p class='restaurant-reviews'>${reviews.toString()}</p>
            <p class='restaurant-rating'>Overall Rating: ${rating}</p>
        </div>`;
}

function errorMessage() {
  document.getElementById("answer-box").innerHTML = `<div class='d-class'>
            <h3 class='error'>No results available</h3>
         
        </div>`;
}

function filterText() {
  document.getElementById("answer-box").innerHTML = "";

  const locPreference1 = document.querySelector(
    'input[name="loc-preference1"]:checked'
  )?.value;
  const pricePreference1 = document.querySelector(
    'input[name="price-preference1"]:checked'
  )?.value;
  const foodPreference1 = document.getElementById("pref-food1")?.value;
  const qualityPreference1 = document.getElementById("pref-quality1")?.value;
  const restaurantPreference1 = document.getElementById("pref-restaurant1")?.value;
  const locPreference2 = document.querySelector(
    'input[name="loc-preference1"]:checked'
  )?.value;
  const pricePreference2 = document.querySelector(
    'input[name="price-preference1"]:checked'
  )?.value;
  const foodPreference2 = document.getElementById("pref-food1")?.value;
  const qualityPreference2 = document.getElementById("pref-quality1")?.value;
  const restaurantPreference2 = document.getElementById("pref-restaurant1")?.value;

  if (
    (locPreference1 !== null &&
    pricePreference1 !== null &&
    foodPreference1 !== null &&
    qualityPreference1 !== null) || (
    locPreference2 !== null &&
    pricePreference2 !== null &&
    foodPreference2 !== null &&
    qualityPreference2 !== null
    )
  ) {
    fetch(
      "/restaurants?" +
        new URLSearchParams({
          locPreference1,
          pricePreference1,
          foodPreference1,
          qualityPreference1,
          restaurantPreference1,
          locPreference2,
          pricePreference2,
          foodPreference2,
          qualityPreference2,
          restaurantPreference2,
        }).toString()
    )
      .then((response) => {
        if (!response.ok) {
          // throw new Error("Failed to fetch restaurants data");
          return;
        }
        return response.json();
      })
      .catch((err) => errorMessage())
      .then((data) => {
        if (data.results.length == 0) {
          h1.textContent = "Result(s)";
          document.getElementById("answer-box")
            .appendChild(`<div class='d-class'>
            <h3 class='restaurant-name'>No results available</h3>
           
        </div>`);
          return;
        }

        const h1Element = document.createElement("h1");
        h1Element.textContent = "Result(s)";
        h1Element.classList.add("result");
        document.getElementById("answer-box").appendChild(h1Element);

        data.results.forEach((row) => {
          const tempDiv = document.createElement("div");
        

          tempDiv.innerHTML = answerBoxTemplate(
            row.name,
            row.reviews,
            row.rating
          );

          document.getElementById("answer-box").appendChild(tempDiv);
        });
      })
      .catch((e) => {
        errorMessage();
      });
  } else {
    tempDiv.innerHTML = errorMessage();
  }
}

document.getElementById("submission-button").addEventListener("click", (e) => {
  e.preventDefault();
  filterText();
  const inputElement1 = document.getElementById("pref-food1");
  const inputElement2 = document.getElementById("pref-quality1");

  inputElement1.value = "";
  inputElement2.value = "";

  const radioButtons = document.querySelectorAll(
    'input[name="loc-preference1"]'
  );
  const radioButtonsPrice = document.querySelectorAll(
    'input[name="price-preference1"]'
  );

  radioButtons.forEach((radioButton) => {
    radioButton.checked = false;
  });
  radioButtonsPrice.forEach((radioButton) => {
    radioButton.checked = false;
  });
  const inputElement22 = document.getElementById("pref-food2");
  const inputElement222 = document.getElementById("pref-quality2");

  inputElement22.value = "";
  inputElement222.value = "";

  const radioButtons2 = document.querySelectorAll(
    'input[name="loc-preference2"]'
  );
  const radioButtonsPrice2 = document.querySelectorAll(
    'input[name="price-preference2"]'
  );

  radioButtons2.forEach((radioButton) => {
    radioButton.checked = false;
  });
  radioButtonsPrice2.forEach((radioButton) => {
    radioButton.checked = false;
  });
});
function showAllergyInputs() {
  var allergySelect = document.getElementById("allergy");
  var allergyInputs = document.getElementById("allergyInputs");
  var allergyTextboxes = document.getElementById("allergyTextboxes");

  if (allergySelect.value === "yes") {
    allergyInputs.style.display = "block";
    allergyTextboxes.innerHTML = "";

    var numAllergies = document.getElementById("numAllergies").value;
    for (var i = 0; i < numAllergies; i++) {
      var input = document.createElement("input");
      input.type = "text";
      input.name = "allergy" + (i + 1);
      input.placeholder = "Enter allergy " + (i + 1);
      allergyTextboxes.appendChild(input);
    }
    let x = document
      .getElementById("numAllergies")
      .addEventListener("input", function () {
        var newNumAllergies = Math.min(5, parseInt(this.value));
        var currentNumAllergies = allergyTextboxes.children.length;

        if (newNumAllergies > currentNumAllergies) {
          for (var i = currentNumAllergies; i < newNumAllergies; i++) {
            var input = document.createElement("input");
            input.type = "text";
            input.name = "allergy" + (i + 1);
            input.placeholder = "Enter allergy " + (i + 1);
            allergyTextboxes.appendChild(input);
          }
        } else if (newNumAllergies < currentNumAllergies) {
          for (var i = currentNumAllergies - 1; i >= newNumAllergies; i--) {
            allergyTextboxes.removeChild(allergyTextboxes.children[i]);
          }
        }
      });
  } else {
    allergyInputs.style.display = "none";
    allergyTextboxes.innerHTML = "";
  }
}



/*function answerBoxTemplate(name, reviews, rating) {
  return `<div class='d-class'>
            <h3 class='restaurant-name'>${name}</h3>
            <p class='restaurant-reviews'>${reviews.toString()}</p>
            <p class='restaurant-rating'>Overall Rating: ${rating}</p>
        </div>`;
}

function errorMessage() {
  document.getElementById("answer-box").innerHTML = `<div class='d-class'>
            <h3 class='error'>No results available</h3>
         
        </div>`;
}

function filterText() {
  document.getElementById("answer-box").innerHTML = "";
  const allFormsData = [];
  var numForms = document.getElementById("num").value;
  for (let i = 0; i < numForms; i++) {
    const locPreference = document.querySelector(
      `input[name="loc-preference${i}"]:checked`
    )?.value;
    const pricePreference = document.querySelector(
      `input[name="price-preference${i}"]:checked`
    )?.value;
    const foodPreference = document.getElementById(`pref-food${i}`)?.value;
    const qualityPreference = document.getElementById(`pref-quality${i}`)?.value;

    // Add the collected data to the array
    allFormsData.push({
      locPreference,
      pricePreference,
      foodPreference,
      qualityPreference,
    });
  }

  if (
    locPreference !== null &&
    pricePreference !== null &&
    foodPreference !== null &&
    qualityPreference !== null
  ) {
    fetch('/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allFormsData),
    })
      .then((response) => {
        console.log("log")
        if (!response.ok) {
          // throw new Error("Failed to fetch restaurants data");
          return;
        }
        return response.json();
      })
      .catch((err) => errorMessage())
      .then((data) => {
        if (data.results.length == 0) {
          h1.textContent = "Result(s)";
          document.getElementById("answer-box")
            .appendChild(`<div class='d-class'>
            <h3 class='restaurant-name'>No results available</h3>
           
        </div>`);
          return;
        }

        const h1Element = document.createElement("h1");
        h1Element.textContent = "Result(s)";
        h1Element.classList.add("result");
        document.getElementById("answer-box").appendChild(h1Element);

        data.results.forEach((row) => {
          const tempDiv = document.createElement("div");
        

          tempDiv.innerHTML = answerBoxTemplate(
            row.name,
            row.reviews,
            row.rating
          );

          document.getElementById("answer-box").appendChild(tempDiv);
        });
      })
      .catch((e) => {
        errorMessage();
      });
  } else {
    tempDiv.innerHTML = errorMessage();
  }
}

document.getElementById("submission-button").addEventListener("click", (e) => { //This line is broken because
  //the submit button does not exist when the page opens
  e.preventDefault();
  filterText();
  var numForms = document.getElementById("num").value;
  for (let i = 0; i < numForms; i++) {
    const inputElement = document.getElementById(`pref-food${i}`);
    const inputElement2 = document.getElementById(`pref-quality${i}`);

    inputElement.value = "";
    inputElement2.value = "";

    const radioButtons = document.querySelectorAll(
      'input[name="loc-preference${i}"]'
    );
    const radioButtonsPrice = document.querySelectorAll(
      'input[name="price-preference${i}"]'
    );

    radioButtons.forEach((radioButton) => {
      radioButton.checked = false;
    });
    radioButtonsPrice.forEach((radioButton) => {
      radioButton.checked = false;
    });
  }
});
function showAllergyInputs() {
  var allergySelect = document.getElementById("allergy");
  var allergyInputs = document.getElementById("allergyInputs");
  var allergyTextboxes = document.getElementById("allergyTextboxes");

  if (allergySelect.value === "yes") {
    allergyInputs.style.display = "block";
    allergyTextboxes.innerHTML = "";

    var numAllergies = document.getElementById("numAllergies").value;
    for (var i = 0; i < numAllergies; i++) {
      var input = document.createElement("input");
      input.type = "text";
      input.name = "allergy" + (i + 1);
      input.placeholder = "Enter allergy " + (i + 1);
      allergyTextboxes.appendChild(input);
    }
    let x = document
      .getElementById("numAllergies")
      .addEventListener("input", function () {
        var newNumAllergies = Math.min(5, parseInt(this.value));
        var currentNumAllergies = allergyTextboxes.children.length;

        if (newNumAllergies > currentNumAllergies) {
          for (var i = currentNumAllergies; i < newNumAllergies; i++) {
            var input = document.createElement("input");
            input.type = "text";
            input.name = "allergy" + (i + 1);
            input.placeholder = "Enter allergy " + (i + 1);
            allergyTextboxes.appendChild(input);
          }
        } else if (newNumAllergies < currentNumAllergies) {
          for (var i = currentNumAllergies - 1; i >= newNumAllergies; i--) {
            allergyTextboxes.removeChild(allergyTextboxes.children[i]);
          }
        }
      });
  } else {
    allergyInputs.style.display = "none";
    allergyTextboxes.innerHTML = "";
  }
}

function createForms() {
  var numForms = document.getElementById("num").value;
  var formBox = document.getElementById("form-box");
  var submitCont = document.getElementById("submit-container")
  submitCont.innerHTML = '';
  formBox.innerHTML = '';
  for (var i = 0; i < numForms; i++) {
    formBox.innerHTML += `<div class="input-form">
    <div class="location-container">
      <h3 id="form-header">Choose your preferred location?</h3>
      <input
        type="radio"
        value="CTown"
        class="radio-label"
        name="loc-preference${i}"
        id="loc-ctown"
      />
      <label for="CTown">CTown</label>
      <input
        type="radio"
        class="radio-label"
        value="On Campus"
        name="loc-preference${i}"
        id="loc-campus"
      />
      <label for="On Campus">On Campus</label>
      <input
        type="radio"
        value="No Preference"
        class="radio-label"
        name="loc-preference${i}"
        id="loc-none"
      />
      <label for="No Preference">No Preference</label>
    </div>
    <div class="price-container">
      <h3 id="form-header">Choose your preferred price point(s)?</h3>
      <input
        type="checkbox"
        value="Low"
        name="price-preference"
        id="price-low"
      />
      <label for="Low">Low</label>
      <input
        type="checkbox"
        value="Medium"
        name="price-preference"
        id="price-med"
      />
      <label for="Medium">Medium</label>
      <input
        type="checkbox"
        value="High"
        name="price-preference"
        id="price-high"
      />
      <label for="High">High</label>
    </div>
    <div class="dietary-container">
      <h3 id="form-header">Choose your dietary restriction(s)?</h3>
      <div class="checkbox-grid">
        <div>
          <input
            type="checkbox"
            value="Lactose intolerance"
            name="price-preference"
            id="lactose"
          />

          <label for="Lactose intolerance">Lactose intolerance</label>
        </div>
        <div>
          <input
            type="checkbox"
            value="Gluten intolerance"
            name="price-preference"
            id="gluten"
          />

          <label for="Gluten intolerance">Gluten intolerance</label>
        </div>
        <div>
          <input
            type="checkbox"
            value="Vegetarian"
            name="price-preference"
            id="vegetarian"
          />

          <label for="Vegetarian">Vegetarian</label>
        </div>
        <div>
          <input
            type="checkbox"
            value="Vegan"
            name="price-preference"
            id="vegan"
          />

          <label for="Vegan">Vegan</label>
        </div>
        <div>
          <input
            type="checkbox"
            value="Vegetarian"
            name="price-preference"
            id="vegetarian"
          />

          <label for="Vegetarian">Vegetarian</label>
        </div>
      </div>
    </div>
    <div class="food-container">
      <h3 id="form-header">What type of food do you want?</h3>
      <input
        type="text"
        placeholder="ex: Indian"
        name="food-preference"
        id="pref-food${i}"
      />
      <div class="container">
        <form id="allergyForm">
          <label for="allergy">Do you have any food allergies?</label>
          <select id="allergy" onchange="showAllergyInputs()">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          <div id="allergyInputs" style="display: none">
            <label for="numAllergies"
              >How many allergies do you have? (Limit: 5)</label
            >
            <input
              type="number"
              id="numAllergies"
              name="numAllergies"
              min="0"
              max="5"
            />
            <div id="allergyTextboxes"></div>
          </div>
        </form>
      </div>
    </div>

    <div class="final">
      <h3 id="form-header">
        What key qualities are you looking for in your choices of
        restaurants?
      </h3>
      <input
        type="text"
        placeholder="ex: good value, decent service, etc."
        name="quality-preference"
        id="pref-quality${i}"
      />

      <h3 id="form-header">
        What other restaurants do you want your choices to match?
      </h3>
      <input
        type="text"
        placeholder="ex: Sangnam Indian Cuisine, Four Seasons, etc."
        name="restaurant-preference"
        id="pref-restaurant"
      />
    </div>`;
  }
  submitCont.innerHTML += `<input type="button" value="Submit" id="submission-button" />`
}*/
