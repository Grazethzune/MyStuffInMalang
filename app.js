const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
});


const hiden = document.querySelectorAll('.hiden');
hiden.forEach((el) => observer.observe(el));
const slide_horizontal = document.querySelectorAll('.slide-horizontal');
slide_horizontal.forEach((el) => observer.observe(el));
const slide_vertical = document.querySelectorAll('.slide-vertical');
slide_vertical.forEach((el) => observer.observe(el));

const openPopupButton = document.getElementById('open-popup');
const popupForm = document.getElementById('popup-form');
const popupOverlay = document.getElementById('popup-overlay');
const closePopupButton = document.getElementById('close-popup');
const productForm = document.getElementById('product-form');


// Show pop-up
openPopupButton.addEventListener('click', () => {
  document.getElementById('submit-btn').innerHTML = 'Tambah Barang';
  document.getElementById('gambar-barang');
  document.getElementById('gambarInput').setAttribute('required', '');
  popupForm.style.display = 'flex';
  popupForm.style.justifyContent = 'center';
  popupForm.style.alignItems = 'center';
  popupOverlay.style.display = 'block';

  document.getElementById('nama-barang').value = '';
  document.getElementById('deskripsi-barang').value = '';
  document.getElementById('lokasi-ditemukan').value = '';
  productForm.dataset.editMode = '';
});

// Hide pop-up
closePopupButton.addEventListener('click', () => {
  popupForm.style.display = 'none';
  popupOverlay.style.display = 'none';
});

let Kategori = 'Barang Temuan';

async function kategori(kategori) {
  const barang_hilang = document.getElementById('Barang-Hilang');
  const barang_ditemukan = document.getElementById('Barang-Ditemukan');
  const button_popup = document.getElementById('open-popup');
  const label_lokasi = document.getElementById('label-lokasi');
  if(kategori == 'Barang Hilang'){
    barang_hilang.style.color = '#fff';
    barang_hilang.style.backgroundColor = '#1e57e8';
    barang_ditemukan.style.color = '#1e57e8';
    barang_ditemukan.style.backgroundColor = '#D9D9D9';
    button_popup.innerHTML = 'Kehilangan Barang?';
    label_lokasi.innerHTML = 'Lokasi kehilangan:';
    Kategori =  'Barang Hilang';
    fetchProducts()
  }else{
    barang_ditemukan.style.color = '#fff';
    barang_ditemukan.style.backgroundColor = '#1e57e8';
    barang_hilang.style.color = '#1e57e8';
    barang_hilang.style.backgroundColor = '#D9D9D9';
    button_popup.innerHTML = 'Menemukan Barang?';
    label_lokasi.innerHTML = 'Lokasi ditemukan:';
    Kategori = 'Barang Temuan';
    fetchProducts()
  }
}

async function fetchStatistik() {
  const Found = await fetch('http://127.0.0.1:8000/api/barang_temuan', {
  method: 'GET'
  });
    const responseData_Found = await Found.json();
    const Found_items = responseData_Found.data['data'];
  document.getElementById('barang-ditemukan').innerHTML = `Total Barang Ditemukan <br><br>${Found_items.length}`

  const Lost = await fetch('http://127.0.0.1:8000/api/barang_hilang', {
    method: 'GET'
    });
      const responseData_Lost = await Lost.json();
      const Lost_items = responseData_Lost.data['data'];
    document.getElementById('barang-hilang').innerHTML = `Total Barang Hilang <br><br>${Lost_items.length}`
  }
fetchStatistik()

