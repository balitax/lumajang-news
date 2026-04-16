import StaticPage from '../components/StaticPage';

const KontakPage: React.FC = () => {
  return (
    <StaticPage title="Kontak">
      <p>
        Kami senang mendengar dari Anda. Jangan ragu untuk menghubungi kami untuk pertanyaan, masukan, atau kerja sama.
      </p>
      
      <h2>Informasi Kontak</h2>
      
      <h3>Alamat</h3>
      <p>
        Redaksi LumajangNews<br />
        Kabupaten Lumajang<br />
        Jawa Timur, Indonesia
      </p>
      
      <h3>Email</h3>
      <ul>
        <li>Umum: <a href="mailto:info@lumajangnews.com">info@lumajangnews.com</a></li>
        <li>Redaksi: <a href="mailto:redaksi@lumajangnews.com">redaksi@lumajangnews.com</a></li>
        <li>Iklan: <a href="mailto:iklan@lumajangnews.com">iklan@lumajangnews.com</a></li>
      </ul>
      
      <h3>Telepon</h3>
      <p>(0334) xxx-xxxx (Hunter)</p>
      
      <h2>Media Sosial</h2>
      <ul>
        <li>Facebook: facebook.com/lumajangnews</li>
        <li>Twitter/X: @lumajangnews</li>
        <li>Instagram: @lumajangnews</li>
        <li>YouTube: LumajangNews Channel</li>
      </ul>
      
      <h2>Jam Operasional</h2>
      <ul>
        <li>Senin - Jumat: 08.00 - 17.00 WIB</li>
        <li>Sabtu: 08.00 - 12.00 WIB</li>
        <li>Minggu & Hari Libur: Tutup</li>
      </ul>
      
      <h2>Kirim Pesan</h2>
      <p>
        Untuk pengiriman press release, pengaduan, atau pertanyaan lainnya, silakan gunakan formulir kontak kami atau kirimkan email langsung ke alamat yang tertera di atas.
      </p>
      
      <p>
        Kami akan berusaha merespons pesan Anda dalam waktu 1x24 jam kerja.
      </p>
    </StaticPage>
  );
};

export default KontakPage;
