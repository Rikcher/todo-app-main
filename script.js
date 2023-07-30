const listItems = document.querySelectorAll(".list-item")         // whole line in list
const wholeList = document.querySelector("#todo-list")          //ul of todo items
const newTodoItem = document.querySelector("#new-todo-input")         //input in "new todo" line
const config = {childList: true}            //config for observing new mutations for todo list
const numberOfItems = document.querySelector("#number-of-items")
const clearCompletedButton = document.querySelector("#clear-completed-button")
const completedButton = document.querySelector("#completed-button")
const activeButton = document.querySelector("#active-button")
const allButton = document.querySelector("#all-button")
const buttonsColor = document.querySelectorAll("#container-functionality button:not(:last-child) span")


//* listen for new items and added cross and checkboxes functionality to them

const callback = () => {
    const newItems = document.querySelectorAll('#todo-list li:not(.event-listener-added)');
    const newCrosses = document.querySelectorAll('.cross:not(.event-listener-added)');
    const newCheckboxes = document.querySelectorAll(`.checkbox:not(.event-listener-added)`)
    const checkBoxes = document.querySelectorAll(".checkbox")
    newItems.forEach(newItem => {
        newItem.addEventListener("mouseover", () => {
            newItem.childNodes[5].classList.add("hovered")          //* cross show on hover
        })
        newItem.addEventListener("mouseout", () => {
            newItem.childNodes[5].classList.remove("hovered")          //* cross hide when mouse out
        })
        newItem.childNodes[3].disabled = true                       //*disabling input in list item

        //** drag and drop feature implementing */

        let draggable = null; //storing draggable outside of dragenter listener for performance reasons
        newItem.addEventListener("dragstart", () => {
            newItem.classList.add("dragging")
            draggable = newItem;
        })
        newItem.addEventListener("dragend", () => {
            newItem.classList.remove("dragging")
            draggable = null;
        })

        wholeList.addEventListener("dragenter", (e) => {
            if (!draggable) return;

            const afterElement = getDragAfterElement(wholeList, e.clientY)
            if(afterElement == null){
                wholeList.appendChild(draggable)
            } else {
                wholeList.insertBefore(draggable, afterElement)
            }
            e.preventDefault()
        })
        wholeList.addEventListener("dragover", (event) => {        //* prevent doNotAllow cursor while dragging
            event.preventDefault();
        });
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(".list-item:not(.dragging)")]
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if(offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child }
                } else {
                    return closest
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element
        }

        //********* */ 

        newItem.classList.add('event-listener-added');
    });
    newCrosses.forEach(newCross => {
        newCross.addEventListener("click", () => {          //* delete list item on cross click
            newCross.parentElement.remove()
        })
        newCross.classList.add('event-listener-added');
    })
    numberOfItems.innerHTML = checkBoxes.length;
    newCheckboxes.forEach(newCheckbox => {                  //* custom checkboxes functionality
        newCheckbox.addEventListener("click", () => {
            if(newCheckbox.classList.contains("checked")) {
                newCheckbox.classList.remove("checked")
                numberOfItems.innerHTML = parseInt(numberOfItems.innerHTML) + 1
                if(isClicked == 2) {
                    checkBoxes.forEach(checkbox => {
                        checkbox.classList.contains("checked") ? checkbox.parentElement.style.display = "flex" : checkbox.parentElement.style.display = "none";
                    })
                }
            } else {
                newCheckbox.classList.add("checked")
                numberOfItems.innerHTML = parseInt(numberOfItems.innerHTML) - 1
                if(isClicked == 1) {
                    checkBoxes.forEach(checkbox => {
                        checkbox.classList.contains("checked") ? checkbox.parentElement.style.display = "none" : checkbox.parentElement.style.display = "flex";
                    })
                }
            }
        })
        newCheckbox.classList.add('event-listener-added');
    })
    clearCompletedButton.addEventListener("click", () => {             //* bottom control buttons functionality
        checkBoxes.forEach(checkbox => {
            checkbox.classList.contains("checked") ? checkbox.parentElement.remove() : false;
        })
    })
    completedButton.addEventListener("click", () => {             //* bottom control buttons functionality
        checkBoxes.forEach(checkbox => {
            checkbox.classList.contains("checked") ? checkbox.parentElement.style.display = "flex" : checkbox.parentElement.style.display = "none";
        })
    })
    activeButton.addEventListener("click", () => {             //* bottom control buttons functionality
        checkBoxes.forEach(checkbox => {
            checkbox.classList.contains("checked") ? checkbox.parentElement.style.display = "none" : checkbox.parentElement.style.display = "flex";
        })
    })
    allButton.addEventListener("click", () => {             //* bottom control buttons functionality
        checkBoxes.forEach(checkbox => {
            checkbox.classList.contains("checked") ? checkbox.parentElement.style.display = "flex" : checkbox.parentElement.style.display = "flex";
        })
    })
};

