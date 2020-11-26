document.querySelector('#search-form').addEventListener('submit', e => {
    if(!document.querySelector('#search').value) e.preventDefault()
})