const draftSection = document.getElementById('draftSection');
const draftMessage = document.getElementById('draftLimit');
const addDraft = document.getElementById('addDraft');

var counter = 0;

addDraft.addEventListener('click', addDraftElement);

export function addDraftElement() {
   if (counter == 4) {
      draftMessage.style.display = 'inline';
   } else {
      draftSection.innerHTML += `<input type="file" id="draftImage${counter}" name="image" accept="image/png, image/jpeg" required/><br />`;
      counter++;
   }
}

var el = document.getElementById('pieceSubmit');
if (document.getElementById('pieceSubmit')) {
   el.addEventListener('click', async function (e) {
      e.preventDefault();

      document
         .querySelector('.lds-roller')
         .setAttribute('style', 'z-index: 1;');
      document
         .querySelector('#pieceSubmit')
         .setAttribute('style', 'display: none;');

      let headersList = {
         Accept: '*/*',
      };
      const id = sessionStorage.getItem('_id');

      let bodyContent = new FormData();

      //fd.append("file", document.getElementById('file1').files[0]);

      bodyContent.append('title', document.getElementById('title').value);
      bodyContent.append(
         'aboutBody',
         document.getElementById('aboutBody').value
      );
      bodyContent.append('medium', document.getElementById('medium').value);

      if (document.getElementById('isFavorite').value == 'true') {
         bodyContent.append(
            'isFavorite', 'true'
         );
      } else {
         bodyContent.append('isFavorite', 'false');
      }

      bodyContent.append('isCover', 'false');

      bodyContent.append(
         'image',
         document.getElementById('mainPicture').files[0]
      );

      for (let i = 0; i < counter; i++) {
         bodyContent.append(
            'image',
            document.getElementById('draftImage' + i).files[0]
         );
      }

      let response = await fetch(
         'https://artportfolio.onrender.com/api/newpiece/' + id,
         {
            method: 'PATCH',
            body: bodyContent,
            headers: headersList,
         }
      );

      let data = await response.json();
      if (data.success != false) {
         window.location.replace('../newPiece/pieceUploaded.html');
      }
   });
}
