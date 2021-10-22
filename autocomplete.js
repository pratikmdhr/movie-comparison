const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b> Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
      `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = async (e) => {
    const items = await fetchData(e.target.value);

    // return if no movie found, or if input value =''
    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    items.forEach((item) => {
      const option = document.createElement('a');

      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        closeDropdown();
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(option);
    });

    // to hide dropdown
    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) {
        closeDropdown();
      }
    });
  };
  const closeDropdown = () => {
    dropdown.classList.remove('is-active');
  };
  input.addEventListener('input', debounce(onInput, 200));
};