const observer = new MutationObserver(callback);
observer.observe(wholeList, config);

//*


//* adding new list items

newTodoItem.addEventListener("keypress", (e) => {
    let userText = newTodoItem.value
    if(e.key == "Enter") {
        wholeList.insertAdjacentHTML("beforeend", `
        <li draggable="true" class="list-item ${theme == "light" ? "light" : false}">
            <button class="checkbox ${theme == "light" ? "light" : false}">
                <img src="/images/icon-check.svg" alt="">
            </button>
            <input class="${theme == "light" ? "light" : false}" type="text" value="${userText}">
            <button class="cross">
                <img src="/images/icon-cross.svg" alt="">
            </button>
        </li>
        `)
        newTodoItem.value = ""
    }
})

//*

//* change count in the left bottom of box

const functionalityButtons = document.querySelectorAll("#container-functionality button span")
let isClicked = 0;

functionalityButtons.forEach(button => {
    button.addEventListener("click", () => {
        isClicked = [...functionalityButtons].indexOf(button);
        console.log(isClicked)
        if(parseInt(isClicked) != 3) {
            button.style.color = "var(--Bright-Blue)"
            functionalityButtons.forEach(button2 => {
                if([...functionalityButtons].indexOf(button2) != 3) {
                    if(theme == "light") {
                        button2 != button ? button2.style.color = "var(--Dark-Grayish-Blue1)" : false
                    } else {
                        button2 != button ? button2.style.color = "var(--Very-Dark3-Grayish-Blue)" : false
                    }
                }
            });
        }
    });
    button.addEventListener("mouseover", () => {
        if(theme == "light") {
            button.style.color = "var(--Very-Dark-Desaturated-Blue)"
        } else {
            button.style.color = "var(--Light-Grayish-Blue)"
        }
    });
    button.addEventListener("mouseout", () => {
        if([...functionalityButtons].indexOf(button) == isClicked && isClicked != 3) {
            button.style.color = "var(--Bright-Blue)"
        } else if([...functionalityButtons].indexOf(button) == 3){
            if(theme == "light") {
                button.style.color = "var(--Light-Grayish-Blue1)"
            } else {
                button.style.color = "var(--Very-Dark-Grayish-Blue)"
            }
        } else {
            if(theme == "light") {
                button.style.color = "var(--Dark-Grayish-Blue1)"
            } else {
                button.style.color = "var(--Very-Dark3-Grayish-Blue)"
            }
        }
    });
    
})

//*




//****************************************************** */

//* theme change button functionality and local storage usage 

const htmlBody = document.querySelector("body")
const themeSwitcherButton = document.querySelector("#theme-switcher")
const themeConfig = { attributes: true }
let theme = htmlBody.getAttribute("data-theme");

