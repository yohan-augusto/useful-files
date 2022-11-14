
(function(win) {
    'use strict';
    
    var listeners = [], 
    doc = win.document, 
    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
    observer;
    
    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }
        
    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                // Make sure the callback isn't invoked with the 
                // same element more than once
                if (!element.ready) {
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }
 
    // Expose `ready`
    win.ready = ready;
            
})(this);
 
ready('#checkoutShippingAddress', function(element) {
    
    const phoneLabel = document.getElementById('phoneInput-label');
    const phoneInput = document.getElementById('phoneInput');
    
    phoneInput.addEventListener("focus", function () {
        this.style.borderColor = "#4496f6";
        this.style.boxShadow = "0 0 3px rgb(68 150 246 / 60%), inset 0 1px 1px rgb(0 0 255 / 0%)";
    });
    
    phoneInput.addEventListener('blur', function() {
        const value = this.value;
        const regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        const errorMessage = document.getElementById('phoneInput-field-error-message')
        
        
        if (value.match(regex)) {
            if (errorMessage) {
                errorMessage.remove()
                this.style.borderColor = '#ccc'
                phoneLabel.style.color = '#666';
            }
        } else {
            this.style.borderColor = '#d14343';
            this.style.boxShadow = '0 0 3px rgb(209 67 67 / 60%), inset 0 1px 1px rgb(0 0 255 / 0%)'
            phoneLabel.style.color = '#ed6a6a';
            
            if (!errorMessage) {
                const errorText = document.createElement("label");
                errorText.setAttribute("id", "phoneInput-field-error-message");
                errorText.textContent = 'Phone Number is invalid'
                errorText.setAttribute("class", "form-field--error form-inlineMessage")
                errorText.style.color = '#d14343';
                this.after(errorText);
            }
            this.value = ''
        } 
    });
});