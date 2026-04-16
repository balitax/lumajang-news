import StaticPage from '../components/StaticPage';

const PedomanMediaPage: React.FC = () => {
  return (
    <StaticPage title="Pedoman Media">
      <p>
        Pedoman Pemberitaan Media Siber ini disusun sebagai panduan bagi seluruh civitas editorial LumajangNews dalam menjalankan fungsi, tugas, dan tanggung jawab pengusahaan media siber.
      </p>
      
      <h2>Verifikasi dan Keberimbangan Berita</h2>
      <ul>
        <li>Dalam prinsip pemberitaan, media siber wajib memenuhi standar verify, balance, dan fair.</li>
        <li>Seluruh berita yang dipublikasikan harus melalui proses verifikasi yang ketat.</li>
        <li>Setiap berita harus mengandung unsur-unsur 5W+1H (What, Who, When, Where, Why, How).</li>
        <li>Media siber wajib mengutamakan berita yang memiliki nilai informasi tinggi dan dampak luas.</li>
      </ul>
      
      <h2>Isi Konten</h2>
      <ul>
        <li>Media siber tidak boleh memuat berita yang tidak dapat dipertanggungjawabkan kebenarannya.</li>
        <li>Setiap opini, hasil survei, dan berita bersumber dari media lain wajib menyebutkan sumbernya.</li>
        <li>Media siber dilarang melakukan plagiat dan wajib menghormati hak kekayaan intelektual.</li>
        <li>Penyiaran gambar dan video kekerasan harus mempertimbangkan aspek kemanusiaan dan etika.</li>
      </ul>
      
      <h2>Penghormatan terhadap Privasi</h2>
      <ul>
        <li>Media siber wajib menghormati privasi individu sebagaimana dijamin oleh peraturan perundang-undangan.</li>
        <li>Pemberitaan tentang kasus seksual atau anak di bawah umur wajib dilindungi identitasnya.</li>
        <li>Pemberitaan tentang identitas seseorang yang dipidana harus mempertimbangkan asas praduga tidak bersalah.</li>
      </ul>
      
      <h2>Penanggung Jawab</h2>
      <p>
        Redaksi LumajangNews bertanggung jawab penuh atas seluruh isi publikasi dan siap menerima masukan dari pembaca serta pihak terkait lainnya.
      </p>
      
      <p>
        Pedoman ini dapat diubah atau diperbarui sesuai kebutuhan dengan mempertimbangkan perkembangan industri media dan regulasi yang berlaku.
      </p>
    </StaticPage>
  );
};

export default PedomanMediaPage;
