import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const lutungKasarung = [
  `Di dalam istana yang megah, sang Raja duduk termenung. Usianya telah lanjut, tubuhnya melemah, dan satu pertanyaan terus 
  mengganggu pikirannya:\n\n\n<i>Siapa yang akan menggantikan takhta kerajaan?</i>\n\n\nIa memiliki beberapa putri yang tumbuh dengan baik.\n
  Masing-masing punya kelebihan, tapi satu di antaranya memiliki hati yang paling lembut.
  \nNamun… membuat pilihan bukanlah hal mudah bagi seorang ayah dan raja.\n\n\n\n\n`,
  `Pada suatu pagi yang cerah, sang Raja memanggil semua putrinya ke balairung istana.
  Ia berdiri tegak, namun matanya menyimpan haru.\n
  \n"Ayah akan segera menyerahkan takhta," katanya.\n
  "Dan pewaris kerajaan ini adalah… Purbasari."\n\n\n
  Para kakak Purbasari tersenyum dan memberi selamat.\n
  Mereka tahu adik bungsu mereka berhati baik.\n
  Namun, hanya satu yang tidak tersenyum—Purbararang.\n
  Ia menunduk, matanya tajam… hatinya terbakar cemburu.\n\n\n\n\n`,
  `Malam harinya, saat semua tertidur, Purbararang menyelinap keluar istana. Dengan langkah cepat, ia menuju hutan terlarang… 
  tempat tinggal seorang penyihir tua.\n
  "Aku ingin Purbasari terlihat buruk di mata ayah," bisiknya.\n
  Sang penyihir mengangguk dan menyiapkan ramuan.\n
  Cahaya hijau menyala dari tungku… \n
  Mantra pun dilepaskan.`,
  `Keesokan harinya, wajah dan tubuh Purbasari dipenuhi bercak gelap.
  Ia merasa lemas, bingung, dan ketakutan.\n
  Sang Raja memeluk putri bungsunya dengan mata berkaca-kaca.\n
  "Ayah tak tahu apa yang terjadi… tapi engkau terlihat seperti terkena kutukan," katanya.\n
  Dari kejauhan, Purbararang pura-pura prihatin—padahal hatinya puas.\n`,
  `Dengan berat hati, sang Raja mengambil keputusan. Untuk menjaga nama baik kerajaan, Purbasari harus diasingkan ke hutan.\n
  Purbasari tidak menangis. Ia hanya menunduk dan mencium tangan ayahnya.\n
  "Terima kasih, Ayah," katanya lirih.\n
  Dengan langkah perlahan, ia meninggalkan istana. Tanpa tahu, di hutan sana, takdir baru sedang menantinya.`,
  `Di tengah hutan yang sunyi, Purbasari duduk menangis.\n
  Air matanya jatuh tanpa henti, rasa sedih dan putus asa menyelimuti hatinya.\n
  Tiba-tiba, dari balik semak-semak, muncul seekor lutung hitam berbulu lebat.\n
 Lutung itu berjalan pelan mendekati Purbasari, lalu duduk di dekatnya.\n
 Ia tak bicara, hanya memandang lembut.\n
 Di tengah kesedihan itu, sebuah pertemanan lahir tanpa kata.\n\n\n\n\n
`,
  `Keesokan harinya, Lutung mengajak Purbasari menyusuri jalan setapak menuju air terjun suci.\n
Di sana, di bawah gemuruh air yang jatuh, Lutung Kasarung berdoa dalam diam.\n
Ia memejamkan mata, duduk bersila, dan membisikkan harapan untuk kesembuhan Purbasari.\n
Purbasari memperhatikannya dari belakang.\n
Ia tak tahu apa yang sedang Lutung lakukan,\n
tapi hatinya terasa lebih tenang dari sebelumnya.\n\n\n\n\n
`,
  `Hari demi hari berlalu. Perlahan, wajah Purbasari mulai bersinar kembali.\n
Bercak di kulitnya menghilang, dan senyumnya tumbuh kembali.\n
Ia dan Lutung bermain di hutan, dikelilingi hewan-hewan yang ramah—rusa, burung, dan kelinci.\n
Tawa mereka terdengar lembut di antara pepohonan.\n
Untuk pertama kalinya, Purbasari merasa damai… dan tidak sendiri.\n\n\n\n\n
`,
  `Di kejauhan, kereta kerajaan tampak datang menembus hutan.Roda kayunya bergerak pelan, seolah membawa harapan.
  Purbasari dan Lutung berhenti bermain.\nMereka saling menatap. Tak ada kata-kata, tapi keduanya tahu:\n
  inilah saatnya kembali.\n
   Perjalanan menuju istana akan segera dimulai—dan lembaran baru pun terbuka.\n\n\n\n\n
`,  `Setelah kembali ke istana, Purbasari disambut hangat oleh sang Raja, tapi tidak oleh semua orang.\n
Purbararang, kakaknya, merasa tak terima.\n
"Kalau memang kau pantas jadi ratu, buktikan lewat sayembara!" tantangnya.\n\n
Maka diumumkan tiga sayembara:
Memasak,
Menata rambut,
Memperkenalkan pasangan terbaik.\n
Rakyat berkumpul untuk menyaksikan.\n
Purbararang tampil percaya diri—sementara Purbasari tetap tenang.\n\n\n\n\n
`,  `Dalam sayembara memasak, Purbararang menyajikan hidangan mewah, tapi rasa masakan Purbasari yang sederhana justru menghangatkan hati semua orang.\n
 Dalam sayembara menata rambut, hiasan dan sisir emas kalah dari kilau alami rambut Purbasari.\n
 sayembara terakhir membuat semua terdiam: Purbararang menggandeng pangeran tampan,\n
 sementara Purbasari menunjuk… seekor lutung.\n
 "Ini sahabatku," katanya lembut.\n
 Orang-orang tertawa, tapi tidak lama.
  \nLutung Kasarung berubah menjadi Pangeran Guru Minda. Wibawanya memukau semua yang hadir.Kini tak ada lagi keraguan—Purbasari menang, dalam semua hal yang berarti.\n\n\n\n\n
`,  `Purbasari dan Guru Minda berdiri berdampingan di pelaminan istana.\n
Tak ada lagi kutukan, tak ada lagi cemburu—hanya cinta dan kedamaian. Bunga-bunga mekar, rakyat bersorak, dan musik mengalun lembut di seluruh penjuru istana.\n
 Sang Raja tersenyum bangga, menyaksikan putri bungsunya menikah dengan orang yang dipilih oleh hatinya sendiri.\n
Mereka tidak memerintah dengan kekuatan,tapi dengan kelembutan, kasih, dan kejujuran.Rakyat hidup sejahtera. Istana dipenuhi tawa.\n
Dan kisah mereka dikenang…\nsebagai bukti bahwa kebaikan akan selalu pulang sebagai pemenang.\n\n\n\n\n
`
];

