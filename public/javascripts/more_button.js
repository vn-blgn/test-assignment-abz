const button = document.querySelector('#more');
let startFrom = 0;

const getMore = async function() {
    try {
        startFrom += 6;
        let data = {
            start: startFrom,
            id: this.name
        };
        const response = await fetch('/api/more', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok === true) {
            const result = await response.json();
            result.users.forEach(user => {
                let ul = document.querySelector('.users');
                let li = document.createElement('li');
                li.innerHTML = `<li><a href=/api/${data.id}/users/${user.userId}>${user.name}</a></li>`
                ul.append(li);
            });
        };

    } catch (error) {
        console.log(error);
        return error;
    };
};

button.addEventListener('click', getMore);