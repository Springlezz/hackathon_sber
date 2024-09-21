(function () {
    'use strict';

    function $on(elem, event, callback) {
      elem.addEventListener(event, callback);
    }
    function $append(elem, ...children) {
      for (const child of children) {
        if (Array.isArray(child)) $append(elem, ...child);else elem.appendChild(child instanceof Node ? child : $T(child));
      }
    }
    function $clear(elem) {
      elem.textContent = '';
    }
    function $E(tag, props, children) {
      const elem = document.createElement(tag);
      for (const prop in props) {
        if (prop.startsWith('on')) $on(elem, prop.slice(2).toLowerCase(), props[prop]);else if (prop === 'classes') elem.className = props[prop].join(' ');else {
          const snakeProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          if (props[prop] === true) elem.setAttribute(snakeProp, '');else elem.setAttribute(snakeProp, props[prop]);
        }
      }
      $append(elem, ...children);
      return elem;
    }
    function $T(text) {
      return document.createTextNode(text || '');
    }
    function $toggleClasses(elem, ...classes) {
      const oldClasses = elem.className.split(' ');
      elem.className = [...oldClasses.filter(c => !classes.includes(c)), ...classes.filter(c => !oldClasses.includes(c))].join(' ');
    }

    function getApi(name, data = {}) {
      return fetch(`/api/${name}?` + Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')).then(r => r.json());
    }

    const $auth = document.getElementById('auth');
    function authShowUser(info) {
      $clear($auth);
      const menu = $E("div", {
        id: "menu"
      }, ["\n            ", $E("button", {
        onClick: () => location.href = '/profile/'
      }, ["\u041F\u0440\u043E\u0444\u0438\u043B\u044C"]), "\n            ", $E("button", {
        onClick: () => location.href = '/my-events/'
      }, ["\u041C\u043E\u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u044F"]), "\n            ", $E("button", {
        onClick: () => location.href = '/settings/'
      }, ["\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0306\u043A\u0438"]), "\n            ", $E("button", {
        onClick: function () {
          getApi('logout');
          authShowButtons();
        }
      }, ["\u0412\u044B\u0445\u043E\u0434"]), "\n        "]);
      $append($auth, $E("button", {
        onClick: () => $toggleClasses(menu, 'show')
      }, [info.firstName, " ", info.secondName]), menu);
    }
    function authShowButtons() {
      $clear($auth);
      $auth.append($E("button", {
        onClick: () => location.href = '/login/'
      }, ["\u0412\u0445\u043E\u0434"]), $E("button", {
        onClick: () => location.href = '/register/'
      }, ["\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F"]));
    }
    getApi('getUserInfo').then(function (info) {
      if (info.error) authShowButtons();else authShowUser(info);
    });

})();
