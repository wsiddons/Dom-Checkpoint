/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.getElementById('coffee_counter')
  coffeeCounter.innerText = coffeeQty
  return coffeeCounter.innerText
  
}

function clickCoffee(data) {
  let coffeeCounter = document.getElementById('coffee_counter')
  data.coffee++
  coffeeCounter.innerText = data.coffee
  renderProducers(data)
  return parseInt(coffeeCounter.innerText)
}

/**************
 *   SLICE 2
 **************/
//producers, coffeeCount




function unlockProducers(producers, coffeeCount) {

  producers.map((element, index) => {
    if (coffeeCount >=  element.price /  2) {
      element.unlocked = true
    }
  })
  
  // for (let i = 0; i < producers.length; i++) {
  //   if (coffeeCount >=  producers[i].price /  2) {
  //     producers[i].unlocked = true
  //   }
  // }
}

function getUnlockedProducers(data) {
  return data.producers.reduce((accum, element) => {
    if (element.unlocked === true) {
      accum.push(element)
    }
    return accum
  }, [])
}

function makeDisplayNameFromId(id) {

  let wordArr = id.split('_')
  let capArr = wordArr.reduce((accum, element) => {

    accum.push(element.charAt(0).toUpperCase() + element.slice(1))
    //console.log(accum)
    return accum
  }, [])
  return capArr.join(' ')
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  const producerContainer = document.querySelector('#producer_container')
  const producerClass = document.querySelector('.producer')
  let producerClassAll = document.querySelectorAll('.producer')
  unlockProducers(data.producers, data.coffee)
    while(producerContainer.firstChild) {
        producerContainer.removeChild(producerContainer.firstChild)
      }
  data.producers.map((element) => {
    if (element.unlocked == true) {
      producerContainer.append(makeProducerDiv(element))
    }
  })  
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.reduce((accum, element) => {
    if (element.id === producerId) {
      accum = element
      return accum
    }
    return accum
  }, {})
}

function canAffordProducer(data, producerId) {
  if (data.coffee >= getProducerById(data, producerId).price) {
    return true
  } else {
    return false
  }
}

function updateCPSView(cps) {
  let coffePerSec = document.querySelector('#cps')
  coffePerSec.innerText = cps
  return parseInt(cps)
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25)
}

function attemptToBuyProducer(data, producerId) {
  const producer = getProducerById(data, producerId)
  let coffeePerSecNum = parseInt(document.querySelector('#cps').innerText)
  //let counter = document.getElementById('coffee_counter')
  if (canAffordProducer(data, producerId)) {
    producer.qty++
    data.coffee = data.coffee - producer.price
    //counter = data.coffee - producer.price
    producer.price = updatePrice(getProducerById(data, producerId).price)

    // updateCPSView((producer.cps) + coffeePerSecNum)
    // data.totalCPS = coffeePerSecNum + producer.cps
    data.totalCPS = updateCPSView((producer.cps) + coffeePerSecNum)

    return true
  } else {
    return false
  }
  
}



//buyButtonClick(event, data)
function buyButtonClick(event, data) {
  //console.log(document.getElementById(`${event.target.id}`))
  if (event.target.tagName === 'BUTTON') {
    let str = event.target.id
    let noBuy = str.replace('buy_', '')
    if (!canAffordProducer(data, noBuy)) {
      window.alert('Not enough coffee!')
    }
    attemptToBuyProducer(data, noBuy)
    updateCoffeeView(data.coffee)
    renderProducers(data)
    updateCPSView(data.totalCPS)
  }
}

// function tickTest() {
//   let colorArr = [red, blue, green]
//   setInterval(() => {
//     let coffeeText = document.getElementByClassName('counter-container')
//     coffeeText.style.color = `${colorArr[Math.floor(Math.random() * colorArr.length)]}`
//   }, 1000)
// }

function tick(data) {
  
    //updateCoffeeView(data.coffee) = data.coffee + data.totalCPS
    data.coffee = data.coffee + data.totalCPS
    updateCoffeeView(data.coffee)
    renderProducers(data)
    updateCPSView(data.totalCPS)

}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
