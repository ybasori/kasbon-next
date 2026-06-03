## Setup:
### env untuk local

tambahkan file .env, dengan nama file .env, diisi dengan


NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

### migrate db
migrate dengan cara manual. buka file ./db.sql dan copy-paste isinya lalu masukan ke dalam SQL Editor pada Supabase

### Run
lalu jalankan dengan npm run dev

## Demo Link: https://kasbon-next.vercel.app/login
## Approach:
 Mohon maaf, approach saya pendek. Yang saya banggakan cuma sorting pada API. dimana sorting-nya itu tidak perlu di define lagi di API untuk colomn mana aja yang mau di sort, tinggal ditambahkan saja dari sisi FE-nya
## Trade-off:
jika ada satu hari lagi saya akan tambahkan grafik dan memperbaiki tampilan untuk mobile

## Tambahan library

  - qs untuk mengtranslate query pada url params
  - react-hook-form untuk memnunculkan validasi input
  - yup untuk mendefine validasi
  - @hookform/resolvers sebagai menyambung antara reac-hook-form dan yup
  - react-number-format untuk menjadikan input sebagai inputan currency
  - react-toastify untuk memunculkan pesan setiap kali ada response yang masuk setalah request API


## Time spent
  - jam 19.44 - jam 1.13 = 5 jam 29 menit
  - jam 9.00 - jam 19.00 = 10 jam
  - total time spent 15 jam 29 menit