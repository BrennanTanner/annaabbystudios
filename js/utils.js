import { checkStatus, logout } from './admin.js';

function convertToText(res) {
   if (res.ok) {
      return res.text();
   } else {
      throw new Error('Bad Response');
   }
}

export async function loadTemplate(path) {
   const html = await fetch(path).then(convertToText);
   const template = document.createElement('template');
   template.innerHTML = html;
   return template;
}

export function renderWithTemplate(template, parent, data, callback) {
   let clone = template.content.cloneNode(true);
   if (callback) {
      clone = callback(clone, data);
   }
   parent.appendChild(clone);
}

export function checkURL() {
   const path = getLocationFromUrl();
   const pathId = getIdFromUrl();
   const _id = sessionStorage.getItem('_id');

   if (!_id) {
      sessionStorage.setItem('_id', '63bcd12e5847f0f521b7a3fa');
   }
}

export function appendFormLink(form) {
   const formLink = document.querySelector('.formLink');
   const api = 'https://artportfolio.onrender.com/api/';
   const id = sessionStorage.getItem('_id');
   formLink.setAttribute('method', 'POST');
   formLink.setAttribute('action', api + form + id);
}

export function getLocationFromUrl() {
   var URLArray = window.location.pathname.split('?');
   var pathArray = URLArray[0].split('/');

   var lastItem = pathArray.length - 1;

   if (pathArray[lastItem] == 'index.html') {
      return pathArray[lastItem - 1];
   } else {
      return pathArray[lastItem];
   }
}

export function getIdFromUrl() {
   var URLArray = window.location.href.toString().split('?');

   return URLArray[1];
}

export function getUrlFromUrl() {
   var URLArray = window.location.href.toString().split('?');

   return URLArray[0];
}

export async function loadHeaderFooter() {
   const loggedIn = await checkStatus();
   const path = getLocationFromUrl();
   if (
      path == 'about' ||
      path == 'gallery' ||
      path == 'newPiece' ||
      path == 'newUser' ||
      path == 'pieceUploaded.html'
   ) {
      const header = await loadTemplate('../partials/header.html');
      const footer = await loadTemplate('../partials/footer.html');

      const headerElement = document.getElementById('main-header');
      const footerElement = document.getElementById('main-footer');

      renderWithTemplate(header, headerElement);
      renderWithTemplate(footer, footerElement);

      document.getElementById('menuHome').setAttribute('href', '../index.html');
      document
         .getElementById('menuGallery')
         .setAttribute('href', '../gallery/index.html');
      document
         .getElementById('menuAbout')
         .setAttribute('href', '../about/index.html');
   } else {
      const header = await loadTemplate('./partials/header.html');
      const footer = await loadTemplate('./partials/footer.html');

      const headerElement = document.getElementById('main-header');
      const footerElement = document.getElementById('main-footer');

      renderWithTemplate(header, headerElement);
      renderWithTemplate(footer, footerElement);

      document.getElementById('menuHome').setAttribute('href', './index.html');
      document
         .getElementById('menuGallery')
         .setAttribute('href', './gallery/index.html');
      document
         .getElementById('menuAbout')
         .setAttribute('href', './about/index.html');
   }

   if (loggedIn) {
      document.getElementById('userControls').style.display = 'block';

      document.getElementById('logoutButton').style.display = 'block';
      document
         .getElementById('logoutButton')
         .addEventListener('click', function (e) {
            e.preventDefault();
            logout();
         });
   }

   const menu = document.querySelector('.menu');
   const menuItems = document.querySelectorAll('.menuItem');
   const hamburger = document.querySelector('.hamburger');
   const closeIcon = document.querySelector('.closeIcon');
   const menuIcon = document.querySelector('.menuIcon');

   function toggleMenu() {
      if (menu.classList.contains('showMenu')) {
         menu.classList.remove('showMenu');
         closeIcon.style.display = 'none';
         menuIcon.style.display = 'block';
      } else {
         menu.classList.add('showMenu');
         closeIcon.style.display = 'block';
         menuIcon.style.display = 'none';
      }
   }

   hamburger.addEventListener('click', toggleMenu);

   menuItems.forEach(function (menuItem) {
      menuItem.addEventListener('click', toggleMenu);
   });
}

export async function lazyLoad() {
   document.addEventListener('DOMContentLoaded', function () {
      var lazyloadImages = document.querySelectorAll('img.lazy');
      var lazyloadThrottleTimeout;

      function lazyload() {
         if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
         }

         lazyloadThrottleTimeout = setTimeout(function () {
            var scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function (img) {
               if (img.offsetTop < window.innerHeight + scrollTop) {
                  img.src = img.dataset.src;
                  img.classList.remove('lazy');
               }
            });
            if (lazyloadImages.length == 0) {
               document.removeEventListener('scroll', lazyload);
               window.removeEventListener('resize', lazyload);
               window.removeEventListener('orientationChange', lazyload);
            }
         }, 20);
      }

      document.addEventListener('scroll', lazyload);
      window.addEventListener('resize', lazyload);
      window.addEventListener('orientationChange', lazyload);
   });
}
