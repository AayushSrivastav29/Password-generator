'use strict';

//variables
const passwordDisplay = document.querySelector('[passwordDisplay]'); //custom-attribute
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');

const lengthDisplay = document.querySelector('[data-lengthNmber]');
const inputSlider = document.querySelector('.slider');

const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

const indicator = document.querySelector('#light');
const generateBtn = document.querySelector('.generate-button');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?/~`".';

//default password length-10, slider value=10, indicator-color= grey
let checkCount=0;
let password="";
let passwordLength=10; 


inputSlider.addEventListener('input', function (e) {
  lengthDisplay.textContent = e.target.value;
  passwordLength=parseInt(lengthDisplay.textContent);
  console.log(passwordLength);
});

//copy to clipboard, msg-"copied"
copyBtn.addEventListener('click', function () {
  const copiedText = document.createElement('span');
  copiedText.textContent = 'Copied';
  copiedText.classList.add('copied-text');

  //it attaches the created element to this btn whenever clicked.
  this.appendChild(copiedText);

  setTimeout(function () {
    copiedText.remove();
  }, 2000);

  passwordDisplay.select();
  navigator.clipboard.writeText(passwordDisplay.value);
});

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
  if(color=="#f20"){ 
      indicator.style.boxShadow="0 0 12px 1px rgb(174, 15, 15)";
  }
  if(color=="#ff0"){ 
    indicator.style.boxShadow=" 0 0 12px 1px rgb(178, 181, 0);";
 }
  if(color=="#0f0"){ 
    indicator.style.boxShadow="0 0 12px 1px rgb(8, 174, 2)";
  }
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRndmUpperCase() {
  //A-Z
  return String.fromCharCode(getRandomInteger(65, 90));
}

function getRndmLowerCase() {
  //a-z
  return String.fromCharCode(getRandomInteger(97, 122));
}

function getRndmNumber() {
  return getRandomInteger(0, 9);
}

function getRndmSymbols() {
  return symbols.charAt(getRandomInteger(0, 31));
}

function calcPassStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (
    hasUpper &&
    hasLower &&
    (hasNum || hasSymbol) &&
    passwordLength >= 8
  ) {
    setIndicator('#0f0');
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator('#ff0');
  } else {
    setIndicator('#f20');
  }
  console.log(hasLower, hasNum, hasSymbol, hasUpper);
}

function shufflePassword(array){
  //Fissher Yates Method
  for (let i = array.length-1; i >0; i--) {
    let j =Math.floor(Math.random()*(i+1));
    let temp =array[i];
    array[i]=array[j];
    array[j]=temp;
  }
  let str="";
  array.forEach((el)=> str+=el);
  return str;
}

function handleCheckboxChange(){
    allCheckBox.forEach((checkbox)=>{
      if(checkbox.checked){
        checkCount++;
      }
    })

    //edge case
    if (passwordLength < checkCount) {
      passwordLength =checkCount;
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})


generateBtn.addEventListener('click', function () {
    //none checkbox are clicked
    if (checkCount===0) return;

    if (passwordLength < checkCount) {
      passwordLength =checkCount;
      inputSlider.value=passwordLength;
    }

    //remove old password
    password= "";

    let funcArr=[];

    if (uppercaseCheck.checked) {
      funcArr.push(getRndmUpperCase);
    }
    if (lowercaseCheck.checked) {
      funcArr.push(getRndmLowerCase);
    }
    if (numbersCheck.checked) {
      funcArr.push(getRndmNumber);
    }
    if (symbolsCheck.checked) {
      funcArr.push(getRndmSymbols);
    }

    //compulsory additions
    for (let i = 0; i < funcArr.length; i++) {
      password+=funcArr[i]();
    }

    //remaining additions
    for (let i = 0; i < passwordLength-funcArr.length; i++) {
      let rndmIndx = getRandomInteger(0 , funcArr.length);
      password+=funcArr[rndmIndx]();
    }
    
    //shuffle the password
    password= shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calc strength
    calcPassStrength();

console.log(passwordLength);
})