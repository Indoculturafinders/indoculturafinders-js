document.addEventListener('DOMContentLoaded', () => {
    fetchProvinces();
    fetchCategories();

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        postData();
    });
});

let provinces = [];
let categories = [];

const fetchProvinces = () => {
    fetch('https://be.indoculturalfinder.my.id/api/provinces')
        .then(response => response.json())
        .then(data => {
            provinces = data.provinces;
            populateSelect('provinsiSelect', provinces);
        })
        .catch(error => console.error('Error fetching provinces:', error));
};

const fetchCategories = () => {
    fetch('https://be.indoculturalfinder.my.id/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data.Categories;
            populateSelect('kategoriSelect', categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
};

const populateSelect = (selectId, data) => {
    const selectElement = document.getElementById(selectId);

    selectElement.innerHTML = `<option>Pilih ${selectId.replace('Select', '')}</option>`;

    data.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
};

const postData = () => {
    const formData = new FormData(document.querySelector('form'));

    const cultureData = {
        province_id: findIdByName(formData.get('provinsi'), provinces),
        category_id: findIdByName(formData.get('kategori'), categories),
        name: formData.get('judul'),
        desc: formData.get('deskripsi'),
        img: formData.get('gambar'),
        video: formData.get('video'),
    };

    fetch('https://be.indoculturalfinder.my.id/api/cultures', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cultureData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                // Gantikan alert dengan SweetAlert
                Swal.fire('Berhasil!', 'Data berhasil disimpan.', 'success').then(() => {
                    location.reload();
                });
            } else {
                // Gantikan alert dengan SweetAlert
                Swal.fire('Error!', 'Terjadi kesalahan: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error posting data:', error);
            // Gantikan alert dengan SweetAlert
            Swal.fire('Error!', 'Terjadi kesalahan saat menyimpan data.', 'error');
        });
};


const findIdByName = (name, data) => {
    const selectedItem = data.find(item => item.name === name);
    return selectedItem ? selectedItem.id : null;
};