const empatRaja = [
  `Di sebuah desa kecil yang damai, hidup sepasang raja dan ratu yang bijaksana. Hidup mereka penuh kasih, tapi satu hal masih belum mereka miliki, seorang anak.\n
  Setiap hari mereka berdoa, berharap, menanti. Hingga suatu pagi, mereka pergi ke hutan untuk mencari kayu.\n
  Namun yang mereka temukan bukanlah kayu, melainkan tujuh telur misterius, bercahaya lembut di balik semak-semak.\n\n\n\n\n
`,  `Beberapa waktu setelah dibawa pulang, lima dari tujuh telur perlahan mulai retak.\n
Dari dalamnya, lahir empat bayi laki-laki dan satu perempuan yang sehat, pintar dan lucu, mengisi hati sang raja dan ratu.\n
Satu telur yang tersisa utuh tetap disimpan sebagai tanda, bahwa keajaiban belum selesai.\n\n
`,  `Tahun-tahun berlalu dengan cepat.\n
Di bawah asuhan raja dan ratu, kelima anak itu tumbuh besar dalam cinta dan kebahagiaan.\n
Tiap hari di penuhi dengan tarian dan tawa bersama keluarga.\n\n
`,  `Setiap anak menunjukkan bakatnya sendiri:\n
War, si sulung, rajin merawat ladang, menggali tanah dan menanam sayuran.\n
Betani, cekatan dan gesit, berlatih memanah dan membantu berburu makanan.\n
Dohar, tenang dan tangguh,menggembala kambing dan menjaga ternak keluarga.\n
Mohamad, teliti dan kreatif, menenun atap dan membantu membangun rumah.\n
Pintole, si bungsu, lembut dan penuh perhatian, selalu ada untuk ibu dan saudara-saudaranya.\n
Mereka berbeda, tapi selalu saling melengkapi.\n\n\n\n\n
`,  `Saat anak-anak telah cukup besar,sang ayah memanggil keempat putranya ke halaman rumah. Ia membentangkan peta berisi pulau-pulau di lautan timur.\n
"Ini semua akan menjadi milik kalian," katanya.\n
"Tapi ingat… kekuasaan bukan untuk diri sendiri, tapi untuk melindungi sesama."\n\n\n\n\n
`,  `Tak lama setelah itu, sang Raja jatuh sakit.\n
Seluruh keluarga berkumpul di samping tempat tidurnya. Dengan suara lemah, ia menatap satu per satu anak-anaknya.\n
"Jangan lupakan asal kalian," ucapnya pelan.\n
Ketika ia berpulang, angin terasa hening… dan langit malam tampak lebih gelap dari biasanya.\n\n\n\n\n
`,  `War, Betani, Dohar, dan Mohamad berlayar ke pulau mereka masing-masing.\n
Di sana, mereka membangun, menjaga, dan memimpin dengan hati. Rakyat mencintai mereka. Pulau-pulau itu pun tumbuh damai di bawah perlindungan mereka.\n
Bijaksana dan cakap dalam memimpin nama mereka tersohor dengan sebutan Raja Ampat.\n
Empat saudara, empat pemimpin, satu warisan dari hutan dan langit.\n\n\n\n\n
`
];

