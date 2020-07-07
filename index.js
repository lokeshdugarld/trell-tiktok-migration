

const homeEl = document.querySelector('.home-container');
const formEl = document.querySelector('.form-container');
const successEl = document.querySelector('.success-container');

let userEmail = '';


function recordAnalytics(event = '', action = '', label = '', d1 = '') {
  let analyticsObj = {
    event, action, label
  }
  if (d1) analyticsObj.d1 = d1

  console.table(analyticsObj);
  window.dataLayer.push(analyticsObj)
}

function capturePageImpression() {
  recordAnalytics('page-impression', 'impression', 'Page loaded')
}

const analyticsHelper = {
  events: { button: 'button', form: 'form', file: 'file' },
  action: { click: 'click', submit: 'submit', upload: 'upload', },
  success: 'Success',
  error: 'Error',
  trying: 'Trying to submit',
  selected: 'Selected',
  migrateButton: 'Migrate Button',
  uploadButton: 'Upload Button',
  autoSaved: 'Auto Saved',
}


function onLogoClick() {
  window.open('https://trell.co/watch', 'blank');
}

function shareToWhatsapp() {
  const TEXT =
    'Hey! I just easily migrated my content from Tiktok to Trell. Find out how I did it on http://MigrateMyTikTokContent.com.';
  window.open(`https://api.whatsapp.com/send?text=${TEXT}`, '_blank');
}

function goToForm() {
  recordAnalytics(analyticsHelper.events.button, analyticsHelper.action.click, analyticsHelper.migrateButton);
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

  recordAnalytics(analyticsHelper.events.button, analyticsHelper.action.submit, analyticsHelper.trying);

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

  sendData(data, '1')
    .then((res) => {
      console.log('submitForm -> res', res);
      formEl.classList.add('hide');
      successEl.classList.remove('hide');

      const intervalId = setInterval(() => {
        const el = document.querySelector('.success-container .subtitle');

        if (el) {
          el.innerHTML = `You'll receive Content Migration status on ${userEmail} within 24 hours
          hours.`;
          clearInterval(intervalId);
        }
      }, 50);

      recordAnalytics(analyticsHelper.events.form, analyticsHelper.action.submit, analyticsHelper.success);

      clearInterval(autoSaveIntervalId);
    })
    .catch((err) => {
      // SUBMISSION FAILED

      console.log('submitForm -> err', err);
      recordAnalytics(analyticsHelper.events.form, analyticsHelper.action.submit, analyticsHelper.error);
    })
    .finally(() => {
      isSubmitting = false;
    });
}

/////// SERVICE

function sendData(data, submit) {
  const { fullName, city, email, contact, tiktokname } = data;
  const TIKTOK_ACC_TYPE = 3;

  var formdata = new FormData();
  formdata.append('fullName', fullName);
  formdata.append('cCity', city);
  formdata.append('email', email);
  formdata.append('accountType', TIKTOK_ACC_TYPE);
  formdata.append('contact', contact);
  formdata.append('imgUrl', uploadedFileURL);
  formdata.append('tiktokLink', `https://www.tiktok.com/@${tiktokname}`);
  formdata.append('submit', submit);

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

//

let uploadedFileURL;

let uploading = false;

function openFileUploader() {
  const fileInput = document.getElementById('upload-input');
  const buttonEl = document.getElementById('upload-btn');
  fileInput.click();

  recordAnalytics(analyticsHelper.events.button, analyticsHelper.action.click, analyticsHelper.uploadButton);

  // OPENED FILE UPLAODER
}

async function upload() {
  if (uploading) {
    return;
  }

  // FILE SELECTED
  recordAnalytics(analyticsHelper.events.file, analyticsHelper.action.upload, analyticsHelper.selected);

  // ensure only pdf is uploaded
  // check using fileInput.filename endswith pdf
  const fileInput = document.getElementById('upload-input');
  const buttonEl = document.getElementById('upload-btn');

  buttonEl.innerHTML = 'Uploading';
  if (
    !(
      fileInput.files[0].name.endsWith('png') ||
      fileInput.files[0].name.endsWith('jpg') ||
      fileInput.files[0].name.endsWith('jpeg') ||
      fileInput.files[0].name.endsWith('webp')
    )
  ) {
    buttonEl.innerHTML = 'Retry Upload';
    return;
  }

  const url = 'https://trell.co.in/expresso/upload.php';
  var formdata = new FormData();

  formdata.append('image', fileInput.files[0]);

  var requestOptions = {
    method: 'POST',
    body: formdata,
  };

  const result = await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('upload -> result', result);
      if (!result.success) {
        throw new Error('error occurred');
      }

      // FILE UPLOAD SUCCESS , URL
      recordAnalytics(analyticsHelper.events.file, analyticsHelper.action.upload, analyticsHelper.success, result.url);

      uploadedFileURL = result.url;
      buttonEl.innerHTML = 'Success, Click to Change';

      setTimeout(() => {
        const imgEl = document.querySelector('.sample-selfie');
        imgEl.src = result.url;
      }, 1000);
      return result;
    })
    .catch((error) => {
      // FILE UPLOAD FAILURE
      buttonEl.innerHTML = 'Retry upload';
      recordAnalytics(analyticsHelper.events.file, analyticsHelper.action.upload, analyticsHelper.error);
    })
    .finally(() => {
      uploading = false;
    });

  console.log('result : ', result);
}

// Autosubmit

let prevData = {};
let eventCaptured = false;

function autosave() {
  const currData = {};

  for (let index = 0; index < els.length; index++) {
    const el = els[index];

    const htmlEl = document.querySelector(`input[name="${el.name}"]`);

    if (!htmlEl.value) {
      console.log('returning due to empty value', el.name);
      return;
    }

    currData[el.objKey] = htmlEl.value;

    if (el.objKey === 'email') {
      userEmail = htmlEl.value;
      if (!validateEmail(userEmail)) {
        console.log('returning due to invalid email');
        return;
      }
    }

    if (el.objKey === 'contact') {
      if (!validatePhoneNumber(htmlEl.value)) {
        console.log('returning due to invalid phone');
        return;
      }
    }
  }

  console.log('autosave -> currData', currData);
  console.log('autosave -> prevData', prevData);

  // console.log('same , ', JSON.stringify(prevData) == JSON.stringify(currData));
  if (JSON.stringify(prevData) == JSON.stringify(currData)) {
    console.log('returning due to same objects');
    return;
  }

  prevData = Object.assign({}, currData);
  console.log('sending data');

  if (!eventCaptured) {
    recordAnalytics(analyticsHelper.events.form, analyticsHelper.action.submit, analyticsHelper.autoSaved, JSON.stringify(currData));
    eventCaptured = true;
  }
  // sendData(prevData, '0');
}

const autoSaveIntervalId = setInterval(() => {
  autosave();
}, 1500);
