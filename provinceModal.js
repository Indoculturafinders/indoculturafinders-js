function openProvinceModal(provinceId) {
    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`)
        .then(response => response.json())
        .then(({ status, province, message }) => {
            if (status) {
                const provinceModalBody = document.getElementById('provinceModalBody');
                provinceModalBody.innerHTML = `
                    <p><strong>Nama Provinsi:</strong> ${province.name}</p>
                `;
                $('#provinceModal').modal('show');
            } else {
                console.error('Error:', message);
            }
        })
        .catch(error => console.error('Error:', error));
}
