import StaticPage from '../components/StaticPage';

const ProfilPage: React.FC = () => {
  return (
    <StaticPage title="Profil">
      <p>
        <strong>LumajangNews</strong> adalah portal berita online yang menyajikan informasi terkini dan akurat dari Kabupaten Lumajang, Jawa Timur, untuk Indonesia.
      </p>
      
      <h2>Visi</h2>
      <p>
        Menjadi portal berita terdepan yang memberikan informasi cepat, akurat, dan terpercaya untuk masyarakat Lumajang dan sekitarnya.
      </p>
      
      <h2>Misi</h2>
      <ul>
        <li>Menyajikan berita yang aktual dan relevan untuk masyarakat</li>
        <li>Mengutamakan akurasi dan kredibilitas informasi</li>
        <li>Memberikan pelayanan informasi yang mudah diakses</li>
        <li>Membangun jurnalisme yang bertanggung jawab</li>
      </ul>
      
      <h2>Nilai Kami</h2>
      <ul>
        <li><strong>Kredibilitas</strong> - Kami memastikan setiap informasi yang kami sajikan telah diverifikasi</li>
        <li><strong>Akurasi</strong> - Berita yang kami tayangkan berasal dari sumber terpercaya</li>
        <li><strong>Kecepatan</strong> - Kami berkomitmen menyampaikan berita secara cepat</li>
        <li><strong>Independensi</strong> - Kami menjunjung tinggi independensi dalam peliputan</li>
      </ul>
      
      <p>
        LumajangNews berkomitmen menjadi teman informasi bagi masyarakat dalam memahami berbagai peristiwa dan isu yang terjadi di sekitar mereka.
      </p>
    </StaticPage>
  );
};

export default ProfilPage;
