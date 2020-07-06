const homeEl = document.querySelector('.home-container');
const formEl = document.querySelector('.form-container');
const successEl = document.querySelector('.success-container');

let userEmail = '';

function onLogoClick() {
  window.open('https://trell.co/watch', 'blank');
}

function shareToWhatsapp() {
  const TEXT =
    'Hey! I just easily migrated my content from Tiktok to Trell. Find out how I did it on http://MigrateMyTikTokContent.com.';
  window.open(`https://api.whatsapp.com/send?text=${TEXT}`, '_blank');
}

function goToForm() {
  console.log('goToForm -> goToForm', goToForm);

  homeEl.classList.add('hide');
  formEl.classList.remove('hide');
}

const els = [
  {
    name: 'Full Name',
    rules: 'required',
    objKey: 'fullName',
  },
  {
    name: 'Current City',
    rules: 'required',
    objKey: 'city',
  },
  {
    name: 'E-mail ID',
    rules: 'required',
    objKey: 'email',
  },
  {
    name: 'Phone Number',
    rules: 'required',
    objKey: 'contact',
  },
  {
    name: 'Tiktok Handle Name',
    rules: 'required',
    objKey: 'tiktokname',
  },
];

let isSubmitting = false;

function onSubmit(e) {
  // e.preventDefault();
  return false;
}

function submitForm() {
  if (isSubmitting) {
    return;
  }

  isSubmitting = true;
  const data = {};

  const final = els.filter((el) => {
    const htmlEl = document.querySelector(`input[name="${el.name}"]`);
    if (!htmlEl.value) {
      if (el.objKey === 'tiktokname') {
        htmlEl.parentElement.classList.add('input--error');
        return true;
      }

      htmlEl.classList.add('input--error');
      return true;
    } else {
      if (el.objKey === 'email') {
        userEmail = htmlEl.value;
        if (!validateEmail(userEmail)) {
          htmlEl.classList.add('input--error');
          return true;
        }
      }

      if (el.objKey === 'contact') {
        if (!validatePhoneNumber(htmlEl.value)) {
          htmlEl.classList.add('input--error');
          return true;
        }
      }

      data[el.objKey] = htmlEl.value;
      if (el.objKey === 'tiktokname') {
        htmlEl.parentElement.classList.remove('input--error');
      } else {
        htmlEl.classList.remove('input--error');
      }
      return false;
    }
  });

  if (final.length > 0) {
    isSubmitting = false;
    return;
  }

  sendData(data)
    .then((res) => {
      console.log('submitForm -> res', res);
      formEl.classList.add('hide');
      successEl.classList.remove('hide');

      const intervalId = setInterval(() => {
        const el = document.querySelector('.success-container .subtitle');

        if (el) {
          el.innerHTML = `We will mail you on ${userEmail} with the details in less than 24
          hours.`;
          clearInterval(intervalId);
        }
      }, 50);
    })
    .catch((err) => {
      console.log('submitForm -> err', err);
    })
    .finally(() => {
      isSubmitting = false;
    });
}

/////// SERVICE

function sendData(data) {
  const { fullName, city, email, contact, tiktokname } = data;
  const TIKTOK_ACC_TYPE = 3;

  var formdata = new FormData();
  formdata.append('fullName', fullName);
  formdata.append('cCity', city);
  formdata.append('email', email);
  formdata.append('accountType', TIKTOK_ACC_TYPE);
  formdata.append('contact', contact);
  // formdata.append('tiktokName', tiktokname);
  formdata.append('tiktokLink', `https://www.tiktok.com/@${tiktokname}`);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
    mode: 'cors',
  };

  return fetch(
    'https://trell.co/expresso/ajaxMiddleware/onDemandGetChannelOperationsPublic.php',
    requestOptions
  ).then((response) => response.text());
}

////// FORM VALIDATION

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(number) {
  return Number.isInteger(parseInt(number)) && number.length === 10;
}

// Init

window.addEventListener('load', () => {
  const el = document.querySelector('.num-tiktokers');

  const BASE_TIME = 1594030291597;
  const DIFF = 2 * 60 * 1000;
  const tiktokers = 3243 + Math.ceil((Date.now() - BASE_TIME) / DIFF);

  el.innerHTML = tiktokers;
});