const StorynoGame = () => {
  const { cerita } = useParams();
  const isLutung = cerita === 'lutung';
  const isEmpatRajaDemo = cerita === 'empat-raja';

  // Pilih array cerita dan total halaman
  const storyParagraphs = isLutung ? lutungKasarung : empatRaja;
  const totalPages = storyParagraphs.length;

  const [currentPage, setCurrentPage] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const paragraphRef = useRef(null);

  useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Penomoran gambar: lutung 01-12, empat raja 13-19
  const imagePage = isLutung ? currentPage : currentPage + 12;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Header with Image */}
      <div className="w-full h-72 relative overflow-hidden mt-0">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-white-600">memuat gambar...</p>
          </div>
        )}
        <img 
          src={`/images/story/Lutung${imagePage.toString().padStart(2, '0')}.webp`} 
          alt={`Story Page ${currentPage}`} 
          className="w-full h-full object-cover mt-0 mb-5"
          onLoad={handleImageLoad}
          onError={() => setIsImageLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end"></div>
      </div>
      
      {/* Back Button */}
      <Link to="/" className="absolute left-4 top-4 z-10 bg-white/30 rounded-full p-2">
        <img src="/images/back.png" alt="Back" className="w-6 h-6" />
      </Link>

      {/* Story Content */}
      <div id="storycontent" className="flex-1 px-5 py-4 bg-white rounded-t-3xl -mt-20 z-10 overflow-y-auto max-h-[calc(100vh-18rem)] shadow-lg">
        <div className="border-b border-gray-300 pb-4 mb-4">
          <h3 id="judulstory" className="text-1xl text-black text-left mb-4">
           <i>Cerita Rakyat:</i> <b>{isLutung ? "Lutung Kasarung" : "Empat Raja"}</b> 
          </h3>
          <p
            ref={paragraphRef}
            className="text-black-800 mb-0 border-t-2 text-left px-3 py-1 leading-relaxed text-base md:text-lg max-h-80 md:max-h-[60vh] overflow-y-auto"
          >
            {storyParagraphs[currentPage - 1].split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line.split(/<i>|<\/i>/g).map((segment, i) => 
                  i % 2 === 1 ? <i key={i}>{segment}</i> : segment
                )}
                <br />
              </React.Fragment>
            ))}
          </p>
           {/* Navigation Buttons */}
      <div id="navbutton" className="fixed bottom-0 left-0 right-0 flex flex-col items-center px-5 py-4 bg-white z-50">
        <div className="w-full flex justify-between items-center">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? 'opacity-50' : 'bg-black text-white'} text-xl font-bold`}
          >
            &lt;
          </button>
          
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? 'opacity-50' : 'bg-black text-white'} text-xl font-bold`}
          >
            &gt;
          </button>
        </div>

        {/* Tombol ke Mainkan Game dan MiniQuiz - hanya tampil jika bukan empat-rajademo */}
         <div className="w-full flex justify-center mt-1">
          <Link
            to={isLutung ? "/mini-quixx/lutung" : "/mini-quixx/empat-raja"}
            className="rounded-lg border-2 border-primary-orange bg-black text-primary-orange font-bold px-8 py-1.5 text-base shadow transition hover:bg-primary-orange hover:text-black"
          >
            Mulai Mini Quiz
          </Link>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default StorynoGame; 