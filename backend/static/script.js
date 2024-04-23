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
  const restaurantPreference1 =
    document.getElementById("pref-restaurant1")?.value;
  const locPreference2 = document.querySelector(
    'input[name="loc-preference1"]:checked'
  )?.value;
  const pricePreference2 = document.querySelector(
    'input[name="price-preference1"]:checked'
  )?.value;
  const foodPreference2 = document.getElementById("pref-food1")?.value;
  const qualityPreference2 = document.getElementById("pref-quality1")?.value;
  const restaurantPreference2 =
    document.getElementById("pref-restaurant1")?.value;

  if (
    (locPreference1 !== null &&
      pricePreference1 !== null &&
      foodPreference1 !== null &&
      qualityPreference1 !== null) ||
    (locPreference2 !== null &&
      pricePreference2 !== null &&
      foodPreference2 !== null &&
      qualityPreference2 !== null)
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

function repeatElements(arr, n) {
  let newArr = [];
  arr.forEach((element) => {
    for (let i = 0; i < n; i++) {
      newArr.push(element.cloneNode(true));
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
