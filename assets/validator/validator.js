const Validator = function (options) {
  const form = document.getElementById(options.id),

  // у псевдомассива нет метода filter поэтому нужно из псевдо сделать просто массив.
  // у псевдомассива нет свойства length и у него нет наследования от Array.prototype

   elementsForm = [...form.elements].filter(item => item.tagName !== 'BUTTON'),
   error = new Set(),
    //коллекция Set  в обычный массив нельзя поместить элемент, и туда не может попасть дважды одно и то же значение 
   pattern = {
       email: /ˆ\w+@\w+\.\w+$/,
       phone: /ˆ\+?[78]([()-]*\d){10}$/
   },
   validatorMethod = {
    notEmpty(elem) {
        if (elem.value.trim() === '') {
            return false;
        }
        return true;
    },
    pattern(elem, pattern) {
        return pattern.test(elem.value) //подходит ли строка к этому регулярному выражению?
    }
   };
  
 
     const isValid = (elem) => {
         const method = options.method[elem.id];
         if (method !== undefined) {
            return  method.every(item => validatorMethod[item[0]](elem, pattern[item[1]]));
         }
         return true;   
     };
     const checkIt = (event) => {
         let target = event.target; //элемент, на котором произошло событие
         if (isValid(target)) {
             showSuccess(target);
             error.delete(target)
         } else {
             showError(target);
             error.add(target); //добавляем в таргет  
         }
     }; 
       const checkItElem = (elem) => {
           console.log(elem)
              const temp =  elementsForm.some((item) => {
             console.log(item)
           });
           if (isValid(elem)) {
               showSuccess(elem);
               error.delete(elem)
           } else {
               showError(elem);
               error.add(elem); //добавляем в таргет  
           }
       };

   elementsForm.forEach((elem) => {
       elem.addEventListener('change', checkIt);
   });


  const showError = (elem) => {
    elem.classList.remove('validator_success');
    elem.classList.add('validator_error');
    if (!elem.nextElementSibling.classList.contains('error-message')) { 
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Ошибка в этом поле';
    errorDiv.classList.add('error-message');
    elem.insertAdjacentElement('afterend', errorDiv);// вставить элемент на страницу до или после или внутрь элемента
    }
   
  };
  const showSuccess = (elem) => {
    elem.classList.remove('validator_success');
    elem.classList.add('validator_success');
    // есть ли справа элемент с таким классом?;
    if (elem.nextElementSibling.classList.contains('error-message')) {
      elem.nextElementSibling.remove();
    }
  };
 //копируем паттерны из файла index и копируем в наш объект
  for (let key in options.pattern) {
      pattern[key] = options.pattern[key];
  }
  form.addEventListener('submit', () => {
      elementsForm.forEach((elem) => {
        checkIt(elem);
      });
      if (error.size) {
          event.preventDefault();
      }
  });
};
