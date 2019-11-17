function handleAdd(card) {

	//add cards to current card selection container
	addedCards.push(card);
	console.log(addedCards);
	// add element to DOM
      let tr = $("<tr></tr>")
        .addClass("card-in-list bg-secondary")
        .addClass(card.id);
      $("<td></td>")
        .append(card.name)
        .appendTo(tr);
      $("<td></td>")
        .append(card.manaCost)
        .appendTo(tr);
      $("<td></td>")
        .append(card.rarity)
        .appendTo(tr);
      let btn = $("<button></button>")
        .addClass("fas fa-minus-circle btn btn-sm btn-outline-danger")
        .attr("id", card.id)
        .attr("onclick", "handleDelete(event)");
      $("<td></td>")
        .append(btn)
        .appendTo(tr);
      $("#subgroup").append(tr)
}

async function handleDelete(event) {
  let id = event.target.id.trim();
  // remove element from DOM
  $("." + id).remove();
  // remove from server array
	addedCards = addedCards.filter(card => card.id.localeCompare(id) !== 0);
}

// async function handleReset() {
//   await axios
//     .post("reset/")
//     .then(() => {
//       if ("<%$(collection.cards).length  == 0%>") {
//         console.log("Reset Successfull");
//         location.reload();
//       }
//     })
//     .catch(err => console.log(err));
// }

async function handleAcceptChanges() {
	console.log(addedCards);
	await axios
		.post("add/", {addedCards:addedCards})
		.then(console.log("done!"))
		.catch(err => console.log(err))
  	location.reload();
}

function showHideLoader() {
  $(".loader").addClass("show");
}

$(document).ready(() => {
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
});
