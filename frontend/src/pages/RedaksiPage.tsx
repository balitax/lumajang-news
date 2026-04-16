import StaticPage from '../components/StaticPage';

const RedaksiPage: React.FC = () => {
  return (
    <StaticPage title="Redaksi">
      <p>
        Redaksi LumajangNews terdiri dari tim profesional yang berdedikasi untuk menghadirkan berita berkualitas bagi masyarakat.
      </p>
      
      <h2>Struktur Redaksi</h2>
      
      <h3>Pemimpin Redaksi</h3>
      <p>Memimpin dan mengkoordinasikan seluruh kegiatan redaksional untuk memastikan kualitas dan keberlanjutan konten.</p>
      
      <h3>Editor</h3>
      <p>Menjamin akurasi dan kualitas setiap artikel sebelum dipublikasikan.</p>
      
      <h3>Reporter</h3>
      <p>Tim reporter kami tersebar di berbagai wilayah untuk memberikan liputan yang komprehensif.</p>
      
      <h3>Desainer & Produksi</h3>
      <p>Tim kreatif yang memastikan tampilan visual yang menarik dan mudah dipahami.</p>
      
      <h2>Jam Operasional</h2>
      <ul>
        <li>Senin - Jumat: 08.00 - 17.00 WIB</li>
        <li>Sabtu: 08.00 - 12.00 WIB</li>
        <li>Minggu & Hari Libur: Tutup</li>
      </ul>
      
      <p>
        Untuk kebutuhan peliputan di luar jam operasional, tim jaga kami siap menerima informasi melalui email dan media sosial.
      </p>
      
      <h2>Kontak Redaksi</h2>
      <p>
        Email: <a href="mailto:redaksi@lumajangnews.com">redaksi@lumajangnews.com</a><br />
        Telepon: (0334) xxx-xxxx<br />
        Alamat: Lumajang, Jawa Timur
      </p>
    </StaticPage>
  );
};

export default RedaksiPage;
