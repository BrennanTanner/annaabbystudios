//import '../css/style.css';
import AboutList from './aboutList.js';
import ArtListing from './artListing.js';
import GalleryPieces from './galleryPieces.js';
import ExternalServices from './externalServices.js';
import {
   loadHeaderFooter,
   checkURL,
   getLocationFromUrl,
   appendFormLink,
   lazyLoad,
} from './utils.js';

checkURL();
loadHeaderFooter();

const path = getLocationFromUrl();

const dataSource = new ExternalServices();
const myArt = new ArtListing(dataSource);
const myAbout = new AboutList(dataSource);
const myGallery = new GalleryPieces(dataSource);


if (path == 'about') {
   myAbout.init();
} else if (path == 'gallery') {
   myGallery.init();
} else if (path == 'newPiece') {
   appendFormLink('newpiece/');
} else if (path == 'newUser') {
   appendFormLink('newuser/');
} else if (path == 'pieceUploaded.html') {
} else {
   myArt.init();
}

lazyLoad();