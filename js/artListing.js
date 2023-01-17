import { checkStatus } from './admin.js';

export default class ArtListing {
   constructor(dataSource) {
      this.dataSource = dataSource;
   }

   async init() {
      const list = await this.dataSource.getOwnersData();

      const template = document.querySelector('.art-collection');

      let status = checkStatus();

      document.getElementById('loading').setAttribute('style', 'display:none;');

      if (list.pieces) {
         list.pieces.forEach((element) => {
            if (element.isFavorite == 'true') {
               template.append(this.artPieceTemplate(element));
            }
         });
      } else if (status == 'true') {
         template.innerHTML = `
        <h2>Looks like there's nothing here!</h2>
        <p>Try clicking the "+" to add a piece and start your portfolio</p>`;
      } else {
         createHeaderTitle.textContent = 'Art Portfolio';
         template.innerHTML = `
        <h2>Looks like there's nothing here!</h2>
        <p>This artist hasn't uploaded a piece yet. Try checking later.</p>`;
      }

      //createUsersTitle(list);
   }

   artPieceTemplate(element) {
      const localLog = sessionStorage.getItem('loggedIn');
      const id = sessionStorage.getItem('_id');

      const scale = 'h_' + 800 + ',c_fill';

      var UrlArray = element.img.split('/');
      UrlArray.splice(6, 0, scale);
      const scaledUrl = UrlArray.join('/');
      let artSection = document.createElement('div');
      let artImg = document.createElement('img');

      artSection.className = 'art-items';
      artImg.setAttribute('src', scaledUrl);
      artImg.setAttribute('class', 'lazy');
      // artImg.setAttribute('style', "height: 360px");
      artSection.appendChild(artImg);

      if (localLog == 'true') {
         let removeBtn = document.createElement('button');
         let coverBtn = document.createElement('button');
         let favoriteBtn = document.createElement('button');
         let cover = document.createElement('h3');
         let buttons = document.createElement('div');

         removeBtn.innerHTML = 'Delete';
         coverBtn.innerHTML = 'Make cover';
         favoriteBtn.innerHTML = 'Unfavorite';
         cover.innerHTML = element.medium + ' cover';

         removeBtn.setAttribute('class', 'removeBtn');
         coverBtn.setAttribute('class', 'coverBtn');
         favoriteBtn.setAttribute('class', 'favoriteBtn');
         cover.setAttribute('class', 'isCover');
         buttons.setAttribute('class', 'buttons');

         removeBtn.onclick = async function () {
            let headersList = {
               Accept: '*/*',
            };
            let response = await fetch(
               'https://artportfolio.onrender.com/api/deletepiece/' +
                  id +
                  '/' +
                  element._id,
               {
                  method: 'PATCH',
                  headers: headersList,
               }
            );

            let data = await response.text();
            alert(` Removed Piece`);
            location.reload();
         };

         coverBtn.onclick = async function () {
            let headersList = {
               Accept: '*/*',
            };
            document
               .querySelector('.screenLoad')
               .setAttribute('style', 'display:inline;');
            let response = await fetch(
               'https://artportfolio.onrender.com/api/updatecovers/' +
                  id +
                  '/' +
                  element._id,
               {
                  method: 'PATCH',
                  headers: headersList,
               }
            );

            alert(`Cover changed`);
            location.reload();
         };

         favoriteBtn.onclick = async function () {
            let bodyContent = new FormData();
            bodyContent.append('isFavorite', 'false');

            if (element.idFavorite == true) {
            }
            let headersList = {
               Accept: '*/*',
            };
            document
               .querySelector('.screenLoad')
               .setAttribute('style', 'display:inline;');
            let response = await fetch(
               'https://artportfolio.onrender.com/api/update/' +
                  id +
                  '/' +
                  element._id,
               {
                  method: 'PATCH',
                  headers: headersList,
                  body: bodyContent,
               }
            );

            alert(`Piece Unfavorited`);

            location.reload();
         };

         buttons.appendChild(removeBtn);
         buttons.appendChild(favoriteBtn);
         if (element.isCover == 'false') {
            buttons.appendChild(coverBtn);
         } else {
            buttons.appendChild(cover);
         }
         artSection.appendChild(buttons);
      }

      return artSection;
   }
}
