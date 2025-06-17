export const getToday = () => {
	let tomorrow = new Date();
	tomorrow.setHours(tomorrow.getHours() + 8);
	tomorrow = tomorrow.toISOString().slice(0, 10);
	return tomorrow;
	// 2023-02-21 tanggal hari ini
};

export const date = (tanggal) => {
	let date;

	// Cek apakah input format seperti YYYY-MM-DD menggunakan regex sederhana
	if (/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
		// Jika format YYYY-MM-DD, buat objek Date dan tambah 1 hari
		date = new Date(tanggal);
		date.setDate(date.getDate() + 1);
	} else {
		// Format lain, langsung buat objek Date
		date = new Date(tanggal);
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const result = date.toLocaleDateString('id-ID', options);
	return result;
	// Contoh output: 'Senin, 20 Februari 2023'
}


export const date2 = (waktu) => {
	// Format input tanggal
	const inputDateString = waktu;
	const inputDate = new Date(inputDateString);

	// Mendapatkan jam, menit, dan detik
	const hours = inputDate.getUTCHours();
	const minutes = inputDate.getUTCMinutes();
	const seconds = inputDate.getUTCSeconds();

	// Mengonversi ke format "HH:MM:SS"
	const formattedTime =
		(hours < 10 ? '0' : '') +
		hours +
		':' +
		(minutes < 10 ? '0' : '') +
		minutes +
		':' +
		(seconds < 10 ? '0' : '') +
		seconds;

	return formattedTime;
};

export function date3(tanggal) {
	const date = new Date(tanggal);
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const result = date.toLocaleDateString('id-ID', options);
	return result;
	// 'Senin, 20 Februari 2023'
}

export const getYesterday = () => {
	let tomorrow = new Date();
	tomorrow.setHours(tomorrow.getHours() - 16);
	tomorrow = tomorrow.toISOString().slice(0, 10);
	return tomorrow;
	// 2023-02-21 tanggal hari ini
};





