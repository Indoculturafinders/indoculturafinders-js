document.addEventListener('DOMContentLoaded', () => {
    loadProvinceList();

    const addProvinceForm = document.getElementById('addProvinceForm');
    addProvinceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addProvince();
    });

    const provinceTableBody = document.getElementById('provinceTableBody');
    provinceTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteBtn')) {
            const provinceId = event.target.dataset.id;
            deleteProvince(provinceId);
        }
    });
});

function loadProvinceList() {
    fetch('https://be.indoculturalfinder.my.id/api/provinces')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                displayProvinceList(data.provinces);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayProvinceList(provinces) {
    const provinceTableBody = document.getElementById('provinceTableBody');
    provinceTableBody.innerHTML = '';

    const itemsPerPage = 10;
    let currentPage = 1;

    const renderPage = (pageNumber) => {
        provinceTableBody.innerHTML = '';

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const displayedProvinces = provinces.slice(startIndex, endIndex);

        displayedProvinces.forEach((province, index) => {
            const row = provinceTableBody.insertRow();
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${province.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm deleteBtn" data-id="${province.id}">Hapus</button>
                    <button class="btn btn-warning btn-sm editBtn" data-id="${province.id}">Edit</button>
                </td>
            `;
        });
    };

    const totalPages = Math.ceil(provinces.length / itemsPerPage);

    renderPage(currentPage);

    const nextProvincePage = document.getElementById('nextProvincePage');
    nextProvincePage.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    const prevProvincePage = document.getElementById('prevProvincePage');
    prevProvincePage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    provinceTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('editBtn')) {
            const provinceId = event.target.dataset.id;
            openEditProvinceModal(provinceId);
        }
    });
}

function openEditProvinceModal(provinceId) {
    const editForm = document.getElementById('editProvinceForm');

    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const province = data.provinces;
                editForm.innerHTML = `
                    <input type="hidden" name="provinceId" value="${province.id}">
                    <div class="mb-3">
                        <label for="editProvinceName" class="form-label">Nama Provinsi</label>
                        <input type="text" class="form-control" name="editProvinceName" value="${province.name}">
                    </div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary">Perbarui</button>
                    </div>
                `;

                editForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    updateProvinceData(event.currentTarget);
                });
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));

    $('#editProvinceModal').modal('show');
}

function updateProvinceData(form) {
    const formData = new FormData(form);

    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${formData.get('provinceId')}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.get('editProvinceName') }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Gantikan alert dengan SweetAlert
            Swal.fire('Berhasil!', 'Data berhasil diperbarui.', 'success').then(() => {
                loadProvinceList();
                $('#editProvinceModal').modal('hide');
            });
        } else {
            console.error('Error:', data.message);
            // Gantikan alert dengan SweetAlert
            Swal.fire('Error!', 'Terjadi kesalahan: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Gantikan alert dengan SweetAlert
        Swal.fire('Error!', 'Terjadi kesalahan saat memperbarui data.', 'error');
    });
}


function addProvince() {
    const provinceName = document.getElementById('provinceName').value;

    fetch('https://be.indoculturalfinder.my.id/api/provinces', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: provinceName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Gantikan alert dengan SweetAlert
            Swal.fire('Berhasil!', 'Data berhasil ditambahkan.', 'success').then(() => {
                loadProvinceList();
                document.getElementById('provinceName').value = '';
            });
        } else {
            console.error('Error:', data.message);
            // Gantikan alert dengan SweetAlert
            Swal.fire('Error!', 'Terjadi kesalahan: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Gantikan alert dengan SweetAlert
        Swal.fire('Error!', 'Terjadi kesalahan saat menambahkan data.', 'error');
    });
}


function deleteProvince(provinceId) {
    // Gantikan window.confirm dengan SweetAlert
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak dapat mengembalikan data yang dihapus!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    // Gantikan alert dengan SweetAlert
                    Swal.fire('Berhasil!', 'Data berhasil dihapus.', 'success').then(() => {
                        loadProvinceList();
                        location.reload();
                    });
                } else {
                    console.error('Error:', data.message);
                    // Gantikan alert dengan SweetAlert
                    Swal.fire('Error!', 'Terjadi kesalahan: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Gantikan alert dengan SweetAlert
                Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
            });
        }
    });
}

