import { getIdFromUrl, getUrlFromUrl } from './utils.js';

export default class ArtListing {
   constructor(dataSource) {
      this.dataSource = dataSource;
   }

   async init() {
      const list = await this.dataSource.getOwnersData();

      const template = document.querySelector('.gallery-collection');

      document.getElementById('loading').setAttribute('style', 'display:none;');

      const urlTag = getIdFromUrl();
      const url = getUrlFromUrl();

      document
         .getElementById('digital')
         .addEventListener('click', function (e) {
            window.location.href = url + '?digital';
         });
      document
         .getElementById('narrative')
         .addEventListener('click', function (e) {
            window.location.href = url + '?narrative';
         });
      document
         .getElementById('watercolor')
         .addEventListener('click', function (e) {
            window.location.href = url + '?watercolor';
         });
      document
         .getElementById('oilpaint')
         .addEventListener('click', function (e) {
            window.location.href = url + '?oilpaint';
         });

      let tag = 'digital';
      const digital = document.getElementById(tag);
      digital.append(this.setCovers(list, tag));

      let tag2 = 'narrative';
      const narrative = document.getElementById(tag2);
      narrative.append(this.setCovers(list, tag2));

      let tag3 = 'watercolor';
      const watercolor = document.getElementById(tag3);
      watercolor.append(this.setCovers(list, tag3));

      let tag4 = 'oilpaint';
      const oilpaint = document.getElementById(tag4);
      oilpaint.append(this.setCovers(list, tag4));

      list.pieces.forEach((element) => {
         if (element.medium == urlTag) {
            template.append(this.artPieceTemplate(element));
         }
      });
   }

   setCovers(element, tag) {
      let cover = document.createElement('img');

      element.pieces.forEach((piece) => {
         const scale = 'w_178,h_178,c_fill';

         var UrlArray = piece.img.split('/');
         UrlArray.splice(6, 0, scale);
         const scaledUrl = UrlArray.join('/');

         if (piece.isCover == 'true' && piece.medium == tag) {
            cover.setAttribute('src', scaledUrl);
         }
      });

      cover.setAttribute('class', 'lazy');

      return cover;
   }

   artPieceTemplate(element) {
      const localLog = sessionStorage.getItem('loggedIn');
      const id = sessionStorage.getItem('_id');

      let artSection = document.createElement('div');
      let artTitle = document.createElement('h1');
      let artMainImg = document.createElement('img');

      let artMedium = document.createElement('p');
      let artSummary = document.createElement('p');
      let imageArea = document.createElement('div');

      artSection.className = 'gallery-items';
      artMainImg.setAttribute('src', element.img);
      artMainImg.setAttribute('class', 'lazy');
      artTitle.textContent = element.title.toUpperCase();
      artMedium.textContent = element.medium;
      artSummary.textContent = element.aboutBody;
      imageArea.className = 'gallery-image-content';

      element.drafts.forEach((element) => {
         let artImage = document.createElement('img');
         artImage.src = element.img;
         artImage.className = 'gallery-image';
         imageArea.appendChild(artImage);
      });
      artSection.appendChild(artTitle);
      artSection.appendChild(artMainImg);
      artSection.appendChild(imageArea);
      artSection.appendChild(artMedium);
      artSection.appendChild(artSummary);

      if (localLog == 'true') {
         let removeBtn = document.createElement('button');
         let coverBtn = document.createElement('button');
         let favoriteBtn = document.createElement('button');
         let cover = document.createElement('h3');
         let buttons = document.createElement('div');

         removeBtn.innerHTML = 'Delete';
         coverBtn.innerHTML = 'Make cover';

         if (element.isFavorite == 'true') {
            favoriteBtn.innerHTML = 'Unfavorite';
         } else {
            favoriteBtn.innerHTML = 'Favorite';
         }

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
            document
               .querySelector('.screenLoad')
               .setAttribute('style', 'display:inline;');
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
            document
               .querySelector('.screenLoad')
               .setAttribute('style', 'display:none;');
            let data = await response.text();

            alert(`Removed Piece`);
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
            // document
            //    .querySelector('.screenLoad')
            //    .setAttribute('style', 'display:none;');
            // let data = await response.text();

            alert(`Cover changed`);
            location.reload();
         };

         favoriteBtn.onclick = async function () {
            const favorited = element.isFavorite;
            let bodyContent = new FormData();
            if (favorited == 'true') {
               bodyContent.append('isFavorite', 'false');
            } else {
               bodyContent.append('isFavorite', 'true');
            }

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

            if (!favorited) {
               alert(`Piece Unfavorited`);
            } else {
               alert(`Piece Favorited`);
            }

            location.reload();
         };

         if (element.isCover == 'false') {
            buttons.appendChild(coverBtn);
         } else {
            buttons.appendChild(cover);
         }
         buttons.appendChild(favoriteBtn);
         buttons.appendChild(removeBtn);
         artSection.appendChild(buttons);
      }
      
      return artSection;
   }
}
