const url = "http://localhost:3000/notes";
// Get all Notes
async function getNotes() {
  const res = await fetch(url);
  const body = await res.json();
  return body;
}

// get a single note using its id
async function getNote(id) {
  const note = await fetch(`${url}/${id}`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return { title: note.title, desc: note.desc };
}

// Show Notes
async function showNotes() {
  const notes = await getNotes();
  const row = document.querySelector(".row");

  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "col-lg-4 col-md-6 col-sm-12 my-3";
    div.innerHTML = `
      <div class="card py-4 shadow px-4 border">
        <h2> ${note.title}</h2>
        <p> ${note.desc}</p>
        <hr class="w-25 mx-auto" />
        <button 
          type="button"
          class="btn btn-dark mx-auto mb-2" 
          data-bs-toggle="modal" 
          data-bs-target="#viewNote-Modal"
          data-id=${note.id}
        >
          View Note
        </button>
        <div class="d-flex flex-column flex-sm-row gap-3 gap-lg-2 gap-xl-3 justify-content-between align-items-center">
          <button type="button" class="btn btn-danger col" onclick="deleteNote('${note.id}')">
            Delete Note
          </button>
          <button
            type="button"
            class="btn btn-outline-dark col"
            data-bs-toggle="modal"
            data-bs-target="#modifyModal"
            data-id=${note.id}
          >
            Modify Note
          </button>
        </div>
      </div>

    `;
    row.appendChild(div);
  });
}

// add a new note
function addNote() {
  const titleValue = document.querySelector("#newNoteTitle").value;
  const descValue = document.querySelector("#newNoteDesc").value;
  if (!titleValue) {
    console.error("title is empty");
  } else {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        title: titleValue,
        desc: descValue,
      }),
      headers: {
        "Content-type": "application/json ; charset=UTF-8",
      },
    }).catch((err) => {
      console.log(err);
    });
  }
}

// delete existing note
function deleteNote(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  });
}

// modify existing note
function modifyNote(id) {
  const titleValue = document.querySelector("#mod-note-title").value;
  const descValue = document.querySelector("#mod-note-desc").value;

  fetch(`${url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: titleValue ? titleValue : this.title,
      desc: descValue ? descValue : this.desc,
    }),
    headers: {
      "Content-type": "application/json ; charset=UTF-8",
    },
  }).catch((err) => {
    console.log(err);
  });
}

// loading all notes once the dom is loaded
document.addEventListener("DOMContentLoaded", showNotes);

// calling add note to add a new note
const addNoteForm = document.querySelector("#addNoteForm");
addNoteForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addNote;
  document.forms["addNoteForm"].reset();
});

// calling modify note
const modifingModal = document.getElementById("modifyModal");
const saveChangesButton = document.getElementById("saveChangesButton");
modifingModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  const modifyButton = event.relatedTarget;
  // note id from data-id
  const id = modifyButton.dataset.id;
  saveChangesButton.addEventListener("click", () => {
    modifyNote(id);
    document.forms["modifyNoteForm"].reset();
  });
});

// calling view note
const viewNoteModal = document.getElementById("viewNote-Modal");
const viewNoteModalTitle = document.getElementById("viewModal-note-title");
const viewNoteModalDesc = document.getElementById("viewModal-note-desc");
viewNoteModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  const modifyButton = event.relatedTarget;
  // note id from data-id
  const id = modifyButton.dataset.id;

  const note = getNote(id);
  note.then((res) => {
    viewNoteModalTitle.textContent = res.title;
    viewNoteModalDesc.textContent = res.desc;
  });
});