//tampikan data
async function fetchProducts() {
  try {
    const response = await fetch(Kategori == 'Barang Temuan'? 'http://127.0.0.1:8000/api/barang_temuan' : 'http://127.0.0.1:8000/api/barang_hilang', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const products = responseData.data['data'];
    console.log(products);
    //rubah statistik 
    if (!Array.isArray(products)) {
      throw new Error('API did not return an array of products');
    }

    const container = document.getElementById('data-barang-container');
    container.innerHTML ='';
    products.forEach(product => {
      container.innerHTML += `
        <div class="data">
          <img src="${(Kategori == 'Barang Temuan') ? `http://127.0.0.1:8000/storage/barang_temuan/${product['gambar_barang']}` : `http://127.0.0.1:8000/storage/barang_hilang/${product['gambar_barang']}`}" alt="">
          <div class="lokasi-tanggal">
            <div class="name">
                <p>${product['nama_barang']}</p>
            </div>
            <div class="desc">
                <img src="images/deskripsi.png" alt="">
                <p>${product['deskripsi_barang']}</p>
            </div>
            <div class="image-and-location">
                <img src="images/Location.png" alt="">
                <p>${Kategori == 'Barang Temuan' ? product['lokasi_ditemukan'] : product['lokasi_kehilangan']}</p>
            </div>
            <div class="image-and-time">
                <img src="images/Clock.png" alt="">
                <p>${product['created_at']}</p>
            </div>
          </div>
          <div class="inter-btn">
            <div class="left-btn">
              <button onclick="deleteProduct(${product['id']})">Delete</button>
              <button onclick="editProduct(${product['id']}, '${product['nama_barang']}', '${product['deskripsi_barang']}', '${Kategori == 'Barang Temuan' ? product['lokasi_ditemukan'] : product['lokasi_kehilangan']}')">Edit</button>
            </div>
            <div class="btn">
              <button>Klaim barang</button>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    document.getElementById('data-barang-container').innerHTML = '<p>Failed to load products. Please try again later.</p>';
  }
}
fetchProducts();

async function findData(id, dateInput) {
  let name = document.getElementById(id).value;
  let date = document.getElementById(dateInput).value;
  console.log(date);
  const response = await fetch(Kategori == 'Barang Temuan'? `http://127.0.0.1:8000/api/barang_temuan/${name != '' ? name : date}` : `http://127.0.0.1:8000/api/barang_hilang/${name != '' ? name : date}`, {
    method: 'GET'
  });

  const responseData = await response.json();
  const products = name != '' || date != '' ? responseData.data : responseData.data['data'];
  console.log(products);
  const container = document.getElementById('data-barang-container');
  container.innerHTML ='';
    products.forEach(product => {
      container.innerHTML +=  `
        <div class="data">
          <img src="${(Kategori == 'Barang Temuan') ? `http://127.0.0.1:8000/storage/barang_temuan/${name != '' || date != '' ? product.gambar_barang : product['gambar_barang']}` : `http://127.0.0.1:8000/storage/barang_hilang/${name != '' || date != '' ? product.gambar_barang : product['gambar_barang']}`}" alt="${name !== '' || date !== '' ? product.nama_barang : product['nama_barang']}" class="gambar_barang">

          <div class="lokasi-tanggal">
            <div class="name">
                <p>${name != '' || date != '' ? product.nama_barang : product['nama_barang']}</p>
            </div>
            <div class="desc">
                <img src="images/deskripsi.png" alt="">
                <p>${name != '' || date != '' ? product.deskripsi_barang : product['deskripsi_barang']}</p>
            </div>
            <div class="image-and-location">
                <img src="images/Location.png" alt="">
                <p>${Kategori == 'Barang Temuan' ? name != '' || date != '' ? product.lokasi_ditemukan : product['lokasi_ditemukan'] : name != '' || date != '' ? product.lokasi_kehilangan : product['lokasi_kehilangan']}</p>
            </div>
            <div class="image-and-time">
                <img src="images/Clock.png" alt="">
                <p>${name != '' || date != '' ? product.created_at : product['created_at']}</p>
            </div>
          </div>
          <div class="inter-btn">
            <div class="left-btn">
              <button onclick="deleteProduct(${name != '' || date != '' ?product.id: product['id']})">Delete</button>
              <button onclick="editProduct(${name != '' || date != '' ?product.id: product['id']}, '${name != '' || date != '' ?product.nama_barang: product['nama_barang']}', '${name != '' || date != '' ?product.deskripsi_barang: product['deskripsi_barang']}', '${name != '' || date != '' ?product.lokasi_ditemukan: product['lokasi_ditemukan']}')">Edit</button>
            </div>
            <div class="btn">
              <button>Klaim barang</button>
            </div>
          </div>
        </div>
      `;
    });
}
 
  productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  popupForm.style.display = 'none';
  popupOverlay.style.display = 'none';

  const productName = document.getElementById('nama-barang').value;
  const deskripsi = document.getElementById('deskripsi-barang').value;
  const lokasi_ditemukan = document.getElementById('lokasi-ditemukan').value;
  const formData = new FormData();
  formData.append('nama_barang', productName);
  formData.append('deskripsi_barang', deskripsi);
  formData.append(Kategori == 'Barang Temuan' ? 'lokasi_ditemukan': 'lokasi_kehilangan', lokasi_ditemukan);
  formData.append('gambar_barang', document.querySelector('#gambarInput').files[0]); // Ambil file dari input
  
  const editId = productForm.dataset.editMode;
  if(editId) formData.append('_method', 'PUT'); 

  try {
    let response;
    if (editId) {
      // Update product
      response = await fetch(Kategori == 'Barang Temuan' ? `http://127.0.0.1:8000/api/barang_temuan/${editId}` : `http://127.0.0.1:8000/api/barang_hilang/${editId}`, {
        method: 'POST',
        body: formData // Jangan tambahkan header Content-Type
      });
    } else {
      // Add new product
      response = await fetch(Kategori == 'Barang Temuan' ? 'http://127.0.0.1:8000/api/barang_temuan' : 'http://127.0.0.1:8000/api/barang_hilang', {
        method: 'POST',
        body: formData // Jangan tambahkan header Content-Type
      });
    }

    // Tangani respons
    const result = await response.json();

    if (response.ok) {
      fetchProducts();
      fetchStatistik()
      if (!editId) productForm.reset();
    } else {
      // Tampilkan detail error dari server
      alert('Gagal menyimpan data: ' + (result.message || 'Terjadi kesalahan.'));
      console.error('Error:', result);
    }
  } catch (error) {
    // Tangani kesalahan jaringan
    console.error('Network Error:', error);
    alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
  }
});


async function editProduct(id, nama_barang, deskripsi, lokasi_ditemukan) {
  document.getElementById('submit-btn').innerHTML = 'Update Barang';
  document.getElementById('nama-barang').value = nama_barang;
  document.getElementById('deskripsi-barang').value = deskripsi;
  document.getElementById('lokasi-ditemukan').value = lokasi_ditemukan
  document.getElementById('gambarInput').removeAttribute('required');
  popupForm.style.display = 'flex';
  popupForm.style.justifyContent = 'center';
  popupForm.style.alignItems = 'center';
  popupOverlay.style.display = 'block';
  productForm.dataset.editMode = id;
}

  
  //hapus data
async function deleteProduct(id) {
  const response = await fetch(Kategori == 'Barang Temuan' ? `http://127.0.0.1:8000/api/barang_temuan/${id}` : `http://127.0.0.1:8000/api/barang_hilang/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    fetchProducts();
    fetchStatistik()
  }
}
