const homeEl = document.querySelector('.home-container');
const formEl = document.querySelector('.form-container');
const successEl = document.querySelector('.success-container');

function onLogoClick() {
  window.open('https://trell.co/watch', 'blank');
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
  {
    name: 'Tiktok Handle Profile URL',
    rules: 'required',
    objKey: 'tiktoklink',
  },
];

let isSubmitting = false;

function onSubmit(e) {
  // e.preventDefault();
  return false;
}

function submitForm() {
  isSubmitting = true;
  const data = {};

  const final = els.filter((el) => {
    const htmlEl = document.querySelector(`input[name="${el.name}"]`);
    if (!htmlEl.value) {
      htmlEl.classList.add('input--error');
      return true;
    } else {
      data[el.objKey] = htmlEl.value;
      htmlEl.classList.remove('input--error');
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
    })
    .catch((err) => {
      console.log('submitForm -> err', err);
    });
}

/////// SERVICE

function sendData(data) {
  const { fullName, city, email, contact, tiktokname, tiktoklink } = data;
  const TIKTOK_ACC_TYPE = 3;

  var formdata = new FormData();
  formdata.append('fullName', fullName);
  formdata.append('cCity', city);
  formdata.append('email', email);
  formdata.append('accountType', TIKTOK_ACC_TYPE);
  formdata.append('contact', contact);
  formdata.append('tiktokName', tiktokname);
  formdata.append('tiktokLink', tiktoklink);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
    mode: 'no-cors',
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
  return Number.isInteger(parseInt(number));
}
