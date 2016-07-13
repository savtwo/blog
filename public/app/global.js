/**
 * Extend Object with prototypal extend functionality.
 * @author: http://aaditmshah.github.io/why-prototypal-inheritance-matters/#toc_5
 */
Object.defineProperty(Object.prototype, "extend", {
  value: function(extension) {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);

    for (var property in extension) {
      if (extension[property]) {
        if (hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
          object[property] = extension[property];
        }
      }
    }
    
    return object;
  }
});
