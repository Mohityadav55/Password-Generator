const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "``!@#$%^&*()_~+-=|:><,./?'"  ;

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// strength circle color to grey
setIndicator("#ccc")


// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText =passwordLength;

    // background slider
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max - min))+ "% 100%"
};

function setIndicator(color){
    indicator.style.backgroundColor = color;


    //shadow
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}


function getRandInt(min,max){
    return Math.floor(Math.random()*(max-min)) +min;
}

function generateRandomNumber(){
    return getRandInt(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandInt(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandInt(65,91));
}

function generateSymbols(){
    const randNum = getRandInt(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    
    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}


function checkBoxChangeHandle(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
}

      //   condition

    if(passwordLength < checkCount){
        passwordLength =checkCount;
        handleSlider();
    }  

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',checkBoxChangeHandle)
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})


function shufflePassword(array){
    // fisher Yates method

    for(let i= array.length -1 ; i>0; i--){
        const j =Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el)=> (str += el));
    return str;
}


generateBtn.addEventListener('click',() => {
   
    // none of the checkbox are selected
    if(checkCount <= 0) return;
    
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // new password
      // old password rempove
      password= "";

      // function array

      let funArr = [];

      if(uppercaseCheck.checked)
        funArr.push(generateUppercase);
      if(lowercaseCheck.checked)
        funArr.push(generateLowercase);
      if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
      if(symbolsCheck.checked)
        funArr.push(generateSymbols);
      
      // compulsory addition
      for(let i=0; i<funArr.length;i++){
        password += funArr[i]();
      }
      //remaining addition
      for(let i=0; i<passwordLength-funArr.length; i++){
        let randIndex = getRandInt(0,funArr.length);
        password += funArr[randIndex]();
      }


      // shuffle the password
      password = shufflePassword(Array.from(password));

      // show in ui
      passwordDisplay.value = password;

      // calculate strength
      calcStrength();

});