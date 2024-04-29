// do not delete except for Desmond
function answerBoxTemplate(name, reviews, rating, location, restrictions, dimensions) {
  if (restrictions.toString() == "") {
    const dimensionsString = dimensions.join(', '); 
    return `<div class='d-class'>
            <h3 class='restaurant-name'>${name}</h3>
            <p class='restaurant-reviews'>${reviews.toString()}</p>
            <p class='restaurant-rating'>Overall Rating: ${rating}</p>
            <p class='restaurant-rating'><span class="explanation">Location: </span>${location}</p>
            <p class='restaurant-rating'><span class="explanation">Matches your query along the following dimensions: </span>${dimensionsString.replace(/, ,/g, "")}</p>
        </div>`;
  } else {
    const restrictionsString = restrictions.join(', ');
    const dimensionsString = dimensions.join(', ');
    return `<div class='d-class'>
              <h3 class='restaurant-name'>${name}</h3>
              <p class='restaurant-reviews'>${reviews.toString()}</p>
              <p class='restaurant-rating'>Overall Rating: ${rating}</p>
              <p class='restaurant-rating'><span class="explanation">Location: </span>${location}</p>
              <p class='restaurant-rating'><span class="explanation">Accomodates the following dietary restrictions: </span>${restrictionsString}</p>
              <p class='restaurant-rating'><span class="explanation">Matches your query along the following dimensions: </span>${dimensionsString.replace(/, ,/g, "")}</p>
          </div>`;
  }
}

function errorMessage() {
  document.getElementById("answer-box").innerHTML = `<div class='d-class'>
            <h3 class='error'>No results available</h3>
         
        </div>`;
}

function filterText() {
  document.getElementById("answer-box").innerHTML = "";

  let locPreferences = '';

  for (let i = 1; i <= 3; i++) {
    const inputName = `loc-preference${i}`;
    const checkedInput = document.querySelector(`input[name="${inputName}"]:checked`);
    if (checkedInput) {
      if (i > 1) {
        locPreferences += ',' + checkedInput.value;
      } else {
        locPreferences += checkedInput.value;
      }
    }
  }
  console.log(locPreferences);
  

  let dietaryRstrctns = '';

  for (let i = 1; i <= 3; i++) {
    const inputName = `dietary-restrictions${i}`;
    const checkedInputs = Array.from(document.querySelectorAll(`input[name="${inputName}"]:checked`));
    if (checkedInputs != null) {
      let inputNum = 0;
      checkedInputs.forEach((input) => {
        inputNum += 1;
        if (i > 1) {
          dietaryRstrctns += ',' + input.value;
        } else if (i == 1 && inputNum > 1) {
          dietaryRstrctns += ',' + input.value;
        } else {
          dietaryRstrctns += input.value;
        }
      });
    }
  }
  console.log(dietaryRstrctns);
 

  let foodPreferences = '';
  for (let i = 1; i <= 3; i++) {
    const foodPref = document.getElementById(`pref-food${i}`)?.value;
    if (foodPref) {
      if (i > 1) {
        foodPreferences += ' ' + foodPref;
      } else {
        foodPreferences += foodPref;
      }
    }
  }
  console.log(foodPreferences);


  const qualityPreference = document.getElementById("pref-quality")?.value;
  console.log(qualityPreference);
  const restaurantPreference =
    document.getElementById("pref-restaurant")?.value;
  console.log(restaurantPreference);


  if (
    (locPreferences != null &&
      foodPreferences != null &&
      qualityPreference != null)
  ) {
    fetch(
      "/restaurants?" +
        new URLSearchParams({
          locPreferences,
          dietaryRstrctns,
          foodPreferences,
          qualityPreference,
          restaurantPreference,
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
            row.rating,
            row.location,
            row.restrictions,
            row.dimensions
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
  const inputElement1 = document.getElementById("pref-restaurant");
  const inputElement2 = document.getElementById("pref-quality");

  inputElement1.value = "";
  inputElement2.value = "";
  for (let i = 1; i <= 3; i++) {
    const foodPref = document.getElementById(`pref-food${i}`);
    if (foodPref) {
      foodPref.value = "";
    }
  }

  for (let i = 1; i <= 3; i++) {
    let btns = Array.from(document.querySelectorAll(`input[name="loc-preference${i}"]`));
      if (btns != null) {
        btns.forEach((btn) => {
          btn.checked = false;
        });
      }
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

function repeatElements(arr, n) {
  let newArr = [];
  arr.forEach((element) => {
    for (let i = 0; i < n; i++) {
      let newElm = element.cloneNode(true);
      let inputs = Array.from(newElm.querySelectorAll('input'));
      if (inputs != null) {
        inputs.forEach((input) => {
          input.id = input.id + (i+1);
          input.name = input.name + (i+1);
        });
      }
      newArr.push(newElm);
    }
  });
  return newArr;
}

function createRepeatedForm(repeatValue) {
  const inputForm = document.querySelector(".input-form");
  const finalForm = document.querySelector(".final");
  const repeatForm = document.querySelector("#repeat-form");
  const submitBtn = document.querySelector("#submit-container");
  const children = Array.from(inputForm.children);

  const repeatedChildren = repeatElements(children, repeatValue);

  inputForm.innerHTML = "";

  repeatedChildren.forEach((child) => {
    inputForm.appendChild(child);
  });

  inputForm.style.display = "block";
  finalForm.style.display = "block";
  submitBtn.style.display = "block";
  repeatForm.style.display = "none";
}

document
  .getElementById("repeat-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const repeatValue = parseInt(document.getElementById("repeat-value").value);
    if (repeatValue >= 1 && repeatValue <= 3) {
      createRepeatedForm(repeatValue);
    } else {
      alert("Please enter a number between 1 and 3.");
    }
  });
