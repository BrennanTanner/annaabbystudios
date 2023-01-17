var myInput = document.getElementById('password');
var letter = document.getElementById('letter');
var capital = document.getElementById('capital');
var number = document.getElementById('number');
var length = document.getElementById('length');

// When the user clicks on the password field, show the message box
myInput.onfocus = function () {
   document.getElementById('message').style.display = 'block';
};

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function () {
   document.getElementById('message').style.display = 'none';
};

// When the user starts to type something inside the password field
myInput.onkeyup = function () {
   // Validate lowercase letters
   var lowerCaseLetters = /[a-z]/g;
   if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove('invalid');
      letter.classList.add('valid');
   } else {
      letter.classList.remove('valid');
      letter.classList.add('invalid');
   }

   // Validate capital letters
   var upperCaseLetters = /[A-Z]/g;
   if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove('invalid');
      capital.classList.add('valid');
   } else {
      capital.classList.remove('valid');
      capital.classList.add('invalid');
   }

   // Validate numbers
   var numbers = /[0-9]/g;
   if (myInput.value.match(numbers)) {
      number.classList.remove('invalid');
      number.classList.add('valid');
   } else {
      number.classList.remove('valid');
      number.classList.add('invalid');
   }

   // Validate length
   if (myInput.value.length >= 8) {
      length.classList.remove('invalid');
      length.classList.add('valid');
   } else {
      length.classList.remove('valid');
      length.classList.add('invalid');
   }
};

var el = document.getElementById('userSubmit');
if (document.getElementById('userSubmit')) {
   el.addEventListener('click', async function (e) {
      e.preventDefault();

      document
         .querySelector('.lds-roller')
         .setAttribute('style', 'z-index: 1;');
      document
         .querySelector('#userSubmit')
         .setAttribute('style', 'display: none;');

      let headersList = {
         Accept: '*/*',
      };

      let bodyContent = new FormData();

      //login info
      bodyContent.append('username', document.getElementById('username').value);
      bodyContent.append('password', document.getElementById('password').value);
      //personal info
      bodyContent.append('firstN', document.getElementById('firstN').value);
      bodyContent.append('lastN', document.getElementById('lastN').value);
      bodyContent.append('email', document.getElementById('email').value);
      bodyContent.append(
         'phoneNumber',
         document.getElementById('phoneNumber').value
      );
      //about me
      bodyContent.append('aboutMe', document.getElementById('aboutMe').value);
      //profile pic
      bodyContent.append(
         'image',
         document.getElementById('profilePicture').files[0]
      );

      //http://localhost:3030/
      let response = await fetch(
         'https://artportfolio.onrender.com/api/newartist',
         {
            method: 'POST',
            body: bodyContent,
            headers: headersList,
         }
      );

      let data = await response.json();
      if (data.success == false) {
         document
            .getElementById('matchingUser')
            .setAttribute(
               'style',
               'display: inline; color: red; font-size: smaller;'
            );
      } else {
         sessionStorage.setItem('_id', data._id);
         window.location.replace('index.html' + '?' + data._id);
      }
   });
}
