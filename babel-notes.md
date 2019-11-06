Pro IE je třeba .remove() nahradit takto:

```javascript
if (isContainer) {
    var cont = document.querySelector("ul.swp-list .swp-upcoming-event-".concat(y));
    cont.parentNode.removeChild(cont);
}
```