const themeCallback = () => {
    function lightTheme() {
        document.querySelector("main").classList.add("light")
        document.querySelector("body").classList.add("light")
        themeSwitcherButton.childNodes[1].setAttribute("src", "/images/icon-moon.svg")
        document.querySelector("#new-todo").classList.add("light")
        document.querySelector("#new-todo #new-checkbox").classList.add("light")
        document.querySelector("#new-todo input").classList.add("light")
        document.querySelectorAll(".list-item").forEach(item => {
            item.classList.add("light")
        })
        document.querySelectorAll(".list-item .checkbox").forEach(item => {
            item.classList.add("light")
        })
        document.querySelectorAll(".list-item input").forEach(item => {
            item.classList.add("light")
        })
        document.querySelector("#container-functionality").classList.add("light")
        document.querySelector("#clear-completed-button > span").style.color = "var(--Light-Grayish-Blue1)"
        document.querySelector("#items-count").style.color = "var(--Light-Grayish-Blue1)"
        if(!(isClicked == 0)) {
            document.querySelector("#all-button > span").style.color = "var(--Dark-Grayish-Blue1)"
        }
        if(!(isClicked == 1)) {
            document.querySelector("#active-button > span").style.color = "var(--Dark-Grayish-Blue1)"
        }
        if(!(isClicked == 2)) {
            document.querySelector("#completed-button > span").style.color = "var(--Dark-Grayish-Blue1)"
        }
        document.querySelector("#reminder").classList.add("light")
        document.querySelector("#todo-list-container").classList.add("light")
        document.querySelector(".mobile-block").classList.add("light")
    }
    
    function darkTheme() {
        document.querySelector("main").classList.remove("light")
        document.querySelector("body").classList.remove("light")
        themeSwitcherButton.childNodes[1].setAttribute("src", "/images/icon-sun.svg")
        document.querySelector("#new-todo").classList.remove("light")
        document.querySelector("#new-todo #new-checkbox").classList.remove("light")
        document.querySelector("#new-todo input").classList.remove("light")
        document.querySelectorAll(".list-item").forEach(item => {
            item.classList.remove("light")
        })
        document.querySelectorAll(".list-item .checkbox").forEach(item => {
            item.classList.remove("light")
        })
        document.querySelectorAll(".list-item input").forEach(item => {
            item.classList.remove("light")
        })
        document.querySelector("#container-functionality").classList.remove("light")
        document.querySelector("#clear-completed-button > span").style.color = "var(--Very-Dark-Grayish-Blue)"
        document.querySelector("#items-count").style.color = "var(--Very-Dark-Grayish-Blue)"
        if(!(isClicked == 0)) {
            document.querySelector("#all-button > span").style.color = "var(--Very-Dark3-Grayish-Blue)"
        }
        if(!(isClicked == 1)) {
            document.querySelector("#active-button > span").style.color = "var(--Very-Dark3-Grayish-Blue)"
        }
        if(!(isClicked == 2)) {
            document.querySelector("#completed-button > span").style.color = "var(--Very-Dark3-Grayish-Blue)"
        }
        document.querySelector("#reminder").classList.remove("light")
        document.querySelector("#todo-list-container").classList.remove("light")
        document.querySelector(".mobile-block").classList.remove("light")
    }
    const newTheme = htmlBody.getAttribute("data-theme"); // Get the updated theme value
    if (newTheme !== theme) { // Check if the theme has actually changed
        theme = newTheme; // Update the theme variable
        if (theme === "light") {
            lightTheme();
        } else {
            darkTheme();
        }
    }
}

themeSwitcherButton.addEventListener("click", () => {
    if (theme === "light") {
        htmlBody.setAttribute("data-theme", "dark"); // Update the data-theme attribute
        localStorage.setItem("theme", "dark"); // Save the theme value to localStorage
    } else {
        htmlBody.setAttribute("data-theme", "light"); // Update the data-theme attribute
        localStorage.setItem("theme", "light"); // Save the theme value to localStorage
    }
});

const themeObserver = new MutationObserver(themeCallback)
themeObserver.observe(htmlBody, themeConfig)

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
    htmlBody.setAttribute("data-theme", storedTheme); // Set the theme according to the value stored in localStorage
}

//*


//* mobile block

const mobileButtons = document.querySelector(".mobile-templete")
const mobilBlock = document.querySelector(".mobile-block")

function move(oldParent, newParent){
    while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);   
    } 
}

if( window.innerWidth < 500) {
    move(mobileButtons, mobilBlock)
} else {
    move(mobilBlock, mobileButtons)
}

window.addEventListener("resize", () => {
    if( window.innerWidth < 500) {
        move(mobileButtons, mobilBlock)
    } else {
        move(mobilBlock, mobileButtons)
    }
})

//* 