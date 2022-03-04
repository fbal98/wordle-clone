const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        wordNumber:1,
        
    },
    
    pressed(value){
        
        let idFormat = "box"+this.properties.wordNumber+value.length;
        console.log(idFormat);
        document.getElementById(idFormat).innerHTML = value.at(-1)

       
    
    },
    
    doneClicked(){
        if(this.properties.value.length < 5){
            alert("bitch")
        }else{
            this.properties.wordNumber+=1
            this.properties.value=""
        }
        
    },
    
    
    init() {
        
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
             
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
             "a", "s", "d", "f", "g", "h", "j", "k", "l",
              "z","⌫", "x", "c", "v", "b", "n", "m", "done" 
            
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["p", "z"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "⌫":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("⌫");

                    keyElement.addEventListener("click", () => {
                        if(this.properties.value.length >0){
                            let idFormat = "box"+this.properties.wordNumber+this.properties.value.length;

                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                            this._triggerEvent("oninput");

                            document.getElementById(idFormat).innerHTML = ""
                        }
                        
                    });

                    break;

                

                case "done":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("done");

                    keyElement.addEventListener("click", () => {
                        this._triggerEvent("oninput");

                        Keyboard.doneClicked();
                    });

                    break;

                
                default:
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += key.toUpperCase();
                        
                        this._triggerEvent("oninput");
                        
                        if(this.properties.value.length <= 5){
                            Keyboard.pressed(this.properties.value);
                        }
                        
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;

        this.elements.main.classList.remove("keyboard--hidden");
        
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
        
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

